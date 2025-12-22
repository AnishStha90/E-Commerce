import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          E-Shop
        </Link>

        {/* Links */}
        <div className="flex items-center space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "underline" : "hover:underline"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? "underline" : "hover:underline"
            }
          >
            Products
          </NavLink>

          {user && user.role === "admin" && (
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                isActive ? "underline" : "hover:underline"
              }
            >
              Admin
            </NavLink>
          )}

          {user && user.role === "vendor" && (
            <NavLink
              to="/vendor/dashboard"
              className={({ isActive }) =>
                isActive ? "underline" : "hover:underline"
              }
            >
              Vendor
            </NavLink>
          )}

          {user ? (
            <>
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  isActive ? "underline" : "hover:underline"
                }
              >
                Cart
              </NavLink>
              <NavLink
                to="/wishlist"
                className={({ isActive }) =>
                  isActive ? "underline" : "hover:underline"
                }
              >
                Wishlist
              </NavLink>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "underline" : "hover:underline"
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? "underline" : "hover:underline"
                }
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
