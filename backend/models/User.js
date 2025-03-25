const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true,
        match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    otp: {
        type: String
    },
    otpExpiry: {
        type: Date
    },
    role: { 
        type: String, 
        enum: ["admin", "customer"], 
        default: "customer" }
});

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
