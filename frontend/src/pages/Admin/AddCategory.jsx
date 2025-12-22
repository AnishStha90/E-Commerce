// src/pages/Admin/AddCategory.jsx
import React, { useState } from "react";
import { createCategory } from "../../api/categoryApi";

export default function AddCategory() {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const styles = {
    page: {
      maxWidth: 600,
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
      flexDirection: "column",
      gap: 6,
      marginBottom: 12,
    },
    label: { fontSize: 14, color: "#333" },
    input: {
      padding: "10px 12px",
      fontSize: 14,
      borderRadius: 6,
      border: "1px solid #ccd0d6",
      outline: "none",
    },
    textarea: {
      width: "100%",
      minHeight: 80,
      padding: 12,
      fontSize: 14,
      borderRadius: 6,
      border: "1px solid #ccd0d6",
      resize: "vertical",
      outline: "none",
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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({ name: "", description: "" });
    setError(null);
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!form.name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setLoading(true);
      const res = await createCategory(form);
      const successMessage = res?.message || "Category created successfully.";

      // Show alert on success
      alert(successMessage);

      setMessage(successMessage);
      resetForm();
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Something went wrong while creating the category."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Add Category</h2>

      <form onSubmit={handleSubmit}>
        <div style={styles.formRow}>
          <label style={styles.label}>Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
            placeholder="e.g. Electronics"
            required
          />
        </div>

        <div style={styles.formRow}>
          <label style={styles.label}>Description (optional)</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            style={styles.textarea}
            placeholder="Short description of the category..."
          />
        </div>

        <div style={styles.btnRow}>
          <button
            type="submit"
            style={{ ...styles.button, ...styles.primaryBtn }}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Category"}
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
