const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createRoom,
  getAllRooms,
  getRoomsByLocation,
  updateRoom,
  bookRoom,
  getAllLocations,
  getRoomCount,
  deleteRoom,
  getTotalBookings,
} = require("../controllers/roomController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); // Save in public/images folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});
const upload = multer({ storage });

// Add a new room
router.post("/add", upload.single("image"), createRoom);

// Get all rooms
router.get("/all", getAllRooms);

// Get total room count
router.get("/count", getRoomCount);

// Get unique locations
router.get("/locations", getAllLocations);

// Booking count 
router.get("/bookingcount", getTotalBookings);

// Book room
router.post("/book/:roomId", bookRoom);

// Update room
router.put("/update/:id", upload.single("image"), updateRoom);

// Delete room
router.delete("/:id", deleteRoom);

// Get Rooms by Location
router.get("/:location", getRoomsByLocation);



module.exports = router;
