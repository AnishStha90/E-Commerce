// src/pages/admin/AdminSidebar.jsx
import {
  ChartBarIcon,                // Dashboard
  FolderIcon,                  // Category
  ClipboardDocumentCheckIcon,  // Report
  UserGroupIcon,               // Users & Vendors
  UserCircleIcon,              // Profile
  ArrowRightOnRectangleIcon,   // Logout
} from "@heroicons/react/24/solid";

import { NavLink, useNavigate } from "react-router-dom";
import '../../assets/styles/sidebar.css'; // Use same CSS for consistency

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear auth info
    navigate('/login'); // Redirect to login
  };

  return (
    <div className="admin-sidebar">
      {/* Title */}
      <h5 style={{ marginBottom: '1.5rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
        Admin Panel
      </h5>

      <nav>
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <ChartBarIcon className="icon" />
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/profile"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <UserCircleIcon className="icon" />
          Profile
        </NavLink>

        <NavLink
          to="/admin/category"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FolderIcon className="icon" />
          Category
        </NavLink>

        <NavLink
          to="/admin/reports"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <ClipboardDocumentCheckIcon className="icon" />
          Reports
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <UserGroupIcon className="icon" />
          Users & Vendors
        </NavLink>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          type="button"
          className="custom-logout-btn"
        >
          <ArrowRightOnRectangleIcon className="custom-logout-icon" />
          <span className="logout-text">Logout</span>
        </button>
      </nav>
    </div>
  );
}
