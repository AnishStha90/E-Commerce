const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Invoice = require('../models/Invoice');

// Get all invoices of a user
exports.getInvoices = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    const invoices = await Invoice.find({ user: userId })
        .populate({
            path: 'orders',
            populate: { path: 'products.product', select: 'name price' }
        })
        .sort({ createdAt: -1 });

    res.json({ count: invoices.length, invoices });
});

// Get single invoice by ID
exports.getInvoiceById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid invoice ID' });
    }

    const invoice = await Invoice.findById(id)
        .populate({
            path: 'orders',
            populate: { path: 'products.product', select: 'name price' }
        });

    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
});

// Create new invoice
exports.createInvoice = asyncHandler(async (req, res) => {
    const { user, orders, totalAmount, billingAddress, pdfUrl } = req.body;

    if (!user || !orders || !Array.isArray(orders) || orders.length === 0 || totalAmount === undefined || !billingAddress) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const invoice = await Invoice.create({
        user,
        orders,
        totalAmount,
        billingAddress,
        pdfUrl
    });

    res.status(201).json(invoice);
});

// Update invoice (e.g., pdfUrl)
exports.updateInvoice = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid invoice ID' });
    }

    const invoice = await Invoice.findByIdAndUpdate(id, updateData, { new: true });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    res.json(invoice);
});

// Delete invoice
exports.deleteInvoice = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid invoice ID' });
    }

    const invoice = await Invoice.findByIdAndDelete(id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    res.json({ message: 'Invoice deleted successfully' });
});
