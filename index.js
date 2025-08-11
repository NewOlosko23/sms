import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import staffRoutes from "./routes/staff.js";
import bookingRoutes from "./routes/bookings.js";
import errorHandler from "./middlewares/errorHandler.js";
import morgan from "morgan";
import { protect, adminOnly } from "./middlewares/auth.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/bookings", bookingRoutes);

// example dashboard route
app.get("/api/dashboard", protect, adminOnly, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to admin dashboard",
    user: req.user,
  });
});

// error handler (last)
app.use(errorHandler);

// start server
const PORT = process.env.PORT || 5000;
const start = async () => {
  await connectDB(process.env.MONGO_URI || "mongodb://localhost:27017/lamasha");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();
