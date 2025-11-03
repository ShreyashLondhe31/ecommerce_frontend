import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { MdMenu, MdSettings, MdPerson } from "react-icons/md";
import AdminSideNav from "./AdminSideNav";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on any navigation
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50">
        <div className="flex h-full items-center justify-between px-4">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
            >
              <MdMenu size={22} className="text-gray-600" />
            </button>
            <span className="font-semibold text-amber-600 text-lg">
              Admin Panel
            </span>
          </div>

          {/* Admin Actions */}
          <div className="flex items-center gap-2">
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Admin settings"
            >
              <MdSettings size={22} className="text-gray-600" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Admin profile"
            >
              <MdPerson size={22} className="text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="min-h-screen pt-16">
        {/* Sidebar */}
        <AdminSideNav
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="w-full p-6">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
