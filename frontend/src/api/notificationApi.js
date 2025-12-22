import api from './axiosConfig';

// Get all notifications for users (public)
export const getNotifications = async () => {
  const { data } = await api.get('/notifications');
  return data;
};

// Create a notification (vendor-only)
export const createNotification = async (message) => {
  const { data } = await api.post('/notifications', { message });
  return data;
};
