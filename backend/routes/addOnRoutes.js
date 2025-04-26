const express = require('express');
const router = express.Router();
const multer = require("multer");
const { createAddOn, getAllAddOns, updateAddOn, deleteAddOn, bookAddOn, getAddOnCount } = require('../controllers/addOnController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); // Save in public/images folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});
const upload = multer({ storage });

//router.post('/', createAddOn); // Create Addon
router.post("/", upload.single("image"), createAddOn);
router.get('/', getAllAddOns); // Get All Addons
router.get('/count',getAddOnCount);
//router.put('/:id', updateAddOn); // Update Addon
router.put("/:id", upload.single("image"), updateAddOn);
router.delete('/:id', deleteAddOn); // Delete Addon
router.post('/book/:id', bookAddOn); // Book Addon

module.exports = router;
