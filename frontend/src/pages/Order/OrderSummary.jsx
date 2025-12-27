import React, { useEffect, useState } from "react";
import { getOrdersByUser } from "../api/orderApi"; // Your API functions
import { useAuth } from "../context/AuthContext"; // Assuming you have auth context

export default function OrdersPage() {
  const { user } = useAuth(); // get current logged-in user
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrdersByUser(user._id);
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchOrders();
  }, [user]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading orders...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  if (orders.length === 0) return <p style={{ textAlign: "center" }}>No orders found.</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "30px auto", padding: "0 20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>My Orders</h2>
      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 20,
            marginBottom: 20,
            background: "#f9fafb",
          }}
        >
          <h3>Order ID: {order._id}</h3>
          <p>Status: <strong>{order.status}</strong></p>
          <p>Total: ${order.total.toFixed(2)}</p>
          <p>Payment: {order.paymentMethod}</p>

          <h4>Products:</h4>
          <ul>
            {order.products.map((p) => (
              <li key={p.product._id}>
                {p.product.name} - Qty: {p.quantity} - Price: ${p.product.price}
              </li>
            ))}
          </ul>

          <h4>Shipping Address:</h4>
          <p>
            {order.address.ward}, {order.address.street}, {order.address.municipality},{" "}
            {order.address.district}, {order.address.province}, {order.address.country}
          </p>
        </div>
      ))}
    </div>
  );
}
