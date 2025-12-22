import React, { useEffect, useState } from "react";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../../api/cartApi";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  // Fetch cart
  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!token || !user) {
      console.log("User is NOT logged in");
      alert("You must be logged in to view the cart.");
      navigate("/login");
      return;
    }

    console.log("User is logged in, fetching cart...");

    try {
      setLoading(true);
      const data = await getCart(user.id); // Pass userId here
      setCartItems(data.products || []);
      console.log("Cart fetched:", data);
    } catch (err) {
      console.error("Error fetching cart:", err);
      alert("Failed to fetch cart. Make sure you are logged in as a user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    console.log("Checking login status...");
    if (token) {
      console.log("User is logged in");
      console.log("User info:", user);
    } else {
      console.log("User is NOT logged in");
    }

    fetchCart();
  }, []);

  // Remove item
  const handleRemove = async (productId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      await removeFromCart(user.id, productId);
      setCartItems(cartItems.filter((item) => item.product._id !== productId));
      console.log(`Removed product ${productId} from cart`);
    } catch (err) {
      console.error("Failed to remove product:", err);
    }
  };

  // Update quantity
  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;
    setUpdating(true);
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      await addToCart(user.id, productId, quantity);
      console.log(`Updated quantity of product ${productId} to ${quantity}`);
      fetchCart();
    } catch (err) {
      console.error("Failed to update quantity:", err);
    } finally {
      setUpdating(false);
    }
  };

  // Clear cart
  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear the cart?")) return;
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      await clearCart(user.id);
      setCartItems([]);
      console.log("Cart cleared");
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  if (loading) return <p style={{ textAlign: "center" }}>Loading cart...</p>;

  if (cartItems.length === 0)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Your cart is empty.</h2>
        <button
          onClick={() => navigate("/products")}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#1d3557",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Browse Products
        </button>
      </div>
    );

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Your Cart</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ccc" }}>
            <th style={{ textAlign: "left", padding: "10px" }}>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.product._id} style={{ borderBottom: "1px solid #eee" }}>
              <td
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px",
                }}
              >
                <img
                  src={
                    item.product.images && item.product.images.length > 0
                      ? `${BASE_URL}${item.product.images[0].url}`
                      : "https://via.placeholder.com/50x50?text=No+Image"
                  }
                  alt={item.product.name}
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
                <span>{item.product.name}</span>
              </td>
              <td style={{ textAlign: "center" }}>${item.product.price}</td>
              <td style={{ textAlign: "center" }}>
                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  onChange={(e) =>
                    handleQuantityChange(item.product._id, parseInt(e.target.value))
                  }
                  style={{ width: "60px", textAlign: "center" }}
                  disabled={updating}
                />
              </td>
              <td style={{ textAlign: "center" }}>
                ${item.product.price * item.quantity}
              </td>
              <td style={{ textAlign: "center" }}>
                <button
                  onClick={() => handleRemove(item.product._id)}
                  style={{
                    backgroundColor: "#dc2626",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                  disabled={updating}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <h3>Total Amount: ${totalAmount}</h3>
        <button
          onClick={handleClearCart}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            backgroundColor: "#555",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}
