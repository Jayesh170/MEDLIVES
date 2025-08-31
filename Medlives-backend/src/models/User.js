import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  tenantCode: { type: Number, required: true },   // Belongs to which pharmacy
  userId: { type: Number, unique: true },         // Auto-generated e.g. 126001
  name: { type: String, required: true },
  role: { type: String, enum: ["staff", "admin"], default: "staff" },
  password: { type: String, required: true },     // Login password
}, { timestamps: true });

// Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
