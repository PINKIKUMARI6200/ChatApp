import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./SocketIO/server.js";

dotenv.config();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// MongoDB Connection
const PORT = process.env.PORT || 4001;
const URI = process.env.MONGODB_URI;

try {
  mongoose.connect(URI);
  console.log("✅ Connected to MongoDB");
} catch (error) {
  console.log("❌ MongoDB connection error:", error);
}

// Routes
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);

// ---------------- Deployment Setup ----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./frontend/dist")));

 app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "./frontend/dist/index.html"));
});
}

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
