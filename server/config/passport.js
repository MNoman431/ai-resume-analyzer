import dotenv from "dotenv";
dotenv.config();

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import passport from "passport";

// Ek function banayein jo app.js se call hoga
const configurePassport = () => {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientID || !clientSecret) {
    console.warn("⚠️ Google OAuth credentials missing in environment variables. Google login will be disabled.");
    return;
  }

  const port = process.env.PORT || 5000;
  const callbackURL =
    process.env.GOOGLE_CALLBACK_URL ||
    `http://localhost:${port}/api/user/google/callback`;

  console.log(`🔐 Google OAuth Callback URL: ${callbackURL}`);

  passport.use(
    new GoogleStrategy(
      {
        clientID: clientID,
        clientSecret: clientSecret,
        callbackURL: callbackURL,
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            if (!user.googleId) {
              user.googleId = profile.id;
              user.avatar = profile.photos[0].value;
              user.isEmailVerified = true;
              await user.save({ validateBeforeSave: false });
            }
            return done(null, user);
          }

          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            avatar: profile.photos[0].value,
            isEmailVerified: true,
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      },
    ),
  );
};

configurePassport();

export default configurePassport;
