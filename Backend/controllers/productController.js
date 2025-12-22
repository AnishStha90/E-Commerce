const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { sendNotificationToAllUsers } = require('../utils/notificationHelper');

// Create Product (Admin or Vendor)
exports.createProduct = asyncHandler(async (req, res) => {
    if (!['admin', 'vendor'].includes(req.user.role))
        return res.status(403).json({ message: 'Access denied' });

    const data = req.body;

    if (req.user.role === 'vendor') data.owner = req.user._id;

    // Handle uploaded images
    if (req.files && req.files.length) {
        data.images = req.files.map(f => `/uploads/${f.filename}`);
    }

    // Ensure stock is a number
    data.stock = Number(data.stock) || 0;

    const product = await Product.create(data);

    // Send notification to all users
    await sendNotificationToAllUsers(`New product added: ${product.name}`);

    res.status(201).json(product);
});

// Get all products (public)
exports.getProducts = asyncHandler(async (req, res) => {
    const filter = { isActive: true };

    if (req.query.category) filter.category = req.query.category;

    if (req.query.minPrice || req.query.maxPrice) {
        filter.price = {};
        if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
        if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    const products = await Product.find(filter).populate('category');
    res.json(products);
});

// Get product by ID
exports.getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: 'Invalid product ID' });

    const product = await Product.findById(id).populate('category');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json(product); // stock is part of product now
});

// Update product (Admin or Vendor owner)
exports.updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (req.user.role === 'vendor' && String(product.owner) !== String(req.user._id))
        return res.status(403).json({ message: 'Access denied' });

    const data = req.body;

    // Handle uploaded images
    if (req.files && req.files.length) {
        data.images = req.files.map(f => `/uploads/${f.filename}`);
    }

    // Ensure stock is a number if provided
    if (data.stock !== undefined) data.stock = Number(data.stock);

    Object.assign(product, data);
    await product.save();

    res.json(product);
});

// Delete product (Admin or Vendor owner)
exports.deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (req.user.role === 'vendor' && String(product.owner) !== String(req.user._id))
        return res.status(403).json({ message: 'Access denied' });

    await product.remove();
    res.json({ message: 'Product deleted successfully' });
});
