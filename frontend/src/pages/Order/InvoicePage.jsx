import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import noImage from "../../assets/images/no-image.png";

const BASE_URL = "http://localhost:5000";

export default function InvoicePage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state || !state.items || !state.items.length) {
    navigate("/cart");
    return null;
  }

  const { items, total, discount, appliedCoupon, payableAmount } = state;

  const getImageUrl = (product) => {
    if (!product) return noImage;
    if (product.image) return `${BASE_URL}/${product.image.replace(/^\/+/, "")}`;
    if (Array.isArray(product.images) && product.images.length > 0)
      return `${BASE_URL}/${product.images[0].replace(/^\/+/, "")}`;
    return noImage;
  };

  const handlePlaceOrder = () => {
    // Redirect to payment page with all necessary data
    navigate("/payment", {
      state: {
        items,
        total,
        discount,
        appliedCoupon,
        payableAmount,
      },
    });
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Invoice</h2>

      {/* ================= ITEMS ================= */}
      <table width="100%" cellPadding={10} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">Product</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.product._id}>
              <td style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <img
                  src={getImageUrl(item.product)}
                  alt={item.product.name}
                  width={50}
                  height={50}
                  style={{ objectFit: "cover", borderRadius: 5 }}
                />
                {item.product.name}
              </td>
              <td align="center">${item.product.price}</td>
              <td align="center">{item.quantity}</td>
              <td align="center">${(item.product.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= SUMMARY ================= */}
      <div
        style={{
          marginTop: 30,
          padding: 20,
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      >
        <h3>Order Summary</h3>
        <p><strong>Subtotal:</strong> ${total.toFixed(2)}</p>
        {appliedCoupon && (
          <p>
            <strong>Coupon ({appliedCoupon.code}):</strong> -${discount.toFixed(2)}
          </p>
        )}
        <hr />
        <p><strong>Payable Amount:</strong> ${payableAmount.toFixed(2)}</p>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "10px 20px",
              background: "#555",
              color: "#fff",
              border: "none",
              borderRadius: 5,
            }}
          >
            Back to Home
          </button>

          <button
            onClick={handlePlaceOrder}
            style={{
              padding: "10px 20px",
              background: "#16a34a",
              color: "#fff",
              border: "none",
              borderRadius: 5,
            }}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
