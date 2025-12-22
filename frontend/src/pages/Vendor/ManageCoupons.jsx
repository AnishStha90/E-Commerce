// src/pages/vendor/VendorCoupon.jsx
import React, { useEffect, useState } from "react";
import { getCoupons, deleteCoupon } from "../../api/couponApi";
import { useNavigate } from "react-router-dom";

export default function ManageCoupon() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all coupons
  const fetchCoupons = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login"); // redirect if no token

    try {
      const data = await getCoupons();
      const couponsArray = Array.isArray(data) ? data : data.coupons || [];
      setCoupons(couponsArray);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setLoading(false);

      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  // Delete coupon
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;

    try {
      await deleteCoupon(id);
      fetchCoupons(); // refresh list
    } catch (err) {
      console.error("Delete error:", err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>
    );

  return (
    <div style={{ paddingLeft: "4cm", paddingTop: "20px", paddingRight: "20px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>All Coupons</h2>
        <button
          onClick={() => navigate("/vendors/coupons/add")}
          style={{
            backgroundColor: "#2563eb",
            color: "#fff",
            padding: "8px 16px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          + Add Coupon
        </button>
      </div>

      {/* Coupons Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
        }}
      >
        {coupons.length === 0 ? (
          <p>No coupons available.</p>
        ) : (
          coupons.map((coupon) => (
            <div
              key={coupon._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "10px",
                textAlign: "center",
                backgroundColor: "#fff",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ marginBottom: "10px" }}>{coupon.code}</h3>
              <p>Discount: {coupon.discount}%</p>
              <p>
                Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
              </p>

              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => navigate(`/vendors/coupons/edit/${coupon._id}`)}
                  style={{
                    padding: "6px 12px",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(coupon._id)}
                  style={{
                    padding: "6px 12px",
                    cursor: "pointer",
                    backgroundColor: "#ff4d4f",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
