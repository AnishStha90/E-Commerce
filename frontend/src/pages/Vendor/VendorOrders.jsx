import React, { useEffect, useState } from "react";
import axios from "axios";

export default function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  console.log(user);
  console.log("user role:", user?.role);
  console.log("token:", token);
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Backend endpoint: vendor ID is inferred from token
        const res = await axios.get(
          `http://localhost:5000/api/orders/vendor`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch vendor orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleStatusChange = async (orderId, status) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/orders/status/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update only the order that changed
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? res.data.order : o))
      );
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: 50 }}>Loading orders...</p>
    );

  if (!token)
    return (
      <p style={{ textAlign: "center", marginTop: 50, color: "red" }}>
        You are not logged in. Please login as a vendor to view orders.
      </p>
    );

  if (!orders.length)
    return (
      <p style={{ textAlign: "center", marginTop: 50 }}>No orders yet.</p>
    );

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 1000,
        margin: "auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", fontSize: 28, marginBottom: 20 }}>
        Vendor Orders
      </h2>

      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            border: "1px solid #ddd",
            padding: 20,
            borderRadius: 8,
            marginBottom: 20,
            backgroundColor: "#fdfdfd",
          }}
        >
          <p>
            <strong>Order ID:</strong> {order._id}
          </p>
          <p>
            <strong>User:</strong> {order.user?.name || "N/A"} (
            {order.user?.email || "N/A"})
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(order._id, e.target.value)}
              style={{ marginLeft: 10, padding: "5px 10px", borderRadius: 5 }}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </p>
          <p>
            <strong>Total:</strong> ${order.total.toFixed(2)}
          </p>
          <p>
            <strong>Products:</strong>
          </p>
          <ul>
            {order.products.map((p) => (
              <li key={p.product._id}>
                {p.product.name} x {p.quantity}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
