const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes")

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Authentication Routes (Signup, Login, OTP Authentication)
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
