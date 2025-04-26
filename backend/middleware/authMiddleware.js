const jwt = require("jsonwebtoken");
const VenueRoom = require("../models/VenueRoom");
const AddOn = require("../models/AddOn");

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

const getAdminReports = async (req, res) => {
    try {
      const rooms = await VenueRoom.find();
      const addons = await AddOn.find();
  
      const mostBookedRooms = rooms.map(r => ({
        name: r.name,
        totalBookings: r.bookings.length,
      })).sort((a, b) => b.totalBookings - a.totalBookings).slice(0, 5);
  
      const lowStockAddons = addons
        .map(a => {
          const totalBooked = a.bookings.reduce((sum, b) => sum + b.quantity, 0);
          return {
            itemName: a.itemName,
            remaining: a.totalQuantity - totalBooked
          };
        })
        .filter(a => a.remaining < 5);
  
      // Revenue is mock here, you can calculate real from bookings
      const totalRevenue = rooms.reduce((sum, r) =>
        sum + r.bookings.reduce((s, b) => s + (b.quantity * r.rate * 10), 0), 0);
  
      res.json({
        revenue: totalRevenue,
        mostBookedRooms,
        lowStockAddons
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to load reports" });
    }
  };
  

module.exports = { verifyToken, isAdmin,getAdminReports };

