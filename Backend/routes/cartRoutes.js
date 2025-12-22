const express = require('express');
const router = express.Router();
const {
    getCart,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart
} = require('../controllers/cartController');

const { protect, isUser } = require('../middleware/authMiddleware');

// All cart routes are for logged-in users only
router.get('/', protect, isUser, getCart);
router.post('/', protect, isUser, addToCart);
router.put('/', protect, isUser, updateCart);
router.delete('/:productId', protect, isUser, removeFromCart);
router.delete('/', protect, isUser, clearCart);

module.exports = router;
