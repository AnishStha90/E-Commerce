const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    images: [{ type: String }],
    stock: { type: Number, required: true, default: 0, min: 0 }, 
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Optional index for faster category and price filtering
ProductSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model('Product', ProductSchema);
