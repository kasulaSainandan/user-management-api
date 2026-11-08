const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN === "*" ? "*" : process.env.CLIENT_ORIGIN,
  credentials: process.env.CLIENT_ORIGIN !== "*"
}));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." }
}));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "User Management API is running",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
