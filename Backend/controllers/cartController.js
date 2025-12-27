const Cart = require("../models/Cart");

/* ================= GET CART ================= */
exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
    .populate("products.product");

  res.json(cart || { products: [] });
};

/* ================= ADD TO CART ================= */
exports.addToCart = async (req, res) => {
  const { product, quantity } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      products: [{ product, quantity }],
    });
  } else {
    const index = cart.products.findIndex(
      (p) => p.product.toString() === product
    );

    if (index > -1) {
      cart.products[index].quantity += quantity;
      if (cart.products[index].quantity <= 0) {
        cart.products.splice(index, 1);
      }
    } else {
      cart.products.push({ product, quantity });
    }
  }

  await cart.save();

  // 🔥 POPULATE BEFORE RESPONSE
  cart = await cart.populate("products.product");

  res.json(cart);
};

/* ================= REMOVE FROM CART ================= */
exports.removeFromCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) return res.json({ products: [] });

  cart.products = cart.products.filter(
    (p) => p.product.toString() !== req.params.productId
  );

  await cart.save();

  // 🔥 POPULATE BEFORE RESPONSE
  cart = await cart.populate("products.product");

  res.json(cart);
};

/* ================= CLEAR CART ================= */
exports.clearCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) return res.json({ products: [] });

  cart.products = [];
  await cart.save();

  // 🔥 POPULATE BEFORE RESPONSE
  cart = await cart.populate("products.product");

  res.json(cart);
};
