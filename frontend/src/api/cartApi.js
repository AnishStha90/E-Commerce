import api from "./axiosConfig"; // your configured axios instance

// Get Cart
export const getCart = async () => {
  const response = await api.get("/carts");
  return response.data;
};

// Add or Update Product in Cart
export const addToCart = async (productId, quantity) => {
  const response = await api.post("/carts", { product: productId, quantity });
  return response.data;
};

// Update Entire Cart
export const updateCart = async (products) => {
  const response = await api.put("/carts", { products });
  return response.data;
};

// Remove Product from Cart
export const removeFromCart = async (productId) => {
  const response = await api.delete(`/carts/${productId}`);
  return response.data;
};

// Clear Cart
export const clearCart = async () => {
  const response = await api.delete("/carts/clear");
  return response.data;
};
