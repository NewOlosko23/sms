import bcrypt from "bcryptjs";
import User from "../models/User.js";

// Create staff user (admin only)
export const createStaff = async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  const existing = await User.findOne({ email });
  if (existing)
    return res
      .status(400)
      .json({ success: false, message: "Email already in use" });

  const hashed = await bcrypt.hash(password, 10);
  const staff = await User.create({
    name,
    email,
    phone,
    password: hashed,
    role: "staff",
  });

  res.status(201).json({
    success: true,
    data: {
      id: staff._id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
    },
  });
};

export const listStaff = async (req, res) => {
  const staff = await User.find({ role: "staff" }).select("-password");
  res.json({ success: true, data: staff });
};
