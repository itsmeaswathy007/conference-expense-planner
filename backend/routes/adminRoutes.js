const express = require("express");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Example admin route
router.get("/dashboard", verifyToken, isAdmin, (req, res) => {
    res.json({ message: "Welcome to Admin Dashboard" });
});

module.exports = router;
