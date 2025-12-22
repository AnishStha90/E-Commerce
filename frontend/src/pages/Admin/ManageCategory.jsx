// src/pages/Admin/ManageCategories.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories, deleteCategory } from "../../api/categoryApi";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        fetchCategories();
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const styles = {
    container: {
      padding: "20px",
      marginLeft: "4cm", // same left space as sidebar
      fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
    },
    headingRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    heading: {
      fontSize: "24px",
      color: "#111",
    },
    addButton: {
      padding: "10px 16px",
      backgroundColor: "#2563eb",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      fontWeight: "600",
      cursor: "pointer",
      boxShadow: "0 4px 10px rgba(37,99,235,0.2)",
      transition: "background 0.2s",
    },
    categoryList: {
      listStyle: "none",
      padding: 0,
    },
    categoryItem: {
      background: "#f9fafb",
      marginBottom: "10px",
      padding: "12px",
      borderRadius: "8px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      border: "1px solid #e5e7eb",
    },
    categoryInfo: {
      fontSize: "16px",
      color: "#111",
    },
    deleteButton: {
      backgroundColor: "#ef4444",
      color: "#fff",
      border: "none",
      padding: "6px 10px",
      borderRadius: "6px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.headingRow}>
        <h1 style={styles.heading}>Manage Categories</h1>
        <button
          style={styles.addButton}
          onClick={() => navigate("/admin/add-category")}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
        >
          + Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <ul style={styles.categoryList}>
          {categories.map((c) => (
            <li key={c._id} style={styles.categoryItem}>
              <span style={styles.categoryInfo}>
                {c.name} {c.description ? `- ${c.description}` : ""}
              </span>
              <button
                style={styles.deleteButton}
                onClick={() => handleDelete(c._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
