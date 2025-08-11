import Booking from "../models/Booking.js";
import { sendSMS, sendEmail } from "../utils/notify.js";

export const createBooking = async (req, res) => {
  const type = req.params.type;
  if (!["session", "tour"].includes(type)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid booking type" });
  }

  const {
    parentName,
    parentPhone,
    parentEmail,
    childName,
    childAge,
    date,
    time,
    programType,
    notes,
  } = req.body;

  // Basic validation
  if (!parentName || !parentPhone) {
    return res
      .status(400)
      .json({ success: false, message: "Parent name and phone are required" });
  }

  const booking = await Booking.create({
    type,
    parentName,
    parentPhone,
    parentEmail,
    childName,
    childAge,
    date,
    time,
    programType,
    notes,
  });

  // Prepare notification message
  const smsMessage = `New ${type} booking from ${parentName} (${parentPhone}). Date: ${
    date || "N/A"
  } Time: ${time || "N/A"}. Check dashboard for details.`;
  const emailSubject = `New ${type} booking — Lamasha Daycare`;
  const emailText = `
New ${type} booking

Parent: ${parentName}
Phone: ${parentPhone}
Email: ${parentEmail || "N/A"}
Child: ${childName || "N/A"} (${childAge || "N/A"})
Date: ${date || "N/A"}
Time: ${time || "N/A"}
Program: ${programType || "N/A"}
Notes: ${notes || "N/A"}

Booking ID: ${booking._id}
`;

  // Send SMS & Email but don't block response heavily
  try {
    sendSMS(smsMessage).then((r) => {
      if (!r.success) console.warn("SMS not sent", r);
    });
  } catch (e) {
    console.error("SMS send error", e);
  }

  try {
    sendEmail(emailSubject, emailText, `<pre>${emailText}</pre>`).then((r) => {
      if (!r.success) console.warn("Email not sent", r);
    });
  } catch (e) {
    console.error("Email send error", e);
  }

  res.status(201).json({ success: true, data: booking });
};

export const listBookings = async (req, res) => {
  // protected route (admin/staff)
  const bookings = await Booking.find().sort({ createdAt: -1 });
  res.json({ success: true, data: bookings });
};

export const getBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking)
    return res
      .status(404)
      .json({ success: false, message: "Booking not found" });
  res.json({ success: true, data: booking });
};
