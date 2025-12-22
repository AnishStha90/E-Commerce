import api from './axiosConfig';

/* -------------------- Register -------------------- */
export const registerUser = async (userData) => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

/* -------------------- Login -------------------- */
export const loginUser = async (credentials) => {
  const response = await api.post('/users/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

/* -------------------- Logout -------------------- */
export const logoutUser = () => {
  localStorage.removeItem('token');
};

/* -------------------- Get User Profile -------------------- */
export const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

/* -------------------- Update User Profile -------------------- */
export const updateUserProfile = async (profileData) => {
  const response = await api.put('/users/profile', profileData);
  return response.data;
};

/* -------------------- Delete User Profile (Self) -------------------- */
export const deleteUserProfile = async () => {
  const response = await api.delete('/users/profile');
  logoutUser(); // remove token after deletion
  return response.data;
};

/* -------------------- Admin: Get All Users -------------------- */
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

/* -------------------- Admin: Get User by ID -------------------- */
export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

/* -------------------- Admin: Delete User by ID -------------------- */
export const deleteUserById = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

/* -------------------- Admin: Update User by ID -------------------- */
export const updateUserById = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};
