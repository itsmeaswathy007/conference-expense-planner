const express = require("express");
const { signup, login, sendOTP, verifyOTP, getUserCount } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);  // User Signup
router.post("/login", login);    // User Login with Password
router.post("/send-otp", sendOTP); // Send OTP for Login
router.post("/verify-otp", verifyOTP); // Verify OTP & Login
router.get("/count",getUserCount); // User Count

module.exports = router;
