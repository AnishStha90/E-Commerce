import api from './axiosConfig';

// Get all invoices for a user
export const getInvoices = async (userId) => {
  const { data } = await api.get(`/invoices`);
  return data;
};

// Get a single invoice by ID
export const getInvoiceById = async (id) => {
  const { data } = await api.get(`/invoices/${id}`);
  return data;
};

// Create a new invoice
export const createInvoice = async (invoiceData) => {
  const { data } = await api.post('/invoices', invoiceData);
  return data;
};

// Update an invoice
export const updateInvoice = async (id, updateData) => {
  const { data } = await api.put(`/invoices/${id}`, updateData);
  return data;
};

// Delete an invoice
export const deleteInvoice = async (id) => {
  const { data } = await api.delete(`/invoices/${id}`);
  return data;
};
