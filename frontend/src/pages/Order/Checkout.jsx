import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import noImage from "../../assets/images/no-image.png";
import { getCoupons } from "../../api/couponApi";

const BASE_URL = "http://localhost:5000";

export default function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [error, setError] = useState("");

  // Redirect if accessed directly or no items
  if (!state || !state.items || !state.items.length) {
    navigate("/cart");
    return null;
  }

  const { items, total } = state;

  /* ================= FETCH COUPONS ================= */
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const data = await getCoupons(); // fetch from backend
        setCoupons(data);
      } catch (err) {
        console.error("Failed to load coupons", err);
      }
    };
    fetchCoupons();
  }, []);

  /* ================= IMAGE HELPER ================= */
  const getImageUrl = (product) => {
    if (!product) return noImage;

    if (product.image) return `${BASE_URL}/${product.image.replace(/^\/+/, "")}`;
    if (Array.isArray(product.images) && product.images.length > 0)
      return `${BASE_URL}/${product.images[0].replace(/^\/+/, "")}`;

    return noImage;
  };

  /* ================= APPLY COUPON ================= */
  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();

    const coupon = coupons.find(c => c.code.toUpperCase() === code);

    if (!coupon) {
      setError("Invalid coupon code");
      setDiscount(0);
      setAppliedCoupon(null);
      return;
    }

    if (!coupon.isActive) {
      setError("Coupon is inactive");
      setDiscount(0);
      setAppliedCoupon(null);
      return;
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      setError("Coupon has expired");
      setDiscount(0);
      setAppliedCoupon(null);
      return;
    }

    // Percentage discount calculation
    const discountAmount = (total * coupon.discount) / 100;
    setDiscount(discountAmount);
    setAppliedCoupon(coupon);
    setError("");
  };

  const payableAmount = Math.max(total - discount, 0);

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Checkout</h2>

      {/* ================= ITEMS ================= */}
      <table width="100%" cellPadding={10}>
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
              <td align="center">${item.product.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= COUPON SECTION ================= */}
      <div
        style={{
          marginTop: 30,
          padding: 20,
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      >
        <h3>Apply Coupon</h3>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            type="text"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            style={{
              padding: 10,
              flex: 1,
              borderRadius: 5,
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={applyCoupon}
            style={{
              padding: "10px 20px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 5,
            }}
          >
            Apply
          </button>
        </div>
        {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
        {appliedCoupon && (
          <p style={{ color: "green", marginTop: 10 }}>
            Coupon <b>{appliedCoupon.code}</b> applied successfully - You saved {appliedCoupon.discount}% (${discount.toFixed(2)})
          </p>
        )}
      </div>

      {/* ================= ORDER SUMMARY ================= */}
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
        <p><strong>Discount:</strong> -${discount.toFixed(2)}</p>
        <hr />
        <p><strong>Payable Amount:</strong> ${payableAmount.toFixed(2)}</p>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button
            onClick={() => navigate("/carts")}
            style={{
              padding: "10px 20px",
              background: "#555",
              color: "#fff",
              border: "none",
              borderRadius: 5,
            }}
          >
            Back to Cart
          </button>
        <button
            onClick={() =>
            navigate("/invoice", {
               state: {
                items,
                total,
                discount,
                appliedCoupon,
                payableAmount: Math.max(total - discount, 0),
              },
            })
           }
            style={{
              padding: "10px 20px",
              background: "#16a34a",
              color: "#fff",
              border: "none",
              borderRadius: 5,
            }}
          >
          Proceed to Payment
        </button>

          
        </div>
      </div>
    </div>
  );
}
