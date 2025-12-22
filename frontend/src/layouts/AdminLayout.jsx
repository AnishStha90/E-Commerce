import React from "react";
import Sidebar from "../components/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar links={[
        { name: "Dashboard", path: "/admin/dashboard" },
        { name: "Users", path: "/admin/users" },
        { name: "Products", path: "/admin/products" },
      ]} />
      <main className="flex-grow p-6 bg-gray-100">{children}</main>
    </div>
  );
}
