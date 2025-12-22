// src/pages/Product/AddProduct.jsx
import React, { useState, useEffect } from "react";
import { createProduct } from "../../api/productApi";
import { getCategories } from "../../api/categoryApi";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load categories.");
      }
    };
    fetchCategories();
  }, []);

  const styles = {
    page: {
      maxWidth: 840,
      margin: "24px auto",
      padding: 20,
      borderRadius: 8,
      boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial',
      background: "#fff",
    },
    heading: { fontSize: 22, marginBottom: 12, color: "#111" },
    formRow: {
      display: "flex",
      gap: 12,
      marginBottom: 12,
      alignItems: "center",
      flexWrap: "wrap",
    },
    label: { width: 120, fontSize: 14, color: "#333" },
    input: {
      flex: 1,
      padding: "10px 12px",
      fontSize: 14,
      borderRadius: 6,
      border: "1px solid #ccd0d6",
      outline: "none",
    },
    select: {
      flex: 1,
      padding: "10px 12px",
      fontSize: 14,
      borderRadius: 6,
      border: "1px solid #ccd0d6",
      outline: "none",
      backgroundColor: "#fff",
    },
    textarea: {
      width: "100%",
      minHeight: 110,
      padding: 12,
      fontSize: 14,
      borderRadius: 6,
      border: "1px solid #ccd0d6",
      resize: "vertical",
      outline: "none",
    },
    fileInput: { padding: "6px 0" },
    previewsWrap: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      marginTop: 8,
    },
    preview: {
      position: "relative",
      width: 100,
      height: 100,
      objectFit: "cover",
      borderRadius: 6,
      border: "1px solid #e1e4e8",
    },
    removeBtn: {
      position: "absolute",
      top: -6,
      right: -6,
      background: "#b91c1c",
      color: "#fff",
      border: "none",
      borderRadius: "50%",
      width: 20,
      height: 20,
      cursor: "pointer",
      fontSize: 12,
      fontWeight: "bold",
      lineHeight: "20px",
      textAlign: "center",
    },
    btnRow: { display: "flex", gap: 10, marginTop: 16 },
    button: {
      padding: "10px 14px",
      borderRadius: 8,
      border: "none",
      cursor: "pointer",
      fontWeight: 600,
    },
    primaryBtn: {
      background: "#2563eb",
      color: "#fff",
      boxShadow: "0 6px 14px rgba(37,99,235,0.14)",
    },
    secondaryBtn: {
      background: "#f3f4f6",
      color: "#111",
    },
    message: { marginTop: 12, fontSize: 14 },
    error: { color: "#b91c1c" },
    success: { color: "#047857" },
    smallHelp: { fontSize: 12, color: "#6b7280" },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFiles = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Limit total images to 6
    const totalFiles = [...images, ...selectedFiles].slice(0, 6);
    setImages(totalFiles);

    // Revoke old previews
    previews.forEach((url) => URL.revokeObjectURL(url));

    // Create new previews
    const newPreviews = totalFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);

    // Revoke old previews
    previews.forEach((url) => URL.revokeObjectURL(url));
    const updatedPreviews = updatedImages.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviews(updatedPreviews);
  };

  const resetForm = () => {
    setForm({ name: "", price: "", category: "", stock: "", description: "" });
    setImages([]);
    previews.forEach((u) => URL.revokeObjectURL(u));
    setPreviews([]);
    setError(null);
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!form.name.trim() || !form.price) {
      setError("Product name and price are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("stock", form.stock);
    formData.append("description", form.description);
    images.forEach((file) => formData.append("images", file));

    try {
      setLoading(true);
      const res = await createProduct(formData);
      setMessage(res?.message || "Product created successfully.");
      resetForm();
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Something went wrong while creating the product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Add Product</h2>

      <form onSubmit={handleSubmit}>
        <div style={styles.formRow}>
          <label style={styles.label}>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
            placeholder="e.g. Leather Wallet"
            required
          />
        </div>

        <div style={styles.formRow}>
          <label style={styles.label}>Price</label>
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            style={styles.input}
            placeholder="e.g. 499.99"
            required
          />
        </div>

        <div style={styles.formRow}>
          <label style={styles.label}>Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            style={styles.select}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formRow}>
          <label style={styles.label}>Stock</label>
          <input
            name="stock"
            value={form.stock}
            onChange={handleChange}
            style={styles.input}
            placeholder="e.g. 50"
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ ...styles.label, display: "block", marginBottom: 6 }}>
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            style={styles.textarea}
            placeholder="Write a short description of the product..."
          />
        </div>

        <div style={{ marginBottom: 6 }}>
          <label style={{ ...styles.label, display: "block", marginBottom: 6 }}>
            Images <span style={styles.smallHelp}>(up to 6)</span>
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            style={styles.fileInput}
          />
          <div style={styles.previewsWrap}>
            {previews.length === 0 ? (
              <div style={styles.smallHelp}>No images selected</div>
            ) : (
              previews.map((src, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={src} alt={`preview-${i}`} style={styles.preview} />
                  <button
                    type="button"
                    style={styles.removeBtn}
                    onClick={() => removeImage(i)}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={styles.btnRow}>
          <button
            type="submit"
            style={{ ...styles.button, ...styles.primaryBtn }}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Product"}
          </button>

          <button
            type="button"
            onClick={resetForm}
            style={{ ...styles.button, ...styles.secondaryBtn }}
            disabled={loading}
          >
            Reset
          </button>
        </div>

        <div style={styles.message}>
          {error && <div style={{ ...styles.error, marginTop: 8 }}>{error}</div>}
          {message && (
            <div style={{ ...styles.success, marginTop: 8 }}>{message}</div>
          )}
        </div>
      </form>
    </div>
  );
}
