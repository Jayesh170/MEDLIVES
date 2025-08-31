import bcrypt from "bcryptjs";
import Tenant from "../models/Tenant.js";
import User from "../models/User.js";

export const addUser = async (req, res) => {
  try {
    // req.user is populated by authenticate middleware
    const { name, mobile, email, role, password } = req.body;
    const { tenantCode, role: callerRole } = req.user;

    // Only owner can add users (you can extend to manager if needed)
    if (callerRole !== "owner") {
      return res.status(403).json({ error: "Only owner can add users" });
    }

    // Verify tenant exists
    const tenant = await Tenant.findOne({ tenantCode });
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    // Increment suffix atomically (ensures unique userId per tenant)
    const updatedTenant = await Tenant.findOneAndUpdate(
      { _id: tenant._id },
      { $inc: { lastUserSuffix: 1 } },
      { new: true }
    );

    // Generate unique userId (tenantCode + padded suffix)
    const suffix = String(updatedTenant.lastUserSuffix).padStart(3, "0");
    const newUserId = `${tenantCode}${suffix}`;

    // Hash password securely
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      tenant: tenant._id,
      tenantCode,
      userId: newUserId,
      name,
      mobile,
      email,
      role,
      passwordHash
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      userId: user.userId
    });
  } catch (err) {
    console.error("Add user error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
