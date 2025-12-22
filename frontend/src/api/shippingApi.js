import api from './axiosConfig';

// Create a new shipping entry (any logged-in user)
export const createShipping = async ({ order, shippingAddress, status, trackingNumber }) => {
  const { data } = await api.post('/shipping', { order, shippingAddress, status, trackingNumber });
  return data;
};

// Get all shipping entries (admin or vendor only)
export const getShippingMethods = async () => {
  const { data } = await api.get('/shipping');
  return data;
};

// Get shipping by order ID (admin, vendor, or order owner)
export const getShippingByOrder = async (orderId) => {
  const { data } = await api.get(`/shipping/${orderId}`);
  return data;
};
