// src/pages/vendor/VendorAddCoupon.jsx
import React, { useState } from "react";
import { createCoupon } from "../../api/couponApi";
import { useNavigate } from "react-router-dom";

export default function AddCoupon() {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code || !discount || !expiryDate) {
      alert("Please fill all fields");
      return;
    }

    const couponData = {
      code,
      discount: Number(discount),
      expiryDate,
    };

    try {
      setLoading(true);
      await createCoupon(couponData);
      alert("Coupon added successfully!");
      navigate("/vendors/coupons"); // Redirect to coupon list
    } catch (err) {
      console.error(err);
      alert("Failed to add coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingLeft: "4cm", paddingTop: "20px", paddingRight: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Add New Coupon</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Coupon Code:</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Discount (%):</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Expiry Date:</label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#2563eb",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {loading ? "Adding..." : "Add Coupon"}
        </button>
      </form>
    </div>
  );
}
