const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  deleteUser,
} = require('../controllers/userController');

const { protect, allowRoles } = require('../middleware/authMiddleware');

// -------------------- Public Routes --------------------
router.post('/register', registerUser);
router.post('/login', loginUser);

// -------------------- Private Routes (Users + Admins) --------------------
router.get('/profile', protect, allowRoles('user', 'admin'), getUserProfile);
router.put('/profile', protect, allowRoles('user', 'admin'), updateUserProfile);
router.delete('/profile', protect, allowRoles('user', 'admin'), deleteUser);

// -------------------- Admin-only Routes --------------------
router.get('/', protect, allowRoles('admin'), getAllUsers);
router.get('/:id', protect, allowRoles('admin'), getUserById);
router.delete('/:id', protect, allowRoles('admin'), deleteUser);

module.exports = router;
