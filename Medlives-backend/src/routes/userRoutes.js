import express from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import Tenant from "../models/Tenant.js";
import User from "../models/User.js";

const router = express.Router();

// Add new user (admin only)
router.post("/add", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const { name, mobile, email, role, password } = req.body;
    const { tenantCode } = req.user; // populated by middleware

    // Find tenant
    const tenant = await Tenant.findOne({ tenantCode });
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    // Increment suffix safely (atomic)
    const updatedTenant = await Tenant.findOneAndUpdate(
      { _id: tenant._id },
      { $inc: { lastUserSuffix: 1 } },
      { new: true }
    );

    const suffix = String(updatedTenant.lastUserSuffix).padStart(3, "0");
    const newUserId = `${tenantCode}${suffix}`;

    // Create user
    const user = await User.create({
      tenant: tenant._id,
      tenantCode: tenant.tenantCode,
      userId: newUserId,
      name,
      mobile,
      email,
      role,
      password
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      userId: user.userId,
      role: user.role
    });
  } catch (err) {
    console.error("Error in addUser:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all users for tenant (admin only)
router.get("/", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const { tenantCode } = req.user;
    
    const users = await User.find({ tenantCode }).select("-password");
    
    res.json({
      success: true,
      users
    });
  } catch (err) {
    console.error("Error getting users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user profile
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    
    res.json({
      success: true,
      user
    });
  } catch (err) {
    console.error("Error getting profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update user profile
router.put("/profile", authenticate, async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select("-password");
    
    res.json({
      success: true,
      user
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Change password
router.put("/change-password", authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete user (admin only)
router.delete("/:userId", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const { userId } = req.params;
    const { tenantCode } = req.user;
    
    const user = await User.findOneAndDelete({ userId, tenantCode });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
