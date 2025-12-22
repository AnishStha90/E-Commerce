const mongoose = require('mongoose');
const addressSchema = require('./Address');

const ShippingSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    shippingAddress: { type: addressSchema, required: true },
    status: { type: String, enum: ['pending','shipped','delivered'], default: 'pending' },
    trackingNumber: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Shipping', ShippingSchema);
