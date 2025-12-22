import api from './axiosConfig';

// Create a report (any logged-in user)
export const createReport = async (type, data) => {
  const { data: response } = await api.post('/reports', { type, data });
  return response;
};

// Get all reports (admin only)
export const getReports = async (type) => {
  const query = type ? `?type=${type}` : '';
  const { data } = await api.get(`/reports/${query}`);
  return data;
};

// Get single report (admin or owner)
export const getReportById = async (id) => {
  const { data } = await api.get(`/reports/${id}`);
  return data;
};

// Reply to a report (admin only)
export const replyReport = async (id, reply) => {
  const { data } = await api.post(`/reports/reply/${id}`, { reply });
  return data;
};
