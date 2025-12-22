const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Notification = require('../models/Notification');

// Get all notifications for users (no login required)
exports.getNotifications = asyncHandler(async (req, res) => {
    // Only send notifications to users (role 'user')
    const notifications = await Notification.find({ userRole: 'user' }).sort({ createdAt: -1 });
    res.json({ count: notifications.length, notifications });
});

// Vendor-only: create a notification for users
exports.createNotification = asyncHandler(async (req, res) => {
    const { message } = req.body;

    // Only vendors can create notifications
    if (req.user.role !== 'vendor') {
        return res.status(403).json({ message: 'Access denied: vendors only' });
    }

    if (!message) {
        return res.status(400).json({ message: 'Message is required' });
    }

    // Automatically send notification to all users
    const notifications = await Notification.insertMany(
        [{ message, userRole: 'user' }] // Public notifications for users
    );

    res.status(201).json({ message: 'Notification sent to users', notifications });
});
