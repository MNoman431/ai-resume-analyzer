import dotenv from 'dotenv';
dotenv.config();
import app from './app.js'; // .js likhna mat bhoolna
import connectDB from './config/db.js';
import configurePassport from './config/passport.js';
import initCronJobs from './jobs/resetLimits.js';


const PORT = process.env.PORT || 5000;
const FALLBACK_BACKEND_URL = "https://ai-resume-analyzer-eta-umber.vercel.app";

await connectDB();
initCronJobs();

configurePassport(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
app.listen(PORT, () => {
    const callbackURL = process.env.GOOGLE_CALLBACK_URL || `${process.env.BACKEND_URL || FALLBACK_BACKEND_URL}/api/user/google/callback`;
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Google OAuth Authorized Redirect URI: ${callbackURL}`);
});