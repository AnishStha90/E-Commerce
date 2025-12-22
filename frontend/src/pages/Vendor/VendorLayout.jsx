// src/pages/admin/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import VendorSidebar from "./VendorSidebar";

export default function VendorLayout() {
  return (
    <div className="flex min-h-screen">
      <VendorSidebar />
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
