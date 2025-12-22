// src/context/WishlistContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { getWishlist, addToWishlist, removeFromWishlist } from "../api/wishlistApi";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id; // ✅ use `id` as stored in localStorage

  // Fetch wishlist from server
  const fetchWishlist = async () => {
    if (!userId) return setLoading(false);
    setLoading(true);
    try {
      const data = await getWishlist(userId);
      console.log("Fetched wishlist:", data);
      setWishlist(data.products?.map((p) => p._id) || []); // ✅ use _id
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add to wishlist
  const addItem = async (productId) => {
    if (!userId) return;
    try {
      await addToWishlist(userId, productId);
      setWishlist((prev) => [...prev, productId]); // ✅ immediate state update
    } catch (err) {
      console.error("Add to wishlist failed:", err);
    }
  };

  // Remove from wishlist
  const removeItem = async (productId) => {
    if (!userId) return;
    try {
      await removeFromWishlist(userId, productId);
      setWishlist((prev) => prev.filter((id) => id !== productId)); // ✅ immediate state update
    } catch (err) {
      console.error("Remove from wishlist failed:", err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [userId]);

  return (
    <WishlistContext.Provider
      value={{ wishlist, addItem, removeItem, fetchWishlist, loading }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
