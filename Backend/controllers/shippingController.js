const asyncHandler = require('express-async-handler');
const Shipping = require('../models/Shipping');
const mongoose = require('mongoose');
const Order = require('../models/Order'); // needed to check vendor ownership

// Create a new shipping entry (any logged-in user)
exports.createShipping = asyncHandler(async (req, res) => {
    const { order, shippingAddress, status, trackingNumber } = req.body;

    if (!order || !shippingAddress) {
        return res.status(400).json({ message: 'Order and shipping address are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(order)) {
        return res.status(400).json({ message: 'Invalid order ID' });
    }

    const shipping = await Shipping.create({ order, shippingAddress, status, trackingNumber });
    res.status(201).json(shipping);
});

// Get all shipping entries (admin or vendor only)
exports.getShippingMethods = asyncHandler(async (req, res) => {
    let filter = {};

    if (req.user.role === 'vendor') {
        // Show only shipping entries for vendor's products
        const vendorOrders = await Order.find({ 'products.vendor': req.user._id }).select('_id');
        const orderIds = vendorOrders.map(o => o._id);
        filter = { order: { $in: orderIds } };
    } else if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    const shipping = await Shipping.find(filter).populate('order', 'total status');
    res.json(shipping);
});

// Get shipping by order ID (admin, vendor, or owner)
exports.getShippingByOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ message: 'Invalid order ID' });
    }

    const shipping = await Shipping.findOne({ order: orderId }).populate('order');
    if (!shipping) return res.status(404).json({ message: 'Shipping not found for this order' });

    // Check access
    if (
        req.user.role !== 'admin' &&
        req.user.role !== 'vendor' &&
        String(shipping.order.user) !== String(req.user._id)
    ) {
        return res.status(403).json({ message: 'Access denied' });
    }

    // Vendor can only see shipping if they own the products in the order
    if (req.user.role === 'vendor') {
        const ownsProduct = shipping.order.products.some(p => String(p.vendor) === String(req.user._id));
        if (!ownsProduct) return res.status(403).json({ message: 'Access denied' });
    }

    res.json(shipping);
});
