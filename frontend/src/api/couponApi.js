// src/api/couponApi.js
import api from "./axiosConfig";

// Get all coupons (only logged-in users can access)
export const getCoupons = async () => {
  const { data } = await api.get("/coupons");
  return data;
};

// Get a single coupon by ID
export const getCouponById = async (id) => {
  const { data } = await api.get(`/coupons/${id}`);
  return data;
};

// Create a coupon (vendor-only)
export const createCoupon = async (coupon) => {
  const { data } = await api.post("/coupons", coupon);
  return data;
};

// Update a coupon (vendor-only)
export const updateCoupon = async (id, updateData) => {
  const { data } = await api.put(`/coupons/${id}`, updateData);
  return data;
};

// Delete a coupon (vendor-only)
export const deleteCoupon = async (id) => {
  const { data } = await api.delete(`/coupons/${id}`);
  return data;
};
