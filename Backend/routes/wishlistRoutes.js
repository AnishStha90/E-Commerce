const express = require('express');
const router = express.Router();
const { protect, allowRoles } = require('../middleware/authMiddleware');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/wishlistController');

// All routes are protected and allowed for 'user' & 'vendor'
router.get('/', protect, allowRoles('user', 'vendor'), getWishlist);
router.post('/add', protect, allowRoles('user', 'vendor'), addToWishlist);
router.delete('/remove/:productId', protect, allowRoles('user', 'vendor'), removeFromWishlist);

module.exports = router;
