const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');
const Cart = require('../models/Cart');
const User = require('../models/User');
const { sendOTP } = require('../utils/otpEmail'); 

// --------------------- Checkout with OTP ---------------------
exports.checkout = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { address } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const shippingAddress = address || user.address;
    if (!shippingAddress || !shippingAddress.street) {
        return res.status(400).json({ message: 'Shipping address required' });
    }

    const cart = await Cart.findOne({ user: userId }).populate('products.product');
    if (!cart || cart.products.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
    }

    const total = cart.products.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create Order
    const order = await Order.create({
        user: user._id,
        products: cart.products.map(p => ({ product: p.product._id, quantity: p.quantity })),
        total,
        status: 'pending',
        address: shippingAddress,
        otp: {
            code: otpCode,
            expiresAt: otpExpires,
            verified: false
        }
    });

    // Create Invoice
    const invoice = await Invoice.create({
        user: user._id,
        orders: [order._id],
        totalAmount: total,
        billingAddress: shippingAddress
    });

    // Clear Cart
    cart.products = [];
    await cart.save();

    // Send OTP via Email
    await sendOTP(user.email, otpCode);

    res.status(201).json({ 
        message: 'Checkout successful. OTP sent to email.', 
        orderId: order._id 
    });
});

const getOrdersByUser = async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'user') {
      orders = await Order.find({ user: req.user._id });
    } else if (req.user.role === 'vendor') {
      orders = await Order.find({ vendor: req.user._id });
    } else {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------- Verify OTP ---------------------
exports.verifyOtp = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { otp } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.otp.verified) {
        return res.status(400).json({ message: 'OTP already verified' });
    }

    if (Date.now() > new Date(order.otp.expiresAt)) {
        return res.status(400).json({ message: 'OTP expired' });
    }

    if (order.otp.code !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    order.otp.verified = true;
    order.status = 'confirmed';
    await order.save();

    res.json({ message: 'OTP verified. Payment confirmed.', order });
});


// --------------------- Get all orders of a user ---------------------
exports.getOrdersByUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    const orders = await Order.find({ user: userId }).populate('products.product');
    res.json(orders);
});


// --------------------- Get single order ---------------------
exports.getOrderById = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(orderId).populate('products.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json(order);
});


// --------------------- Update order status ---------------------
exports.updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status || order.status;
    await order.save();

    res.json({ message: 'Order status updated', order });
});


// --------------------- Delete an order ---------------------
exports.deleteOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    await order.remove();
    res.json({ message: 'Order deleted successfully' });
});
