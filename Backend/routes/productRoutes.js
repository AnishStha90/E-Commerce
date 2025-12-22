const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { protect } = require('../middleware/authMiddleware'); // added vendor for optional restriction
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes
// Only vendors/admins can create/update/delete products
router.post('/', protect, upload.array('images', 5), createProduct);
router.put('/:id', protect, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
