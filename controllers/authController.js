const User = require("../models/Usermodel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/email");

// In-memory OTP store (for dev/testing use)
const otpStore = new Map();

// Signup controller
exports.signup = async (req, res) => {
  try {
    const {
      fullName,
      username,
      email,
      password,
      confirmPassword,
      number,
      gender,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const user = new User({
      fullName,
      username,
      email,
      password, // Will be hashed in pre-save hook
      number,
      gender,
    });

    console.log("Attempting to save user...");
    await user.save();
    console.log("User saved successfully.");

    // Generate session token
    const token = crypto.randomBytes(32).toString("hex");
    req.session.user = { id: user._id, email: user.email, token };
    res.status(201).json({
      message: "Signup successful",
      token,
      userId: user._id.toString(),
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Login controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    // Generate session token
    const token = crypto.randomBytes(32).toString("hex");
    req.session.user = { id: user._id, email: user.email, token };
    res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id.toString(),
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Logout controller
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully" });
  });
};
exports.sendOtp = async (req, res) => {
  try {
    let email = req.body?.email || req.query?.email;
    if (!email) {
      return res
        .status(400)
        .json({ error: "Email is required in body or query" });
    }

    email = email.trim().toLowerCase(); // Normalize email

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = crypto.randomInt(100000, 999999).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
    otpStore.set(email, { otp, expires });

    console.log(
      `Storing OTP for ${email}: ${otp} (expires at ${new Date(
        expires
      ).toISOString()})`
    );

    const message = `Your password reset OTP is: ${otp}. It will expire in 10 minutes.`;

    await sendEmail({
      email,
      subject: "Your OTP Code",
      message,
    });

    res.status(200).json({ message: `OTP sent to ${email}` });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({
      error: "Failed to send OTP",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Reset password using OTP
exports.resetPassword = async (req, res) => {
  try {
    let { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    email = email.trim().toLowerCase(); // Normalize email

    const record = otpStore.get(email);

    console.log("---- Reset Password Debug ----");
    console.log("Email:", email);
    console.log("OTP from client:", otp);
    console.log("Stored OTP record:", record);
    console.log("Current time:", Date.now());
    console.log("OTP expires at:", record ? record.expires : "No record");

    if (!record) {
      return res
        .status(400)
        .json({ error: "No OTP record found for this email" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ error: "OTP does not match" });
    }

    if (Date.now() > record.expires) {
      otpStore.delete(email); // Clean expired OTP
      return res.status(400).json({ error: "OTP expired" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.password = newPassword;
    await user.save();

    otpStore.delete(email); // Remove OTP after successful reset

    await sendEmail({
      email,
      subject: "Password Reset Successful",
      message: "Your password has been reset successfully.",
    });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
