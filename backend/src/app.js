require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const app = express();
const courseRoutes = require('./routes/courseRoutes');
const lessonRoutes = require("./routes/lessonRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/courses', courseRoutes);
app.use("/api/courses/:courseId/lessons", lessonRoutes);

// Root Route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Lumora API"
  });
});

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK"
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

module.exports = app;

