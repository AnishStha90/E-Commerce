const mongoose = require('mongoose');
const addressSchema = require('./Address');

const InvoiceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true }],
    totalAmount: { type: Number, required: true, min: 0 },
    billingAddress: { type: addressSchema, required: true },
    invoiceNumber: { type: String, required: true, unique: true },
    pdfUrl: { type: String }
}, { timestamps: true });

// Auto-generate invoice number if missing
InvoiceSchema.pre('validate', function(next) {
    if (!this.invoiceNumber) {
        this.invoiceNumber = 'INV-' + Date.now();
    }
    next();
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
