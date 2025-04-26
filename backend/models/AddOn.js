const mongoose = require('mongoose');

const addOnSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  totalQuantity: {
    type: Number,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  bookings: [
    {
      date: { type: String, required: true }, // Booking date (eg: 2025-04-20)
      quantity: { type: Number, required: true }, // How many booked
    }
  ]
});

module.exports = mongoose.model('AddOn', addOnSchema);
