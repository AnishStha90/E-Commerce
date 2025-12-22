const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/* ---------------------- Helper Validation Functions ---------------------- */
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);
const validatePassword = (password) => password.length >= 6;

/* --------------------------- Register User --------------------------- */
exports.registerUser = asyncHandler(async (req, res) => {
    const { name, email, phone, password, role, address } = req.body;

    // ✅ Basic validation
    if (!name || !email || !phone || !password || !address) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // ✅ Validate nested address fields
    const { ward, street, municipality, district, province, country } = address || {};
    if (!ward || !street || !municipality || !district || !province || !country) {
        return res.status(400).json({ message: 'All address fields are required' });
    }

    // ✅ Format validations
    if (!validateEmail(email)) return res.status(400).json({ message: 'Invalid email format' });
    if (!validatePhone(phone)) return res.status(400).json({ message: 'Phone number must be 10 digits' });
    if (!validatePassword(password)) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    if (!['admin', 'vendor', 'user'].includes(role)) return res.status(400).json({ message: 'Invalid role selected' });

    // ✅ Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists with this email' });

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const user = await User.create({
        name,
        email,
        phone,
        role,
        address: { ward, street, municipality, district, province, country },
        password: hashedPassword
    });

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        message: 'Registration successful'
    });
});

/* ----------------------------- Login User ----------------------------- */
exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // ✅ Create JWT token
    const token = jwt.sign(
        { id: user._id, role: user.role, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    // ✅ Return token + user (frontend handles redirect)
    res.json({
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            address: user.address
        },
        message: 'Login successful'
    });
});

/* --------------------------- Get User Profile --------------------------- */
exports.getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
});

/* --------------------------- Update Profile --------------------------- */
exports.updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, phone, password, address } = req.body;

    // ✅ Update name
    if (name) user.name = name;

    // ✅ Update phone
    if (phone) {
        if (!validatePhone(phone)) {
            return res.status(400).json({ message: 'Phone number must be 10 digits' });
        }
        user.phone = phone;
    }

    // ✅ Update password
    if (password) {
        if (!validatePassword(password)) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        user.password = await bcrypt.hash(password, 10);
    }

    // ✅ Update address
    if (address) {
        const { ward, street, municipality, district, province, country } = address;
        if (!ward || !street || !municipality || !district || !province || !country) {
            return res.status(400).json({ message: 'All address fields are required' });
        }
        user.address = { ward, street, municipality, district, province, country };
    }

    await user.save();

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        message: 'Profile updated successfully'
    });
});

/* --------------------------- Get All Users (Admin) --------------------------- */
exports.getAllUsers = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin')
        return res.status(403).json({ message: 'Access denied: Admins only' });

    const users = await User.find().select('-password');
    res.json({ count: users.length, users });
});

/* --------------------------- Get User by ID (Admin) --------------------------- */
exports.getUserById = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin')
        return res.status(403).json({ message: 'Access denied: Admins only' });

    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
});

/* --------------------------- Delete User --------------------------- */
exports.deleteUser = asyncHandler(async (req, res) => {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) return res.status(404).json({ message: 'User not found' });

    // Admin can delete anyone
    if (req.user.role === 'admin') {
        await userToDelete.remove();
        return res.json({ message: 'User deleted successfully by admin' });
    }

    // Normal user can delete themselves
    if (req.user._id.toString() === userToDelete._id.toString()) {
        await userToDelete.remove();
        return res.json({ message: 'Your account has been deleted successfully' });
    }

    // Otherwise deny
    res.status(403).json({ message: 'Access denied' });
});
