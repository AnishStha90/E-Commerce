const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Vendor = require('../models/Vendor');

// Generate JWT
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Validators
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);
const validatePassword = (password) => password.length >= 6;

/* -------------------- Register Vendor -------------------- */
exports.registerVendor = asyncHandler(async (req, res) => {
  const { storeName, description, password, email, phone } = req.body;

  if (!storeName || !password || !email || !phone) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!validateEmail(email)) return res.status(400).json({ message: 'Invalid email' });
  if (!validatePhone(phone)) return res.status(400).json({ message: 'Invalid phone number' });
  if (!validatePassword(password)) return res.status(400).json({ message: 'Password too short' });

  const existingEmail = await Vendor.findOne({ email });
  if (existingEmail) return res.status(400).json({ message: 'Email already in use' });

  const existingPhone = await Vendor.findOne({ phone });
  if (existingPhone) return res.status(400).json({ message: 'Phone number already in use' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const vendor = await Vendor.create({
    storeName,
    description,
    email,
    phone,
    password: hashedPassword
  });

  if (!vendor) return res.status(400).json({ message: 'Invalid vendor data' });

  res.status(201).json({
    _id: vendor._id,
    storeName: vendor.storeName,
    description: vendor.description,
    email: vendor.email,
    phone: vendor.phone,
    token: generateToken(vendor._id)
  });
});

/* -------------------- Login Vendor -------------------- */
exports.loginVendor = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const vendor = await Vendor.findOne({ email });
  if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({
    _id: vendor._id,
    storeName: vendor.storeName,
    description: vendor.description,
    email: vendor.email,
    phone: vendor.phone,
    token: generateToken(vendor._id)
  });
});

/* -------------------- Get Vendor Profile -------------------- */
exports.getVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.user._id);
  if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

  res.json({
    _id: vendor._id,
    storeName: vendor.storeName,
    description: vendor.description,
    email: vendor.email,
    phone: vendor.phone
  });
});

/* -------------------- Update Vendor Profile -------------------- */
exports.updateVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.user._id);
  if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

  vendor.storeName = req.body.storeName || vendor.storeName;
  vendor.description = req.body.description || vendor.description;
  vendor.email = req.body.email || vendor.email;
  vendor.phone = req.body.phone || vendor.phone;

  if (req.body.password) {
    if (!validatePassword(req.body.password)) return res.status(400).json({ message: 'Password too short' });
    vendor.password = await bcrypt.hash(req.body.password, 10);
  }

  const updatedVendor = await vendor.save();

  res.json({
    _id: updatedVendor._id,
    storeName: updatedVendor.storeName,
    description: updatedVendor.description,
    email: updatedVendor.email,
    phone: updatedVendor.phone
  });
});

/* -------------------- Delete Vendor Profile -------------------- */
exports.deleteVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.user._id);
  if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

  await vendor.remove();
  res.json({ message: 'Vendor profile deleted successfully' });
});

/* -------------------- Get All Vendors (Admin) -------------------- */
exports.getAllVendors = asyncHandler(async (req, res) => {
  const vendors = await Vendor.find();
  res.json(vendors);
});
