const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/Wishlist');

// GET wishlist for logged-in user
exports.getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const wishlist = await Wishlist.findOne({ user: userId }).populate('products');
  if (!wishlist) return res.status(200).json({ products: [] }); // return empty if none

  res.json(wishlist);
});

// ADD product to wishlist
exports.addToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  if (!productId) return res.status(400).json({ message: 'Product ID is required' });

  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = new Wishlist({ user: userId, products: [productId] });
  } else {
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
    }
    // If product already exists, don't return error; just send current wishlist
  }

  await wishlist.save();
  await wishlist.populate('products');

  res.json({
    message: wishlist.products.includes(productId) 
        ? 'Product added to wishlist' 
        : 'Product already in wishlist',
    wishlist
  });
});



// REMOVE product from wishlist
exports.removeFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist || !wishlist.products.includes(productId))
    return res.status(404).json({ message: 'Product not found in wishlist' });

  wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
  await wishlist.save();
  await wishlist.populate('products');

  res.json(wishlist);
});
