import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { loginUser } from "../../api/userApi";
import { loginVendor } from "../../api/vendorApi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // No default role
  const [message, setMessage] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      setMessage("Please select a role.");
      return;
    }

    try {
      if (role === "user") {
        const res = await loginUser({ email, password });
        login({
          id: res.user._id,
          name: res.user.name,
          email: res.user.email,
          role: "user",
          token: res.token,
        });
        setMessage(`Welcome, ${res.user.name}!`);
        setTimeout(() => navigate("/"), 1000);
      } else if (role === "vendor") {
        const res = await loginVendor({ email, password });
        login({
          id: res._id,
          name: res.storeName,
          email: res.email,
          role: "vendor",
          token: res.token,
        });
        setMessage(`Welcome, ${res.storeName}!`);
        setTimeout(() => navigate("/vendors/dashboard"), 1000);
      } else if (role === "admin") {
        // If you have a separate admin API, use it. Using loginUser for demo
        const res = await loginUser({ email, password });
        login({
          id: res.user._id,
          name: res.user.name,
          email: res.user.email,
          role: "admin",
          token: res.token,
        });
        setMessage(`Welcome, Admin ${res.user.name}!`);
        setTimeout(() => navigate("/admin/dashboard"), 1000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#fff",
          padding: "40px 30px",
          borderRadius: "10px",
          width: "360px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <h2
          style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}
        >
          Login
        </h2>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "14px",
            color: role ? "#555" : "#999",
            marginBottom: "10px",
          }}
        >
          <option value="" disabled>
            Select Role
          </option>
          <option value="user">User</option>
          <option value="vendor">Vendor</option>
          <option value="admin">Admin</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />

        <button
          type="submit"
          style={{
            padding: "12px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
        >
          Login
        </button>

        {message && (
          <p
            style={{
              textAlign: "center",
              color: message.toLowerCase().includes("invalid") ? "red" : "green",
            }}
          >
            {message}
          </p>
        )}

        {role !== "admin" && (
          <p style={{ textAlign: "center", fontSize: "14px", color: "#555" }}>
            Don't have an account?{" "}
            <Link
              to={role === "vendor" ? "/vendors/register" : "/register"}
              style={{ color: "#007bff", textDecoration: "none" }}
            >
              Register
            </Link>
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
 