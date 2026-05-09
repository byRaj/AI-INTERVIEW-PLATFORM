const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");
const sendOTP = require("../services/mail.service");

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */
async function registerUserController(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Please provide username, email and password",
    });
  }

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "Account already exists with this email address or username",
    });
  }

  // 🔐 hash password
  const hash = await bcrypt.hash(password, 10);

  // 🔢 generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // 👤 create user (NOT verified yet)
  const user = await userModel.create({
    username,
    email,
    password: hash,
    otp,
    otpExpires: Date.now() + 5 * 60 * 1000, // 5 mins
    isVerified: false,
  });

  // 📧 send OTP email
  await sendOTP(email, otp);

  // ✅ response (NO TOKEN HERE)
  res.status(201).json({
    message: "OTP sent to your email",
    userId: user._id,
  });
}

/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({
    message: "User loggedIn successfully.",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req, res) {
  const token = req.cookies.token;

  if (token) {
    await tokenBlacklistModel.create({ token });
  }

  res.clearCookie("token");

  res.status(200).json({
    message: "User logged out successfully",
  });
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
async function getMeController(req, res) {
  const user = await userModel.findById(req.user.id);

  res.status(200).json({
    message: "User details fetched successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

async function verifyOtpController(req, res) {
  const { userId, otp } = req.body;

  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // ❌ wrong or expired OTP
  if (user.otp !== otp || user.otpExpires < Date.now()) {
    return res.status(400).json({
      message: "Invalid or expired OTP",
    });
  }

  // ✅ mark user verified
  user.isVerified = true;
  user.otp = null;
  user.otpExpires = null;

  await user.save();

  res.status(200).json({
    message: "Account verified successfully",
  });
}

async function resendOtpController(req, res) {
  const { email } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // already verified
  if (user.isVerified) {
    return res.status(400).json({
      message: "User already verified",
    });
  }

  // 🔢 generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;
  user.otpExpires = Date.now() + 5 * 60 * 1000;

  await user.save();

  // 📧 send again
  await sendOTP(user.email, otp);

  res.status(200).json({
    message: "OTP resent successfully",
  });
}

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
  verifyOtpController,
  resendOtpController,
};
