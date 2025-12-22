const express = require('express');
const router = express.Router();
const {
    registerVendor,
    loginVendor,
    getVendorProfile,
    updateVendorProfile,
    deleteVendorProfile,
    getAllVendors
} = require('../controllers/vendorController');

const { protect, isVendor, isAdmin } = require('../middleware/authMiddleware');

// -------------------- Public Routes --------------------
router.post('/register', registerVendor);
router.post('/login', loginVendor);

// -------------------- Private Vendor Routes --------------------
router.get('/profile', protect, isVendor, getVendorProfile);
router.put('/profile', protect, isVendor, updateVendorProfile);
router.delete('/profile', protect, isVendor, deleteVendorProfile);

// -------------------- Admin-only Routes --------------------
router.get('/', protect, isAdmin, getAllVendors);

module.exports = router;
