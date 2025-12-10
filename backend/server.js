// server.js (fixed)
import dotenv from "dotenv";
dotenv.config(); // <-- MUST run before imports that use process.env

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

console.log("OPENAI_API_KEY present?:", !!process.env.OPENAI_API_KEY);

const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/ai", aiRoutes);

// Optional ping check
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong", time: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
