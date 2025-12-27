import React from "react";
import { useParams, Link } from "react-router-dom";

export default function OrderSuccess() {
  const { orderId } = useParams();

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h2>Order Confirmed!</h2>
      <p>Your order <strong>{orderId}</strong> has been successfully placed.</p>
      <Link to="/orders" style={{ color: "#16a34a", fontWeight: 500 }}>
        View My Orders
      </Link>
    </div>
  );
}
