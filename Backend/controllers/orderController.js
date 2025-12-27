const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');
const { sendOTP } = require('../utils/otpEmail');

// --------------------- Checkout with OTP ---------------------
exports.checkout = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { address, items, paymentMethod } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId))
        return res.status(400).json({ message: 'Invalid user ID' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Ensure all address fields exist
    const shippingAddress = {
        ward: address?.ward || user.address?.ward || "",
        street: address?.street || user.address?.street || "",
        municipality: address?.municipality || user.address?.municipality || "",
        district: address?.district || user.address?.district || "",
        province: address?.province || user.address?.province || "",
        country: address?.country || user.address?.country || "Nepal",
    };

    // Validate required fields
    const requiredFields = ["ward", "street", "municipality", "district", "province", "country"];
    const missingFields = requiredFields.filter(f => !shippingAddress[f] || shippingAddress[f].trim() === "");
    if (missingFields.length > 0) {
        return res.status(400).json({
            message: `Complete shipping address required. Missing: ${missingFields.join(", ")}`
        });
    }

    // Prepare order products
    let orderProducts = [];
    if (items?.length > 0) {
        for (const item of items) {
            const productId = typeof item.product === 'string' ? item.product : item.product?._id;
            if (!mongoose.Types.ObjectId.isValid(productId))
                return res.status(400).json({ message: `Invalid product ID: ${item.product}` });

            const product = await Product.findById(productId);
            if (!product) return res.status(404).json({ message: `Product not found: ${productId}` });

            orderProducts.push({
                product: product._id,
                vendor: product.vendor,
                quantity: Number(item.quantity) || 1
            });
        }
    } else {
        const cart = await Cart.findOne({ user: userId }).populate('products.product');
        if (!cart || cart.products.length === 0)
            return res.status(400).json({ message: 'Cart is empty' });

        orderProducts = cart.products.map(p => ({
            product: p.product._id,
            vendor: p.product.vendor,
            quantity: p.quantity || 1
        }));

        cart.products = [];
        await cart.save();
    }

    // Calculate total
    const total = await orderProducts.reduce(async (accP, item) => {
        const acc = await accP;
        const product = await Product.findById(item.product);
        return acc + product.price * item.quantity;
    }, Promise.resolve(0));

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create Order
    const order = await Order.create({
        user: user._id,
        products: orderProducts,
        total,
        status: 'pending',
        address: shippingAddress,
        paymentMethod: paymentMethod || 'cod',
        otp: { code: otpCode, expiresAt: otpExpires, verified: false }
    });

    // Create Invoice
    await Invoice.create({
        user: user._id,
        orders: [order._id],
        totalAmount: total,
        billingAddress: shippingAddress
    });

    // Send OTP
    await sendOTP(user.email, otpCode);

    res.status(201).json({ message: 'Checkout successful. OTP sent to email.', orderId: order._id });
});



// --------------------- Get all orders of a user ---------------------
exports.getOrdersByUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    const orders = await Order.find({ user: userId })
        .populate('products.product', 'name price')
        .populate('user', 'name email');

    res.json(orders);
});

// --------------------- Get single order ---------------------
exports.getOrderById = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(orderId)
        .populate('products.product', 'name price')
        .populate('user', 'name email');

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

// --------------------- Get all orders for a vendor ---------------------
exports.getOrdersByVendor = asyncHandler(async (req, res) => {
    const vendorId = req.user._id;

    const orders = await Order.find({ "products.vendor": vendorId }).populate('products.product');

    // Filter products in each order to only include those belonging to this vendor
    const filteredOrders = orders.map(order => {
        const vendorProducts = order.products.filter(p => p.vendor.toString() === vendorId.toString());
        return {
            ...order.toObject(),
            products: vendorProducts
        };
    });

    res.json(filteredOrders);
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


// --------------------- Resend OTP ---------------------
exports.resendOtp = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(orderId).populate('user', 'email');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Optional: Limit resend attempts
    if (order.otp.attempts >= 5 && order.otp.lastSentAt && 
        (Date.now() - new Date(order.otp.lastSentAt).getTime()) < 60 * 60 * 1000) {
        return res.status(429).json({ message: 'OTP resend limit reached. Try again later.' });
    }

    // Generate new OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    order.otp.code = otpCode;
    order.otp.expiresAt = otpExpires;
    order.otp.verified = false;
    order.otp.attempts = (order.otp.attempts || 0) + 1;
    order.otp.lastSentAt = new Date();

    await order.save();

    // Send OTP to user's email
    await sendOTP(order.user.email, otpCode);

    res.json({ message: 'OTP resent successfully', orderId: order._id });
});


// --------------------- Verify OTP and confirm order ---------------------
exports.verifyOtp = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { otp } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(orderId).populate('user', 'email').populate('products.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Check if OTP exists and is valid
    if (!order.otp.code || new Date() > new Date(order.otp.expiresAt)) {
        return res.status(400).json({ message: 'OTP expired. Please resend.' });
    }

    if (order.otp.code !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP is correct → confirm order
    order.status = 'confirmed';
    order.otp = null; // remove OTP

    // Optional: deduct product stock
    for (const item of order.products) {
        if (item.product.stock >= item.quantity) {
            item.product.stock -= item.quantity;
            await item.product.save();
        } else {
            return res.status(400).json({ message: `Not enough stock for ${item.product.name}` });
        }
    }

    await order.save();

    res.json({ message: 'Order confirmed successfully ✅', orderId: order._id });
});

