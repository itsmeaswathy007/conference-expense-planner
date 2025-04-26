const AddOn = require('../models/AddOn');

// Create Add-on
const createAddOn = async (req, res) => {
  try {
    const { itemName, totalQuantity, unitPrice } = req.body;
    const imageUrl = req.file ? req.file.filename : ""; 

    const addon = new AddOn({
      itemName,
      totalQuantity,
      unitPrice,
      imageUrl,
    });
    await addon.save();
    res.status(201).json({ message: "Add-on created", addon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create add-on" });
  }
};

// Get all Add-ons
const getAllAddOns = async (req, res) => {
  try {
    const addons = await AddOn.find();
    res.status(200).json(addons);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch add-ons" });
  }
};

// Get total AddOns count
const getAddOnCount = async (req, res) => {
  try {
    const count = await AddOn.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Error fetching AddOn count:", error);
    res.status(500).json({ message: "Failed to get AddOn count" });
  }
};

// Update Add-on
const updateAddOn = async (req, res) => {
  try {
    const { id } = req.params;
    const { itemName, totalQuantity, unitPrice } = req.body;

    let updateFields = {
      itemName,
      totalQuantity,
      unitPrice,
    };

    if (req.file) {
      updateFields.imageUrl = req.file.filename; // 📸 Replace image if new file uploaded
    }

    const addon = await AddOn.findByIdAndUpdate(id, updateFields, { new: true });
    if (!addon) {
      return res.status(404).json({ error: "Add-on not found" });
    }
    res.status(200).json({ message: "Add-on updated", addon });
  } catch (err) {
    res.status(500).json({ error: "Failed to update add-on" });
  }
};

// Delete Add-on
const deleteAddOn = async (req, res) => {
  try {
    const { id } = req.params;
    const addon = await AddOn.findByIdAndDelete(id);
    if (!addon) {
      return res.status(404).json({ error: "Add-on not found" });
    }
    res.status(200).json({ message: "Add-on deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete add-on" });
  }
};

// Book an Add-on (Booking means reduce quantity for that date)
const bookAddOn = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, quantity } = req.body;

    const addon = await AddOn.findById(id);
    if (!addon) {
      return res.status(404).json({ error: "Add-on not found" });
    }

    // Check if already booked on this date
    const existingBooking = addon.bookings.find(b => b.date === date);
    if (existingBooking) {
      existingBooking.quantity += quantity; // Add to existing booking
    } else {
      addon.bookings.push({ date, quantity });
    }

    await addon.save();
    res.status(200).json({ message: "Add-on booked successfully", addon });

  } catch (err) {
    res.status(500).json({ error: "Failed to book add-on" });
  }
};

module.exports = { createAddOn, getAllAddOns,getAddOnCount, updateAddOn, deleteAddOn, bookAddOn };
