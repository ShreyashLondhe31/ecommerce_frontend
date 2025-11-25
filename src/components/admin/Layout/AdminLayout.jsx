import React, { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { MdMenu, MdSettings, MdPerson, MdLogout } from "react-icons/md";
import AdminSideNav from "./AdminSideNav";
import SiteSettingsForm from "../SiteSettings/SiteSettingsForm"

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  // Close sidebar on navigation
  useEffect(() => {
    setIsSidebarOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout Handler
  const handleLogout = () => {
    // Clear ALL auth related items
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Redirect to Homepage
    navigate("/");
  };

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
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Admin settings"
            >
              <MdSettings size={22} className="text-gray-600" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center bg-gray-100 text-amber-600"
                aria-label="Admin profile"
              >
                <MdPerson size={22} />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 transform origin-top-right transition-all">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">Admin User</p>
                    <p className="text-xs text-gray-500">Settings</p>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <MdLogout size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="min-h-screen pt-16">
        <AdminSideNav
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="w-full p-6">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Site Settings Modal */}
      {isSettingsOpen && (
        <SiteSettingsForm onClose={() => setIsSettingsOpen(false)} />
      )}
    </div>
  );
};

export default AdminLayout;