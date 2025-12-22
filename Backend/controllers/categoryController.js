const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Category = require('../models/Category');

// Create category (Admin only)
exports.createCategory = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    let { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    name = name.trim();

    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Category already exists' });

    const category = await Category.create({ name, description });
    res.status(201).json(category);
});

// Get categories (public)
exports.getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
});

// Get category by ID
exports.getCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID' });
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
});

// Update category (Admin only)
exports.updateCategory = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const { id } = req.params;
    const { name, description } = req.body;
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description;

    const category = await Category.findByIdAndUpdate(id, updateData, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
});

// Delete category (Admin only)
exports.deleteCategory = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
});
