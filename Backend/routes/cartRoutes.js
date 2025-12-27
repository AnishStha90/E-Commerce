const express = require('express');
const router = express.Router();
const { protect, allowRoles } = require('../middleware/authMiddleware');
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

// All routes are protected and allowed for 'user' & 'vendor'
router.get('/', protect, allowRoles('user', 'vendor'), getCart);
router.post('/add', protect, allowRoles('user', 'vendor'), addToCart);
router.delete('/remove/:productId', protect, allowRoles('user', 'vendor'), removeFromCart);
router.delete('/clear', protect, allowRoles('user', 'vendor'), clearCart);

module.exports = router;
