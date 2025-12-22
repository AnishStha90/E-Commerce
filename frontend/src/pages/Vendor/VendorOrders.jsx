// src/pages/Vendor/VendorOrders.jsx
import React, { useEffect, useState } from "react";
import { getOrdersByUser, updateOrderStatus } from "../../api/orderApi";

export default function VendorOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const data = await getOrdersByUser("vendor"); // adjust backend to get vendor orders
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Vendor Orders</h1>
      {orders.length === 0 ? <p>No orders found.</p> :
        <ul>
          {orders.map(o => (
            <li key={o._id}>
              {o.productName} - {o.status} 
              <select onChange={(e) => handleStatusUpdate(o._id, e.target.value)} value={o.status}>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </li>
          ))}
        </ul>
      }
    </div>
  );
}
