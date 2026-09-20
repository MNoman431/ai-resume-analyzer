import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
import passport from 'passport';
import "./config/passport.js";

// Routes & Middlewares
import userRouter from './routes/user.route.js'
import resumeRouter from './routes/resume.route.js'
import stripeRouter from './routes/stripe.route.js'
import { errorHandler } from './middleware/error.middleware.js';
import { stripeWebhook } from './webhooks/stripe.webhook.js';

const app = express();
// Vercel runs behind a proxy; trust it so req.secure/protocol reflect HTTPS.
app.set("trust proxy", true);

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://ai-resume-analyzer-frontend-0078.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean); // Taake undefined values nikal jayein

// 1. CORS Middleware - Sabse upar
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS Blocked for:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

/** * FIX: 'app.options' wali crash karne wali line ko hata kar 
 * simple 'app.use' middleware use karein Pre-flight ke liye.
 */
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// 2. Stripe Webhook (Keep before express.json)
app.post("/webhook", express.raw({ type: 'application/json' }), stripeWebhook);

// 3. Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// 4. Routes
app.use("/user", userRouter);
app.use("/api/user", userRouter);
app.use("/resume", resumeRouter);
app.use("/api/resume", resumeRouter);
app.use("/stripe", stripeRouter);
app.use("/api/stripe", stripeRouter);

app.get('/', (req, res) => {
    res.send('API is live and kicking! 🚀');
});

app.use(errorHandler);

export default app;