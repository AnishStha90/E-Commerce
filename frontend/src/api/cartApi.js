import axios from "axios";

const API_URL = "http://localhost:5000/api/carts";

// Helper to get auth token
const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  if (!token) throw new Error("User not authenticated");
  return token;
};

// Get cart for logged-in user
export const getCart = async () => {
  const token = getAuthToken();
  try {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // return cart object
  } catch (err) {
    console.error("Failed to fetch cart:", err.response?.data || err.message);
    throw err;
  }
};

// Add or update product in cart
export const addToCart = async (productId, quantity = 1) => {
  const token = getAuthToken();
  try {
    const res = await axios.post(
      `${API_URL}/add`,
      { product: productId, quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data; // return updated cart
  } catch (err) {
    console.error("Failed to add product to cart:", err.response?.data || err.message);
    throw err;
  }
};

// Remove product from cart
export const removeFromCart = async (productId) => {
  const token = getAuthToken();
  try {
    const res = await axios.delete(`${API_URL}/remove/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // return updated cart
  } catch (err) {
    console.error("Failed to remove product from cart:", err.response?.data || err.message);
    throw err;
  }
};

// Clear cart
export const clearCart = async () => {
  const token = getAuthToken();
  try {
    const res = await axios.delete(`${API_URL}/clear`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // return cleared cart message
  } catch (err) {
    console.error("Failed to clear cart:", err.response?.data || err.message);
    throw err;
  }
};
