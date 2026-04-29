const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

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
// FRONTEND_URL is set in .env — e.g. https://kind-match.serveblog.net
const allowedOrigin = process.env.FRONTEND_URL;
if (!allowedOrigin) {
  console.warn("⚠️  FRONTEND_URL is not set — CORS will block all browser requests");
}
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

// Trust the first proxy (Nginx) so req.ip and X-Forwarded-Proto are correct
app.set("trust proxy", 1);

// ── MIDDLEWARE ───────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── ROUTES ───────────────────────────────────────────────────────
const authRoutes    = require("./routes/auth");
const matchesRoutes = require("./routes/matches");
const profileRoutes = require("./routes/profile");
const swipeRoutes   = require("./routes/swipe");

app.use("/api/auth",    authRoutes);
app.use("/api/matches", matchesRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/swipe",   swipeRoutes);

// ── HEALTH CHECK ─────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// ── GLOBAL ERROR HANDLER ─────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
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
