const express = require('express');
const router = express.Router();
const { protect, isUser, isVendor, isAdmin } = require('../middleware/authMiddleware');
const { createShipping, getShippingMethods, getShippingByOrder } = require('../controllers/shippingController');

// -------------------- Create Shipping --------------------
// Any logged-in user can create a shipping entry
router.post('/', protect, isUser, createShipping); // or restrict to vendor/admin if desired

// -------------------- Get all Shipping Entries --------------------
// Admin: see all
// Vendor: see only their products
router.get('/', protect, getShippingMethods); // controller handles role logic

// -------------------- Get Shipping by Order ID --------------------
// Admin: any order
// Vendor: only orders containing their products
// User: only their own orders
router.get('/:orderId', protect, getShippingByOrder); // controller handles access checks

module.exports = router;
