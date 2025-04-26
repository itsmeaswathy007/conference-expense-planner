const VenueRoom = require("../models/VenueRoom");

// Create a new room
const createRoom = async (req, res) => {
  try {
    const { location, name, capacity,rate } = req.body; 
    const imageUrl = req.file ? req.file.filename : ""; // Get image filename from multer
    const room = new VenueRoom({ location, name, capacity,rate, imageUrl });

    await room.save();

    res.status(201).json({ message: "Room added successfully", room });
  } catch (error) {
    res.status(500).json({ error: "Failed to add room" });
  }
};

// Get all rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await VenueRoom.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
};

//Get count of all rooms
const getRoomCount = async (req, res) => {
  try {
    const count = await VenueRoom.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error("Error fetching room count:", err);
    res.status(500).json({ message: "Failed to get Room count" });
  }
};

// Get rooms by location
const getRoomsByLocation = async (req, res) => {
  try {
    const location = req.params.location;
    const rooms = await VenueRoom.find({
      location: { $regex: new RegExp(`^${location}$`, "i") },
    });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
};

//  Update a room
const updateRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    const { location, name, capacity, rate } = req.body;

    const updateData = { location, name, capacity,rate };
    if (req.file) {
      updateData.imageUrl = req.file.filename; // Update image if new file uploaded
    }

const updatedRoom = await VenueRoom.findByIdAndUpdate(
  roomId,
  updateData,
  { new: true }
);


    if (!updatedRoom) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.status(200).json({ message: "Room updated successfully", updatedRoom });
  } catch (error) {
    res.status(500).json({ error: "Failed to update room" });
  }
};
// Add a new booking to a specific room
const bookRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { date, time, quantity } = req.body;

    const room = await VenueRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    room.bookings.push({ date, time, quantity });
    await room.save();

    res.status(200).json({ message: "Booking added", room });
  } catch (error) {
    res.status(500).json({ error: "Booking failed" });
  }
};

// Get unique locations
const getAllLocations = async (req , res) => {
  try {
    const locations = await VenueRoom.distinct("location",{location:{$ne:null}});
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch locations" });
  }
};

// Delete a Room by ID
const deleteRoom = async (req, res) => {
  try {
    const roomId = req.params.id;

    const deletedRoom = await VenueRoom.findByIdAndDelete(roomId);

    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "Room deleted successfully", VenueRoom: deletedRoom });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ message: "Failed to delete room" });
  }
};

// Booking Count
const getTotalBookings = async (req, res) => {
  try {
    const rooms = await VenueRoom.find({}, "bookings");
    let totalBookings = 0;

    rooms.forEach(room => {
      totalBookings += room.bookings.length;
    });

    res.json({ count: totalBookings });
  } catch (err) {
    console.error("Error counting bookings:", err);
    res.status(500).json({ message: "Failed to get total bookings" });
  }
};

module.exports = {
  createRoom,
  getAllRooms,
  getRoomCount,
  getRoomsByLocation,
  updateRoom,
  bookRoom,
  getAllLocations,
  deleteRoom,
  getTotalBookings
};



