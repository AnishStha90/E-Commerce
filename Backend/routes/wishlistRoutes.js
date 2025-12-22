// routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { protect, isUser } = require('../middleware/authMiddleware');

// -------------------- User Wishlist Routes --------------------
// All wishlist operations are for logged-in users only
router.get('/:userId', protect, isUser, wishlistController.getWishlist);
router.put('/:userId', protect, isUser, wishlistController.updateWishlist);
router.delete('/clear/:userId', protect, isUser, wishlistController.clearWishlist);
router.post('/add/:userId', protect, isUser, wishlistController.addToWishlist);
router.delete('/remove/:userId/:productId', protect, isUser, wishlistController.removeFromWishlist);

module.exports = router;
