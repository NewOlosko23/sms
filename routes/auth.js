import express from "express";
import { body } from "express-validator";
import { registerAdmin, login } from "../controllers/authController.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.post(
  "/register",
  body("name").notEmpty(),
  body("email").isEmail(),
  body("phone").notEmpty(),
  body("password").isLength({ min: 6 }),
  asyncHandler(registerAdmin)
);

router.post(
  "/login",
  body("email").isEmail(),
  body("password").notEmpty(),
  asyncHandler(login)
);

export default router;
