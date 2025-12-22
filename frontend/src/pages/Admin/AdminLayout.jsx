// src/pages/Admin/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import '../../assets/styles/sidebar.css'; // Optional: custom layout styling

export default function AdminLayout() {
  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <div className="admin-content" style={{ flex: 1, padding: '1.5rem' }}>
        <Outlet />
      </div>
    </div>
  );
}
