import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  changeCurrentPassword,
  googleAuthCallback,
  getCurrentUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import passport from "passport";

const router = Router();
const fallbackFrontendUrl = "http://localhost:3000";
const frontendUrl = process.env.FRONTEND_URL || fallbackFrontendUrl;

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refreshAccessToken", refreshAccessToken);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);
router.post("/verifyEmail", verifyEmail);
router.post("/changeCurrentPassword", verifyJWT, changeCurrentPassword);
router.post("/logout", verifyJWT, logoutUser);

router.get("/google", (req, res, next) => {
  const origin =
    req.query.origin ||
    (req.headers.referer ? new URL(req.headers.referer).origin : undefined);
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account consent",
    access_type: "offline",
    state: origin ? Buffer.from(origin).toString("base64") : undefined,
  })(req, res, next);
});

// 2. Google Callback (Jahan Google wapas bhejega)
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${frontendUrl}/login`,
  }),
  googleAuthCallback,
);

router.get(
  "/google/back",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${frontendUrl}/login`,
  }),
  googleAuthCallback, // Clean controller call
);

router.get("/getCurrentUser", verifyJWT, getCurrentUser);

export default router;
