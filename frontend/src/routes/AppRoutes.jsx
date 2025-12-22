import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import AboutPage from "../pages/Home/About";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ProductList from "../pages/Product/ProductList";
import ProductDetail from "../pages/Product/ProductDetail";
import CartPage from "../pages/Cart/CartPage";
import WishlistPage from "../pages/Wishlist/WishlistPage";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import VendorDashboard from "../pages/Vendor/VendorDashboard";
import NotFound from "../pages/Error/NotFound";
import PrivateRoutes from "./PrivateRoutes";

import Header from "../components/Header";
import Footer from "../components/Footer";
import NotificationList from "../pages/Home/NotificationList";
import MessageCenter from "../pages/Message/MessageCenter";
import VendorLayout from "../pages/Vendor/VendorLayout";
import VendorProfile from "../pages/Vendor/VendorProfile";
import VendorProducts from "../pages/Vendor/VendorProducts";
import VendorOrders from "../pages/Vendor/VendorOrders";
import VendorMessages from "../pages/Vendor/VendorMessages";
import AddProduct from "../pages/Product/AddProduct";
import ManageCoupon from "../pages/Vendor/ManageCoupons";
import AddCoupon from "../pages/Vendor/AddCoupon";
import AdminLayout from "../pages/Admin/AdminLayout";
import AddCategory from "../pages/Admin/AddCategory";
import ManageCategories from "../pages/Admin/ManageCategory";
import AdminProfile from "../pages/Admin/AdminProfile";
export default function AppRoutes() {
  const location = useLocation();

  // Show header/footer only on user routes
  const showHeaderFooter = !location.pathname.startsWith("/admin") && !location.pathname.startsWith("/vendors") && !location.pathname.startsWith("/login") && !location.pathname.startsWith("/register");

  return (
    <>
      {showHeaderFooter && <Header />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/product" element={<ProductList />} />
        <Route path="/productDetail/:id" element={<ProductDetail />} />
        <Route path="/notifications" element={<NotificationList />} />
        <Route path="/messages" element={<MessageCenter />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />

        <Route element={<PrivateRoutes role="user" />}>
          <Route path="/carts" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
        </Route>

        <Route element={<PrivateRoutes role="admin" />}>
          <Route path="/admin" element={<AdminLayout/>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="profile" element={<AdminProfile/>} />
            <Route path="add-category" element={<AddCategory/>} />
            <Route path="category" element={<ManageCategories/>} />
          </Route>
        </Route>

        <Route element={<PrivateRoutes role="vendor" />}>
          <Route path="/vendors" element={<VendorLayout />}>
            <Route path="dashboard" element={<VendorDashboard />} />
            <Route path="profile" element={<VendorProfile />} />
            <Route path="products" element={<VendorProducts />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="orders" element={<VendorOrders />} />
            <Route path="messages" element={<VendorMessages />} />
            <Route path="coupon" element={<ManageCoupon/>} />
            <Route path="coupons/add" element={<AddCoupon/>} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      {showHeaderFooter && <Footer />}
    </>
  );
}
