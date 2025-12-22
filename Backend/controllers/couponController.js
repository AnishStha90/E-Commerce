const Coupon = require('../models/Coupon');
const asyncHandler = require('express-async-handler');

// Create a new coupon
exports.createCoupon = asyncHandler(async (req, res) => {
    let { code, discount, expiryDate, isActive } = req.body;

    if (!code || discount === undefined) {
        return res.status(400).json({ message: 'Code and discount are required' });
    }

    code = code.trim().toUpperCase();

    // Check for duplicate code
    const exists = await Coupon.findOne({ code });
    if (exists) return res.status(400).json({ message: 'Coupon code already exists' });

    const coupon = await Coupon.create({ code, discount, expiryDate, isActive });
    res.status(201).json(coupon);
});

// Get all coupons
exports.getCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
});

// Get a coupon by ID
exports.getCouponById = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json(coupon);
});

// Update a coupon
exports.updateCoupon = asyncHandler(async (req, res) => {
    const { code, discount, expiryDate, isActive } = req.body;
    const updateData = {};

    if (code) {
        const trimmedCode = code.trim().toUpperCase();
        const exists = await Coupon.findOne({ code: trimmedCode, _id: { $ne: req.params.id } });
        if (exists) return res.status(400).json({ message: 'Coupon code already exists' });
        updateData.code = trimmedCode;
    }

    if (discount !== undefined) updateData.discount = discount;
    if (expiryDate !== undefined) updateData.expiryDate = expiryDate;
    if (isActive !== undefined) updateData.isActive = isActive;

    const coupon = await Coupon.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });

    res.json(coupon);
});

// Delete a coupon
exports.deleteCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json({ message: 'Coupon deleted successfully' });
});
