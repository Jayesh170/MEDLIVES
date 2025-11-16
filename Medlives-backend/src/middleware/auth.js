import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Create JWT for a user
export const generateToken = (user) => {
  const jwtSecret = process.env.JWT_SECRET;
  
  if (!jwtSecret) {
    console.error("❌ JWT_SECRET is not set in environment variables!");
    console.error("Available env vars:", Object.keys(process.env).filter(k => k.includes('JWT')));
    throw new Error("JWT_SECRET is not configured. Please set it in your .env file.");
  }
  
  return jwt.sign(
    {
      id: user._id,            // MongoDB _id
      userId: user.userId,     // Auto-generated userId
      tenantCode: user.tenantCode,
      role: user.role,
    },
    jwtSecret,
    { expiresIn: "7d" } // token validity
  );
};

// Middleware: Check JWT & attach user
export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get latest user info from DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user; // attach user object (safe, no password)
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Middleware: Restrict route to specific roles
export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Allow if role matches OR user is admin
    if (req.user.role !== role && req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
};
