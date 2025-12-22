const express = require('express');
const router = express.Router();
const { getMessages, createMessage } = require('../controllers/messageController');
const { protect, allowRoles } = require('../middleware/authMiddleware');

// ---------------- GET messages ----------------
// Admins, vendors, or users can fetch messages
router.get('/', protect, allowRoles('admin', 'vendor', 'user'), getMessages);

// ---------------- POST message ----------------
// Only users or vendors can send messages
router.post('/', protect, allowRoles('user', 'vendor'), createMessage);

module.exports = router;
