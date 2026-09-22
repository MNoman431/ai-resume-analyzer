import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiErorr.js";
import User from "../models/user.model.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/apiResponse.js";

// auth code
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("TOKEN_GEN_ERROR:", error);
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const getCookieOptions = (req) => {
  const isProduction =
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL === "1" ||
    Boolean(process.env.VERCEL);
  
  // Production / Vercel / HTTPS mein secure: true aur sameSite: "none"
  const isHttps =
    isProduction ||
    Boolean(req?.secure) ||
    req?.headers?.["x-forwarded-proto"] === "https";

  return {
    httpOnly: true,
    secure: Boolean(isHttps), 
    sameSite: isHttps ? "none" : "lax", 
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

const registerUser = asyncHandler(async (req, res) => {
  console.log("REQ BODY:", req.body); // 👈 debug
  const { name, email, password } = req.body;

  const existedUser = await User.findOne({ email });
  if (existedUser) throw new ApiError(409, "User already exists");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = Date.now() + 10 * 60 * 1000;

  // Sirf create karein, email Model ka post-save hook khud bhej dega
  const user = await User.create({
    name,
    email,
    password,
    emailVerificationOTP: otp,
    emailVerificationExpiry: otpExpiry,
  });

  //  console.error("REGISTER ERROR:", error);
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { email: user.email },
        "Registration successful. OTP has been sent to your email.",
      ),
    );
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) throw new ApiError(400, "Email and OTP are required");

  const user = await User.findOne({
    email,
    emailVerificationOTP: otp,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  // Update user status
  user.isEmailVerified = true;
  user.emailVerificationOTP = undefined; // Clear OTP after use
  user.emailVerificationExpiry = undefined;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Email verified successfully. You can now login.",
      ),
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "Credentials required");

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(404, "User not found");
  // Check if email is verified
  if (!user.isEmailVerified) {
    throw new ApiError(403, "Please verify your email first.");
  }

  // DRY: Model method used here
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false }); // DB mein save karna lazmi hai

  const cookieOptions = getCookieOptions(req);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "Login success",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  if (req.user?._id) {
    await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: 1 } },
      { new: true },
    );
  }

  // Same options jo login ke waqt use kiye thay wahi yahan use karein,
  // otherwise some browsers may not clear the cookie correctly.
  const options = getCookieOptions(req);

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ success: true, message: "Logged out" }); // Direct JSON for testing
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.refreshToken || req.body?.refreshToken;
  // console.log("incomingToken from user controller 193line",incomingToken )
  if (!incomingToken) throw new ApiError(401, "Unauthorized request");

  try {
    const cookieOptions = getCookieOptions(req);

    const decoded = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);
    // console.log("decoded", decoded)
    const user = await User.findById(decoded?._id).select("+refreshToken");
    // console.log("user refresh token" , user )
    if (!user || incomingToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Token refreshed",
        ),
      );
  } catch (error) {
    console.log("Actual Error:", error.message);
    throw new ApiError(401, "Invalid refresh token");
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) throw new ApiError(400, "Token invalid or expired");

  // DRY: Direct password assign karein, Pre-save hook isse hash kar dega
  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;
  await user.save();

  res.status(200).json(new ApiResponse(200, {}, "Password reset success"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // 1. User ko dhoondo

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "can't find user with this email");
  }

  // 2. Secret Token banayein

  const resetToken = crypto.randomBytes(20).toString("hex");

  // 3. Token ko hash karke aur expiry (15 min) DB mein save karein

  user.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  // 4. Link banayein

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const htmlMessage = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; border: 1px solid #e2e8f0; border-radius: 8px; max-width: 600px; margin: auto; color: #1e293b;">
    <h2 style="color: #0f172a; border-bottom: 2px solid #22c55e; padding-bottom: 10px;">Password Reset Request</h2>
    
    <p style="margin-top: 20px; font-size: 16px; line-height: 1.6;">
      Hello,
    </p>
    
    <p style="font-size: 16px; line-height: 1.6;">
      We received a request to reset the password for your account. You can reset your password by clicking the button below:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
        Reset Your Password
      </a>
    </div>
    
    <p style="font-size: 14px; color: #64748b; line-height: 1.6;">
      <strong>Note:</strong> This link is valid for <strong>15 minutes</strong> only. If you did not request a password reset, please ignore this email or contact support if you have concerns.
    </p>
    
    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
    
    <p style="font-size: 14px; color: #94a3b8;">
      Best Regards,<br>
      <strong>The Support Team</strong>
    </p>
  </div>
`;

  try {
    await sendEmail({
      email: user.email,

      subject: "Password Reset Request",

      html: htmlMessage,
    });

    console.log("mail send to ", user.email);

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Email Sent. Please check your gmail."));
  } catch (error) {
    console.log("EMAIL ERROR DETAILS:", error);

    // Agar email na jaye to DB se token clear kar dein

    user.forgotPasswordToken = undefined;

    user.forgotPasswordExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    throw new ApiError(
      500,
      "Email bhejne mein masla hua. Baad mein koshish karein.",
    );
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Both old and new passwords are required");
  }

  // 1. User ko dhoondo (req.user verifyJWT middleware se aayega)
  const user = await User.findById(req.user?._id).select("+password");

  // 2. Purana password check karo (Model method use karke)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Purana password galat hai");
  }

  // 3. Naya password assign karo
  user.password = newPassword;

  // 4. Save karo (Pre-save hook khud hash kar dega)
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password successfully change ho gaya hai"));
});

const googleAuthCallback = asyncHandler(async (req, res) => {
  // 1. Tokens generate karein (req.user passport se aata hai)
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    req.user._id,
  );
  console.log("Callback hit with user:", req.user?._id || req.user);

  // 2. Cookie options set karein
  const options = getCookieOptions(req);
  console.log("Cookie Options being set:", options);

  // 3. Dynamic frontend redirect URL based on process.env.FRONTEND_URL
  let frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  // Check state if passed from frontend (e.g. if initiated from localhost:3000)
  if (req.query?.state) {
    try {
      const decodedOrigin = Buffer.from(req.query.state, "base64").toString("utf-8");
      if (decodedOrigin.startsWith("http://") || decodedOrigin.startsWith("https://")) {
        frontendUrl = decodedOrigin;
      }
    } catch (e) {
      console.warn("Could not decode OAuth state:", e);
    }
  }

  return res
    .cookie("token", accessToken, options)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .redirect(
      `${frontendUrl}/dashboard?token=${encodeURIComponent(accessToken)}&accessToken=${encodeURIComponent(accessToken)}&refreshToken=${encodeURIComponent(refreshToken)}`,
    );
});

// Current User ka subscription aur profile data lene ke liye
const getCurrentUser = asyncHandler(async (req, res) => {
  // 1. req.user verifyJWT middleware se aata hai
  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken",
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Current user fetched successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  resetPassword,
  forgotPassword,
  verifyEmail,
  changeCurrentPassword,
  generateAccessAndRefreshTokens,
  googleAuthCallback,
  getCurrentUser,
};
