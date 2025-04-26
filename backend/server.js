const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path")
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes")
const roomRoutes = require("./routes/roomRoutes");
const addOnRoutes = require("./routes/addOnRoutes");
const mealRoutes = require("./routes/mealRoutes");


dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from public/images
//app.use("/images", express.static(path.join(__dirname, "public/images")));
// To serve uploaded images
app.use("/images", express.static("public/images"));


// Authentication Routes (Signup, Login, OTP Authentication)
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/rooms",roomRoutes);
app.use("/api/addons",addOnRoutes);
app.use("/api/meals",mealRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
