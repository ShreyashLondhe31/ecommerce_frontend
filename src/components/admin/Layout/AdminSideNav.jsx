import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MdDashboard, MdInventory } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { TbBrandAirtable } from "react-icons/tb";
import { IoClose } from "react-icons/io5";

const menuItems = [
  { path: "/admin", icon: MdDashboard, label: "Dashboard" },
  { path: "/admin/products", icon: MdInventory, label: "Products" },
  { path: "/admin/categories", icon: BiCategory, label: "Categories" },
  { path: "/admin/brands", icon: TbBrandAirtable, label: "Brands" },
];

const AdminSideNav = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Backdrop - now works on all screen sizes */}
      <div
        // <-- MODIFIED: Removed 'lg:hidden'
        className={`
          fixed inset-0 bg-black/30 backdrop-blur-sm transition-all duration-300
          ${
            isOpen
              ? "opacity-100 z-[60]"
              : "opacity-0 pointer-events-none -z-10"
          }
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar - now always slides */}
      <aside
        // <-- MODIFIED: Removed 'lg:translate-x-0'
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg z-[70]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Navigation Menu */}
        <nav className="p-4 overflow-y-auto h-full">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    // <-- MODIFIED: Always close on click
                    onClick={onClose}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg 
                      transition-colors w-full group
                      ${
                        isActive
                          ? "bg-amber-50 text-amber-600"
                          : "text-gray-600 hover:bg-amber-50/50 hover:text-amber-600"
                      }
                    `}
                  >
                    <Icon
                      className={`text-xl ${
                        isActive
                          ? "text-amber-600"
                          : "text-gray-500 group-hover:text-amber-600"
                      }`}
                    />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AdminSideNav;
