// src/pages/Admin/AdminProfile.jsx
import React, { useEffect, useState } from "react";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
} from "../../api/userApi";

export default function AdminProfile() {
  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    phone: "",
    role: "admin",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setAdmin(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const updated = await updateUserProfile(admin);
      setAdmin(updated);
      setMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setMessage("Failed to update profile.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        await deleteUserProfile();
        window.location.href = "/login";
      } catch (err) {
        setMessage("Failed to delete profile.");
      }
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        backgroundColor: "#f9f9f9",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "400px",
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>Admin Profile</h1>

        {message && (
          <p
            style={{
              backgroundColor: "#e0ffe0",
              padding: "10px",
              borderRadius: "5px",
              color: "#006400",
            }}
          >
            {message}
          </p>
        )}

        <div style={{ marginBottom: "15px", textAlign: "left" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Name:</label>
          <input
            name="name"
            value={admin.name}
            onChange={handleChange}
            disabled={!isEditing}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px", textAlign: "left" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Email:</label>
          <input
            name="email"
            value={admin.email}
            onChange={handleChange}
            disabled={!isEditing}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px", textAlign: "left" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Phone:</label>
          <input
            name="phone"
            value={admin.phone}
            onChange={handleChange}
            disabled={!isEditing}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Buttons */}
        {!isEditing ? (
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#4CAF50",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#f44336",
                color: "#fff",
                cursor: "pointer",
                marginLeft: "10px",
              }}
            >
              Delete
            </button>
          </div>
        ) : (
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={handleUpdate}
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#2196F3",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Save
            </button>

            <button
              onClick={() => setIsEditing(false)}
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#9E9E9E",
                color: "#fff",
                cursor: "pointer",
                marginLeft: "10px",
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
