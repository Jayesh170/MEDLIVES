import express from "express";
import {
    login,
    registerTenant,
    sendOtp,
    verifyOtp
} from "../controllers/authController.js";

const router = express.Router();

/**
 * Auth Routes
 * - OTP routes are still for tenant registration flow
 * - Login now uses { userId, password } instead of mobile/email
 */

router.post("/send-otp", sendOtp);           // Step 1: Send OTP
router.post("/verify-otp", verifyOtp);       // Step 2: Verify OTP
router.post("/register-tenant", registerTenant); // Step 3: Register Tenant
router.post("/login", login);                // Login with userId + password

export default router;
