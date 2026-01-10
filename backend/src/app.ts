import 'dotenv/config'
import express,  {Request, Response, NextFunction } from 'express'
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.route.js'
import cors from 'cors'
import type { Express } from 'express';
import helmet from 'helmet';

const allowedOrigin = [
    'http://localhost:5173',
    'https://otpbasedauth.vercel.app'
]

const app:Express = express();

app.set("trust proxy", 1);

// logging FIRST
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// HTTPS enforcement
app.use((req, res, next) => {
  // allow preflight
  if (req.method === "OPTIONS") {
    return next();
  }

  if (req.secure || req.headers["x-forwarded-proto"] === "https") {
    return next();
  }

  // allow localhost http for dev
  if (req.headers.host?.startsWith("localhost")) {
    return next();
  }

  return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
});

// enable hsts
app.use(
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  })
);

// CORS before routes
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

 

// parsers
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.get("/health", (_, res) => res.send("OK"));

// global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Global error:", err);
  res.status(500).json({ success: false, msg: "Something went wrong" });
});

export default app;
 

 