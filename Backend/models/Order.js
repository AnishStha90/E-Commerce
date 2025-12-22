const mongoose = require('mongoose');
const addressSchema = require('./Address');

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        { 
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, 
            quantity: { type: Number, default: 1, min: 1 } 
        }
    ],
    total: { type: Number, required: true, min: 0 },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], 
        default: 'pending' 
    },
    address: { type: addressSchema, required: true },

    // OTP for payment confirmation
    otp: {
        code: { type: String },      // Store the OTP code itself
        expiresAt: { type: Date },   // Optional: expiration time for OTP
        verified: { type: Boolean, default: false } // Has the user confirmed the OTP?
    }

}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
