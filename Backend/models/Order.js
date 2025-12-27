const mongoose = require('mongoose');
const addressSchema = require('./Address');

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        { 
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, 
            vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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

    // Payment method
    paymentMethod: { type: String, enum: ['cod', 'card', 'online'], default: 'cod' },

    // OTP for payment confirmation
    otp: {
        code: { type: String },
        expiresAt: { type: Date },
        verified: { type: Boolean, default: false },
        attempts: { type: Number, default: 0 },      // track OTP send attempts
        lastSentAt: { type: Date }                  // last time OTP was sent
    }

}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
