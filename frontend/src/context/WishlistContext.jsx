import { createContext, useContext, useState, useEffect } from "react";
import { getWishlist, addToWishlist, removeFromWishlist } from "../api/wishlistApi";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist on mount
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const data = await getWishlist();
        setWishlist(data.products.map(p => p._id)); // Store only product IDs
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  // Add product
  const addItem = async (productId) => {
    try {
      // Optimistically update state immediately
      setWishlist(prev => [...prev, productId]);

      // Call backend
      await addToWishlist(productId);
    } catch (err) {
      console.error("Failed to add to wishlist:", err);
      alert("Failed to add to wishlist");
      // Rollback if backend fails
      setWishlist(prev => prev.filter(id => id !== productId));
    }
  };

  // Remove product
  const removeItem = async (productId) => {
    try {
      // Optimistically remove from state
      setWishlist(prev => prev.filter(id => id !== productId));

      // Call backend
      await removeFromWishlist(productId);
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
      alert("Failed to remove from wishlist");
      // Rollback if backend fails
      setWishlist(prev => [...prev, productId]);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, addItem, removeItem }}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook
export const useWishlist = () => useContext(WishlistContext);
