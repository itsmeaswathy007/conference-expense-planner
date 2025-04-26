const mongoose = require("mongoose");

const venueRoomSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
    trim:true
  },
  name: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String, 
    required: true,
  },
  bookings: [
    {
      date: { type: String, required: true }, 
      time: { type: String, required: true }, 
      quantity: { type: Number, required: true }, 
    },
  ],
});

module.exports = mongoose.model("VenueRoom", venueRoomSchema);
