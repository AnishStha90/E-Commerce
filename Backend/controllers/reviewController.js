const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const mongoose = require('mongoose');

// Create a new review (protected)
exports.createReview = asyncHandler(async (req, res) => {
    const { product, rating, comment } = req.body;
    const user = req.user._id;

    if (!product || !rating) {
        return res.status(400).json({ message: 'Product and rating are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(user) || !mongoose.Types.ObjectId.isValid(product)) {
        return res.status(400).json({ message: 'Invalid user or product ID' });
    }

    // Prevent duplicate reviews by same user
    const exists = await Review.findOne({ user, product });
    if (exists) return res.status(400).json({ message: 'You have already reviewed this product' });

    const review = await Review.create({ user, product, rating, comment });
    res.status(201).json(review);
});

// Get all reviews for a product (public)
exports.getReviewsByProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }

    const reviews = await Review.find({ product: productId }).populate('user', 'name email');
    res.json(reviews);
});

// Update a review (admin only)
exports.updateReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid review ID' });
    }

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    const updatedReview = await review.save();
    res.json(updatedReview);
});

// Delete a review (admin only)
exports.deleteReview = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid review ID' });
    }

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    await review.remove();
    res.json({ message: 'Review deleted successfully' });
});
