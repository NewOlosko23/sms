import express from "express";
import { createStaff, listStaff } from "../controllers/staffController.js";
import { protect, adminOnly } from "../middlewares/auth.js";
import { body } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.post(
  "/",
  protect,
  adminOnly,
  body("name").notEmpty(),
  body("email").isEmail(),
  body("phone").notEmpty(),
  body("password").isLength({ min: 6 }),
  asyncHandler(createStaff)
);

router.get("/", protect, adminOnly, asyncHandler(listStaff));

export default router;
