const express = require('express');
const router = express.Router();
const {
    createReview,
    getReviewsByProduct,
    deleteReview,
    updateReview
} = require('../controllers/reviewController');

const { protect, isUser, isAdmin } = require('../middleware/authMiddleware');

// ---------------- Public route ----------------
// Get all reviews for a product
router.get('/:productId', getReviewsByProduct);

// ---------------- Protected route ----------------
// Logged-in users can create a review
router.post('/', protect, isUser, createReview);

// ---------------- Admin-only routes ----------------
// Only admins can update or delete reviews
router.put('/:id', protect, isAdmin, updateReview);
router.delete('/:id', protect, isAdmin, deleteReview);

module.exports = router;
