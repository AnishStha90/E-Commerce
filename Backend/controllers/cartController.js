const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const mongoose = require('mongoose');

// GET Cart
exports.getCart = asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    // Optional: validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    const cart = await Cart.findOne({ user: userId }).populate('products.product');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    res.json(cart);
});

// ADD or UPDATE a product in cart
exports.addToCart = asyncHandler(async (req, res) => {
    const { product, quantity } = req.body;
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(product)) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        // Create new cart if not exists
        cart = await Cart.create({
            user: userId,
            products: [{ product, quantity }]
        });
    } else {
        // Check if product exists in cart
        const index = cart.products.findIndex(p => p.product.toString() === product);
        if (index > -1) {
            cart.products[index].quantity += quantity; // Update quantity
        } else {
            cart.products.push({ product, quantity }); // Add new product
        }
        await cart.save();
    }

    const updatedCart = await Cart.findById(cart._id).populate('products.product');
    res.json(updatedCart);
});

// UPDATE entire cart (replace products array)
exports.updateCart = asyncHandler(async (req, res) => {
    const { products } = req.body;
    const userId = req.params.userId;

    if (!Array.isArray(products)) {
        return res.status(400).json({ message: 'Products must be an array' });
    }

    const cart = await Cart.findOneAndUpdate(
        { user: userId },
        { products },
        { upsert: true, new: true }
    ).populate('products.product');

    res.json(cart);
});

// REMOVE a product from cart
exports.removeFromCart = asyncHandler(async (req, res) => {
    const { productId, userId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    await cart.save();
    res.json(cart);
});

// CLEAR Cart
exports.clearCart = asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.products = [];
    await cart.save();
    res.json({ message: 'Cart cleared' });
});
