import axios from "axios";

const API_URL = "http://localhost:5000/api/wishlist";

// Get wishlist for logged-in user
export const getWishlist = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  if (!token) throw new Error("User not authenticated");

  try {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Return wishlist object
    return res.data;
  } catch (err) {
    console.error("Failed to fetch wishlist:", err.response?.data || err.message);
    throw err;
  }
};

// Add product to wishlist
export const addToWishlist = async (productId) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  if (!token) throw new Error("User not authenticated");

  try {
    const res = await axios.post(
      `${API_URL}/add`,
      { productId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // Return updated wishlist
    return res.data;
  } catch (err) {
    console.error("Failed to add product to wishlist:", err.response?.data || err.message);
    throw err;
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (productId) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  if (!token) throw new Error("User not authenticated");

  try {
    const res = await axios.delete(`${API_URL}/remove/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Return updated wishlist
    return res.data;
  } catch (err) {
    console.error("Failed to remove product from wishlist:", err.response?.data || err.message);
    throw err;
  }
};
