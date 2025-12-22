const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/Wishlist');

// Middleware to ensure the logged-in user matches the userId param
const checkOwnership = (req, res, next) => {
    if (req.user._id.toString() !== req.params.userId) {
        return res.status(403).json({ message: 'Access denied: Not your wishlist' });
    }
    next();
};

// Get wishlist of a user
exports.getWishlist = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const wishlist = await Wishlist.findOne({ user: userId }).populate('products');
    if (!wishlist) {
        return res.status(404).json({ message: 'Wishlist not found' });
    }

    res.json(wishlist);
});

// Update (or create) wishlist
exports.updateWishlist = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { products } = req.body;

    if (!Array.isArray(products)) {
        return res.status(400).json({ message: 'Products should be an array of product IDs' });
    }

    const wishlist = await Wishlist.findOneAndUpdate(
        { user: userId },
        { products },
        { upsert: true, new: true }
    ).populate('products');

    res.json(wishlist);
});

// Clear wishlist
exports.clearWishlist = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const wishlist = await Wishlist.findOneAndUpdate(
        { user: userId },
        { products: [] },
        { new: true }
    ).populate('products');

    res.json(wishlist);
});

// Add a product to wishlist
exports.addToWishlist = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { productId } = req.body;

    if (!productId) {
        return res.status(400).json({ message: 'Product ID is required' });
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
        wishlist = new Wishlist({ user: userId, products: [productId] });
    } else {
        if (wishlist.products.includes(productId)) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }
        wishlist.products.push(productId);
    }

    await wishlist.save();
    await wishlist.populate('products');
    res.json(wishlist);
});

// Remove a product from wishlist
exports.removeFromWishlist = asyncHandler(async (req, res) => {
    const { userId, productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist || !wishlist.products.includes(productId)) {
        return res.status(404).json({ message: 'Product not found in wishlist' });
    }

    wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
    await wishlist.save();
    await wishlist.populate('products');
    res.json(wishlist);
});

module.exports.checkOwnership = checkOwnership;
