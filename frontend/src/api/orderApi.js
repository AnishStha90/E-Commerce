import api from './axiosConfig';

// ---------------- Checkout with OTP ----------------
export const checkout = async (userId, address) => {
  const { data } = await api.post(`/orders/checkout/${userId}`, { address });
  return data;
};

// ---------------- Verify OTP ----------------
export const verifyOtp = async (orderId, otp) => {
  const { data } = await api.post(`/orders/verify-otp/${orderId}`, { otp });
  return data;
};

// ---------------- Get orders by user ----------------
export const getOrdersByUser = async (userId) => {
  const { data } = await api.get(`/orders/user/${userId}`);
  return data;
};

// ---------------- Get single order ----------------
export const getOrderById = async (orderId) => {
  const { data } = await api.get(`/orders/${orderId}`);
  return data;
};

// ---------------- Update order status ----------------
export const updateOrderStatus = async (orderId, status) => {
  const { data } = await api.put(`/orders/status/${orderId}`, { status });
  return data;
};

// ---------------- Delete order ----------------
export const deleteOrder = async (orderId) => {
  const { data } = await api.delete(`/orders/${orderId}`);
  return data;
};
