const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');
const mongoose = require('mongoose');

// Get messages for sender, receiver (vendor), or admin
exports.getMessages = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const userRole = req.user.role;

    let messages;

    if (userRole === 'admin') {
        // Admin sees all messages
        messages = await Message.find()
            .populate('sender', 'name email role')
            .populate('receiver', 'name email role')
            .sort({ createdAt: 1 });
    } else {
        // Sender or receiver can see their messages
        messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
        .populate('sender', 'name email role')
        .populate('receiver', 'name email role')
        .sort({ createdAt: 1 });
    }

    res.json({ count: messages.length, messages });
});

// Create a new message (sender = logged-in user)
exports.createMessage = asyncHandler(async (req, res) => {
    const sender = req.user._id;
    const { receiver, message } = req.body;

    if (!receiver || !message) {
        return res.status(400).json({ message: 'Receiver and message are required' });
    }

    // validate receiver is a vendor
    const receiverUser = await User.findById(receiver);
    if (!receiverUser || receiverUser.role !== 'vendor') {
        return res.status(400).json({ message: 'Receiver must be a vendor' });
    }

    const newMessage = await Message.create({ sender, receiver, message });
    res.status(201).json(newMessage);
});
