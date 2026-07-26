import express from "express";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { getAllUsers } from "../controllers/authController.js";

const router = express.Router();

// Helper function to sign JWT tokens cleanly
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, // Flattened payload for easy access in middleware
    process.env.JWT_SECRET,
    { expiresIn: "40h" },
  );
};

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Validation check
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // 2. Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Create user
    user = new User({ name, email, password });
    await user.save();

    // 4. Generate token and return response
    const token = generateToken(user);

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Validation check
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter email and password" });
    }

    // 2. Fetch user and EXPLICITLY include hidden password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // 3. Match password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // 4. Generate token and return response
    const token = generateToken(user);

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   GET /api/users/profile
// @desc    Get logged-in user profile
// @access  Private
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

// @route   PUT /api/users/change-password
// @desc    Change user password
// @access  Private
router.put("/change-password", protect, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    // 1. Validation check
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Please enter both current and new password" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters long" });
    }

    // 2. Fetch logged-in user and explicitly select hidden password
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Match old password using model method
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // 4. Update password and save (pre-save hook hashes the new password automatically)
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change Password Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   POST /api/users/forgot-password
// @desc    Request OTP for Forgot Password
// @access  Public
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Please provide an email" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email does not exist" });
    }

    // 1. Generate 6-digit random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Save OTP and 10-minute expiry time
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // 3. Nodemailer Transporter (Configured with IPv4 + Port 587 to fix ECONNREFUSED)
    // Nodemailer Transporter with SSL verification bypass
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // TLS upgrades connection automatically via STARTTLS
      family: 4, // Forces IPv4 resolution
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // 👈 Fixes "self-signed certificate" errors
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You requested to reset your password. Use the following 6-digit code to complete the process:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #ea2e0e; background: #f4f4f4; padding: 10px 20px; border-radius: 8px; display: inline-block;">
              ${otp}
            </span>
          </div>
          <p style="color: #666; font-size: 12px;">This code is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Reset code sent to your email" });
  } catch (error) {
    console.error("Forgot Password Error:", error.message);
    res.status(500).json({ message: "Server Error sending reset email" });
  }
});

// @route   POST /api/users/reset-password
// @desc    Verify OTP & Reset Password
// @access  Public
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters long" });
    }

    // Explicitly select hidden OTP fields from user schema
    const user = await User.findOne({ email }).select(
      "+resetOtp +resetOtpExpires",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify OTP validity and expiration
    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    if (user.resetOtpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP code has expired" });
    }

    // Update password (pre-save hook in User model automatically hashes this)
    user.password = newPassword;
    user.resetOtp = null;
    user.resetOtpExpires = null;

    await user.save();

    res
      .status(200)
      .json({ message: "Password reset successful! You can now log in." });
  } catch (error) {
    console.error("Reset Password Error:", error.message);
    res.status(500).json({ message: "Server Error resetting password" });
  }
});

router.get("/", protect, admin, getAllUsers);

export default router;
