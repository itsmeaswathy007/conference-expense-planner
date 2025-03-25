const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Generate OTP (6-digit number)
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via Email
const sendOTPByEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}. It will expire in 10 minutes.`
    };

    await transporter.sendMail(mailOptions);
};

// **Signup Controller**
const signup = async (req, res) => {
    try {
        const { name, phoneNumber, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Determine role: First user is admin, others are customers
        const isFirstUser = (await User.countDocuments()) === 0;
        const role = isFirstUser ? "admin" : "customer";

        // Create new user
        const newUser = new User({ name, phoneNumber, email, password, role });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Signup failed", error: error.message });
    }
};

// **Login Controller (with Password)**
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Validate password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        //const token = generateToken(user._id);
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });


        res.status(200).json({ message: "Login successful", token, role:user.role });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
};

// **Send OTP for Login**
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Generate OTP & set expiry
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes
        await user.save();

        // Send OTP via email
        await sendOTPByEmail(email, otp);

        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to send OTP", error: error.message });
    }
};

// **Verify OTP & Login**
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Check OTP & Expiry
        if (user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Clear OTP fields
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        // Generate JWT Token
        const token = generateToken(user._id);

        res.status(200).json({ message: "OTP verified successfully", token });
    } catch (error) {
        res.status(500).json({ message: "OTP verification failed", error: error.message });
    }
};

module.exports = { signup, login, sendOTP, verifyOTP };
