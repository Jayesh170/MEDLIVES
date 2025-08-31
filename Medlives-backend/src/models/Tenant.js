import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const tenantSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  ownerName: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  licenseNo: { type: String, required: true, unique: true },
  tenantCode: { type: Number, unique: true }, // e.g., 126
  password: { type: String, required: true }, // ✅ Added password
}, { timestamps: true });

// Hash password before save
tenantSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
tenantSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Tenant", tenantSchema);
