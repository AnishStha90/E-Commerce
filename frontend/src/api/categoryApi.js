import api from './axiosConfig';

// Get all categories (public)
export const getCategories = async () => {
  const { data } = await api.get('/categories');
  return data;
};

// Get category by ID
export const getCategoryById = async (id) => {
  const { data } = await api.get(`/categories/${id}`);
  return data;
};

// Create category (admin only)
export const createCategory = async (category) => {
  const { data } = await api.post('/categories', category);
  return data;
};

// Update category (admin only)
export const updateCategory = async (id, updateData) => {
  const { data } = await api.put(`/categories/${id}`, updateData);
  return data;
};

// Delete category (admin only)
export const deleteCategory = async (id) => {
  const { data } = await api.delete(`/categories/${id}`);
  return data;
};
