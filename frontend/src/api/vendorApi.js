import api from './axiosConfig';

/* -------------------- Get auth token -------------------- */
const getToken = () => localStorage.getItem('token');

/* -------------------- Register Vendor -------------------- */
export const registerVendor = async (vendorData) => {
  const response = await api.post('/vendors/register', vendorData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

/* -------------------- Login Vendor -------------------- */
export const loginVendor = async (credentials) => {
  const response = await api.post('/vendors/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

/* -------------------- Logout Vendor -------------------- */
export const logoutVendor = () => {
  localStorage.removeItem('token');
};

/* -------------------- Get Vendor Profile -------------------- */
export const getVendorProfile = async () => {
  const token = getToken();
  if (!token) throw new Error('No token found');

  const response = await api.get('/vendors/profile', {
    headers: { Authorization: `Bearer ${token}` } // send token
  });
  return response.data;
};

/* -------------------- Update Vendor Profile -------------------- */
export const updateVendorProfile = async (profileData) => {
  const token = getToken();
  if (!token) throw new Error('No token found');

  const response = await api.put('/vendors/profile', profileData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

/* -------------------- Delete Vendor Profile -------------------- */
export const deleteVendorProfile = async () => {
  const token = getToken();
  if (!token) throw new Error('No token found');

  const response = await api.delete('/vendors/profile', {
    headers: { Authorization: `Bearer ${token}` }
  });
  logoutVendor(); // remove token after deletion
  return response.data;
};

/* -------------------- Admin: Get All Vendors -------------------- */
export const getAllVendors = async () => {
  const token = getToken();
  if (!token) throw new Error('No token found');

  const response = await api.get('/vendors', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
