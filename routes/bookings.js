import express from "express";
import { body } from "express-validator";
import {
  createBooking,
  listBookings,
  getBooking,
} from "../controllers/bookingController.js";
import { protect } from "../middlewares/auth.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.post(
  "/:type",
  body("parentName").notEmpty(),
  body("parentPhone").notEmpty(),
  (req, res, next) => {
    const allowedTypes = ["session", "tour"];
    if (!allowedTypes.includes(req.params.type)) {
      return res.status(400).json({ error: "Invalid booking type" });
    }
    next();
  },
  asyncHandler(createBooking)
);

router.get("/", protect, asyncHandler(listBookings));
router.get("/:id", protect, asyncHandler(getBooking));

export default router;
