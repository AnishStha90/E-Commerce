const express = require('express');
const router = express.Router();
const {
    checkout,
    verifyOtp,
    getOrdersByUser,
    getOrderById,
    updateOrderStatus,
    deleteOrder
} = require('../controllers/orderController');

const { protect, isAdmin, isVendor, isUser } = require('../middleware/authMiddleware');

// User checkout
router.post('/checkout/:userId', protect, isUser, checkout);

// Verify OTP
router.post('/verify-otp/:orderId', protect, isUser, verifyOtp);

// User orders
router.get('/user/:userId', protect, isUser, getOrdersByUser);
router.get('/:orderId', protect, isUser, getOrderById);


// Get orders for vendor
router.get('/vendor/:vendorId', protect, isVendor, getOrdersByUser);


// Update order status (Admin/Vendor)
router.put('/status/:orderId', protect, isAdmin, updateOrderStatus); // Admin only
// OR if vendors can update:
router.put('/status/:orderId', protect, isVendor, updateOrderStatus);

// Delete order (Admin or owner)
router.delete('/:orderId', protect, isUser, deleteOrder); // inside controller, check if user owns order or is admin

module.exports = router;
