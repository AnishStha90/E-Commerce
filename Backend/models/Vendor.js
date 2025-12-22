const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
    storeName: { type: String, required: true, trim: true },
    description: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true }  // Add password field
}, { timestamps: true });

module.exports = mongoose.model('Vendor', VendorSchema);
