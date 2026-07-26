import React from "react";
import { Outlet } from "react-router-dom";
import AdminSideBar from "./AdminSideBar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <AdminSideBar />

      <main className="flex-1 p-4 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
