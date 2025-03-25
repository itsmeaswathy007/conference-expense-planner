const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Access Denied: No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer"
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};

module.exports = { verifyToken, isAdmin };

