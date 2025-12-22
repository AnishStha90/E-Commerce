const express = require('express');
const router = express.Router();
const {
    createCoupon,
    getCoupons,
    getCouponById,
    updateCoupon,
    deleteCoupon
} = require('../controllers/couponController');

const { protect, isUser, isVendor,allowRoles } = require('../middleware/authMiddleware');

// User & Vendor routes (both can see coupons)
router.get('/', protect, allowRoles('user', 'vendor'), getCoupons);
router.get('/:id', protect, allowRoles('user', 'vendor'), getCouponById);

// Vendor-only routes
router.post('/', protect, isVendor, createCoupon);
router.put('/:id', protect, isVendor, updateCoupon);
router.delete('/:id', protect, isVendor, deleteCoupon);


module.exports = router;
