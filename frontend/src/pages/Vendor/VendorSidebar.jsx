// src/pages/vendor/VendorSidebar.jsx
import {
  ChartBarIcon,                // Dashboard
  UserCircleIcon,              // Profile
  ShoppingBagIcon,             // Products
  ClipboardDocumentListIcon,   // Orders
  EnvelopeIcon,                // Messages
  ArrowRightOnRectangleIcon,   // Logout
  TicketIcon,                  // Coupons
} from "@heroicons/react/24/solid";

import { NavLink, useNavigate } from "react-router-dom";
import '../../assets/styles/sidebar.css'; // Make sure your vendor-sidebar CSS exists

export default function VendorSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear auth info
    navigate('/login'); // Redirect to login
  };

  return (
    <div className="vendor-sidebar">
      {/* Title */}
      <h5 style={{ marginBottom: '1.5rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
        Vendor Panel
      </h5>

      <nav>
        <NavLink
          to="/vendors/dashboard"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <ChartBarIcon className="icon" />
          Dashboard
        </NavLink>

        <NavLink
          to="/vendors/profile"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <UserCircleIcon className="icon" />
          Profile
        </NavLink>

        <NavLink
          to="/vendors/products"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <ShoppingBagIcon className="icon" />
          Products
        </NavLink>

        <NavLink
          to="/vendors/orders"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <ClipboardDocumentListIcon className="icon" />
          Orders
        </NavLink>

        <NavLink
          to="/vendors/messages"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <EnvelopeIcon className="icon" />
          Messages
        </NavLink>

        <NavLink
          to="/vendors/coupon"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <TicketIcon className="icon" />
          Coupon
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
