import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["session", "tour"], required: true },
    parentName: { type: String, required: true },
    parentPhone: { type: String, required: true },
    parentEmail: { type: String },
    childName: { type: String },
    childAge: { type: Number },
    date: { type: String },
    time: { type: String },
    programType: { type: String },
    notes: { type: String },
    status: {
      type: String,
      enum: ["new", "seen", "confirmed", "rejected"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
