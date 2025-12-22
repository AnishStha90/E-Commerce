import api from './axiosConfig';

// Get messages (logged-in user determines visible messages)
export const getMessages = async () => {
  const { data } = await api.get('/messages');
  // Ensure it returns an array
  return Array.isArray(data) ? data : data.messages || [];
};

// Create a new message
export const createMessage = async (receiver, message) => {
  const { data } = await api.post('/messages', { receiver, message });
  return data;
};
