import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Load env
dotenv.config();

// ── ENV VALIDATION ────────────────────────────────────────────────
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not set in .env");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is not set in .env");
  process.exit(1);
}

// ── APP INIT ──────────────────────────────────────────────────────
const app = express();

// ── CORS (works with Nginx reverse proxy) ─────────────────────────
app.use(cors({
  origin: "https://kindmatch.serveblog.net",
  credentials: true
}));

// ── MIDDLEWARE ───────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── ROUTES ───────────────────────────────────────────────────────
import authRoutes from "./routes/auth.js";   // ✅ your file
import matchesRoutes from "./routes/matches.js";
import profileRoutes from "./routes/profile.js";
import swipeRoutes from "./routes/swipe.js";
app.use("/api/auth", authRoutes);
app.use("/api/matches", matchesRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/swipe", swipeRoutes);

// ── HEALTH CHECK ─────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// ── GLOBAL ERROR HANDLER ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

// ── DATABASE + SERVER START ──────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });