const express = require('express');
const router = express.Router();
const {
    getInvoices,
    getInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice
} = require('../controllers/invoiceController');

const { protect, isUser, isVendor } = require('../middleware/authMiddleware');

// ---------------- User routes ----------------
// Logged-in users can only see their own invoices
router.get('/', protect, isUser, getInvoices);
router.get('/:id', protect, isUser, getInvoiceById);

// ---------------- Vendor/Admin routes ----------------
// Only vendors can create/update/delete invoices
router.post('/', protect, isVendor, createInvoice);
router.put('/:id', protect, isVendor, updateInvoice);
router.delete('/:id', protect, isVendor, deleteInvoice);

module.exports = router;
