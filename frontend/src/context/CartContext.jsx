import { createContext, useContext, useState, useEffect } from "react";
import { getCart, addToCart, removeFromCart, clearCart } from "../api/cartApi";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setCartItems(data.products || []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addItem = async (productId, quantity = 1) => {
    try {
      setUpdating(true);
      // Optimistic update
      setCartItems(prev =>
        prev.map(item =>
          item.product._id === productId ? { ...item, quantity } : item
        )
      );
      await addToCart(productId, quantity);
    } catch (err) {
      console.error("Failed to add/update item:", err);
      await fetchCart();
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      setUpdating(true);
      setCartItems(prev => prev.filter(item => item.product._id !== productId));
      await removeFromCart(productId);
    } catch (err) {
      console.error("Failed to remove item:", err);
      await fetchCart();
    } finally {
      setUpdating(false);
    }
  };

  const clearAll = async () => {
    try {
      setUpdating(true);
      setCartItems([]);
      await clearCart();
    } catch (err) {
      console.error("Failed to clear cart:", err);
      await fetchCart();
    } finally {
      setUpdating(false);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, loading, updating, fetchCart, addItem, removeItem, clearAll }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
