import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  mobile: { type: String, required: true, index: true },
  code: { type: String, required: true },
  verified: { type: Boolean, default: false },
  purpose: { type: String, default: "signup" }, // future-proof
  expiresAt: { type: Date, required: true }
});

OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL: auto-delete when expired

export default mongoose.model("Otp", OtpSchema);
