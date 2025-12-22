import api from './axiosConfig';

// Create product (Admin or Vendor)
export const createProduct = async (formData) => {
  const { data } = await api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// Get products (public)
export const getProducts = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const { data } = await api.get(`/products/${query}`);
  return data;
};

// Get product by ID
export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

// Update product (Admin or Vendor owner)
export const updateProduct = async (id, formData) => {
  const { data } = await api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// Delete product (Admin or Vendor owner)
export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};