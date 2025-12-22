// wishlistapi.js
import api from './axiosConfig';

/* -------------------- Get Wishlist -------------------- */
export const getWishlist = async (userId) => {
  const response = await api.get(`/wishlist/${userId}`);
  return response.data;
};

/* -------------------- Update or Create Wishlist -------------------- */
export const updateWishlist = async (userId, products) => {
  const response = await api.put(`/wishlist/${userId}`, { products });
  return response.data;
};

/* -------------------- Clear Wishlist -------------------- */
export const clearWishlist = async (userId) => {
  const response = await api.put(`/wishlist/clear/${userId}`);
  return response.data;
};

/* -------------------- Add Product to Wishlist -------------------- */
export const addToWishlist = async (userId, productId) => {
  const response = await api.post(`/wishlist/add/${userId}`, { productId });
  return response.data;
};

/* -------------------- Remove Product from Wishlist -------------------- */
export const removeFromWishlist = async (userId, productId) => {
  const response = await api.delete(`/wishlist/remove/${userId}/${productId}`);
  return response.data;
};
