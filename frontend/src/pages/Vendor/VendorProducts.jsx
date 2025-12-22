// src/pages/Vendor/VendorProducts.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, deleteProduct } from "../../api/productApi";

export default function VendorProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const data = await getProducts({});
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this product?")) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const styles = {
    container: {
      padding: "20px",
      marginLeft: "4cm", // ← Added 4 cm space on the left side
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
    productList: {
      listStyle: "none",
      padding: 0,
    },
    productItem: {
      background: "#f9fafb",
      marginBottom: "10px",
      padding: "12px",
      borderRadius: "8px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      border: "1px solid #e5e7eb",
    },
    productInfo: {
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
        <h1 style={styles.heading}>Vendor Products</h1>
        <button
          style={styles.addButton}
          onClick={() => navigate("/vendors/add-product")}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
        >
          + Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul style={styles.productList}>
          {products.map((p) => (
            <li key={p._id} style={styles.productItem}>
              <span style={styles.productInfo}>
                {p.name} - ${p.price}
              </span>
              <button
                style={styles.deleteButton}
                onClick={() => handleDelete(p._id)}
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
