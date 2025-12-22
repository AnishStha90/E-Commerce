import api from './axiosConfig';

// Create a review (protected)
export const createReview = async (productId, rating, comment) => {
  const { data } = await api.post('/reviews', { product: productId, rating, comment });
  return data;
};

// Get all reviews for a product (public)
export const getReviewsByProduct = async (productId) => {
  const { data } = await api.get(`/reviews/${productId}`);
  return data;
};

// Update a review (admin only)
export const updateReview = async (reviewId, rating, comment) => {
  const { data } = await api.put(`/reviews/${reviewId}`, { rating, comment });
  return data;
};

// Delete a review (admin only)
export const deleteReview = async (reviewId) => {
  const { data } = await api.delete(`/reviews/${reviewId}`);
  return data;
};
