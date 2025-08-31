import { generateToken } from "../middleware/auth.js";
import Counter from "../models/Counter.js";
import Otp from "../models/Otp.js";
import Tenant from "../models/Tenant.js";
import User from "../models/User.js";

const OTP_EXPIRY_MIN = Number(process.env.OTP_EXPIRY_MIN || 5);

// helper: get next tenant code (atomic)
async function getNextTenantCode() {
  const doc = await Counter.findOneAndUpdate(
    { _id: "tenantCode" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return Number(doc.seq); // ensure it's numeric
}

// helper: generate next user id inside tenant
async function generateUserIdForTenant(tenantCode) {
  const doc = await Counter.findOneAndUpdate(
    { _id: `user-${tenantCode}` },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return Number(`${tenantCode}${String(doc.seq).padStart(3, "0")}`);
}

// send OTP
export const sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ error: "mobile required" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MIN * 60 * 1000);

    await Otp.create({ mobile, code, expiresAt, purpose: "signup", verified: false });

    console.log(`OTP for ${mobile} is ${code}`);
    res.json({ success: true, message: "OTP sent", otp: code });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { mobile, code } = req.body;
    if (!mobile || !code) return res.status(400).json({ error: "mobile & code required" });

    const otpDoc = await Otp.findOne({ mobile, code, purpose: "signup" });
    if (!otpDoc) return res.status(400).json({ error: "Invalid OTP" });
    if (otpDoc.expiresAt < new Date()) return res.status(400).json({ error: "OTP expired" });

    otpDoc.verified = true;
    await otpDoc.save();

    res.json({ success: true, message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// register tenant (with owner user)
export const registerTenant = async (req, res) => {
  try {
    const { businessName, ownerName, mobile, email, licenseNo, password } = req.body;
    if (!businessName || !ownerName || !mobile || !email || !licenseNo || !password) {
      return res.status(400).json({ error: "missing fields" });
    }

    // Check OTP verified
    const otpDoc = await Otp.findOne({ mobile, purpose: "signup", verified: true });
    if (!otpDoc) return res.status(400).json({ error: "Mobile not verified via OTP" });

    // unique checks
    if (await Tenant.findOne({ mobile })) return res.status(400).json({ error: "Mobile already used" });
    if (await Tenant.findOne({ email })) return res.status(400).json({ error: "Email already used" });

    const tenantCode = await getNextTenantCode();

    // create tenant
    const tenant = await Tenant.create({
      businessName,
      ownerName,
      mobile,
      email,
      licenseNo,
      tenantCode,
      password, // will hash via pre-save hook
    });

    // create owner user
    const ownerUserId = await generateUserIdForTenant(tenantCode);
    const ownerUser = await User.create({
      tenantCode,
      userId: ownerUserId,
      name: ownerName,
      role: "admin", // owner becomes admin
      password,      // hashed by pre-save hook
    });

    await Otp.deleteMany({ mobile, purpose: "signup" });

    res.status(201).json({
      success: true,
      tenantCode,
      ownerUserId,
      password, // Include the original password for display
      ownerName,
      businessName,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// login (user login only)
export const login = async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password) {
      return res.status(400).json({ error: "UserId and password required" });
    }

    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ error: "User not found" });

    const ok = await user.matchPassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid password" });

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        userId: user.userId,
        tenantCode: user.tenantCode,
        role: user.role,
        name: user.name,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
