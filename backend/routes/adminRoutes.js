const express = require("express");
const { verifyToken, isAdmin, getAdminReports } = require("../middleware/authMiddleware");

const router = express.Router();


router.get("/dashboard", verifyToken, isAdmin, (req, res) => {
    res.json({ message: "Welcome to Admin Dashboard" });
});

router.get("/reports",getAdminReports);
module.exports = router;
