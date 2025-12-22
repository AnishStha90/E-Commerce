import React from "react";
import Sidebar from "../components/Sidebar";

export default function VendorLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar links={[
        { name: "Dashboard", path: "/vendor/dashboard" },
        { name: "Orders", path: "/vendor/orders" },
        { name: "Products", path: "/vendor/products" },
      ]} />
      <main className="flex-grow p-6 bg-gray-100">{children}</main>
    </div>
  );
}
