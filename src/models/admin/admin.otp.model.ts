import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // TTL index -> 5 min
});

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;
