const express = require('express');
const router = express.Router();
const {
    getNotifications,
    createNotification
} = require('../controllers/notificationController');

const { protect, isVendor } = require('../middleware/authMiddleware');

// ---------------- Public route ----------------
// Any user can fetch notifications
router.get('/', getNotifications);

// ---------------- Vendor-only route ----------------
// Only logged-in vendors can create/send notifications
router.post('/', protect, isVendor, createNotification);

module.exports = router;
