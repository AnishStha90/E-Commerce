const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
    storeName: { type: String, required: true, trim: true },
    description: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'vendor', 'user'], default: 'vendor' },
}, { timestamps: true });

module.exports = mongoose.model('Vendor', VendorSchema);
