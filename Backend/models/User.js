const mongoose = require('mongoose');
const addressSchema = require('./Address'); // adjust path if needed

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'vendor', 'user'], default: 'user' },
    address: { type: addressSchema, required: true }, // Embedded address schema
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
