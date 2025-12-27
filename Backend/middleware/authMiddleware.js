const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Vendor = require('../models/Vendor');


exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Try to find user in User collection
      let user = await User.findById(decoded.id).select('-password');

      if (user) {
        // Use role stored in DB ('user' or 'admin')
        req.user = user;
         req.user.role = user.role || 'user'; // fallback if role missing
      } else {
        // If not found, try Vendor collection
        user = await Vendor.findById(decoded.id).select('-password');
        if (!user) return res.status(401).json({ message: 'Not authorized, user/vendor not found' });

        // Vendor role
        req.user = user;
        req.user.role = 'vendor';
      }

      next();
    } catch (err) {
      console.error('Auth error:', err.message);
      res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
});

exports.isVendor = (req, res, next) => {
  console.log('isVendor check, req.user:', req.user);
  if (req.user?.role === 'vendor') {
    return next();
  }
  return res.status(403).json({ message: 'Vendors only' });
};


// Role check middlewares
exports.isAdmin = (req, res, next) => req.user?.role === 'admin' ? next() : res.status(403).json({ message: 'Admins only' });
//exports.isVendor = (req, res, next) => req.user?.role === 'vendor' ? next() : res.status(403).json({ message: 'Vendors only' });
exports.isUser = (req, res, next) => req.user?.role === 'user' ? next() : res.status(403).json({ message: 'Users only' });


// Allow multiple roles
exports.allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    next();
  };
};
