import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  RiDashboardLine,
  RiProductHuntLine,
  RiPriceTag3Line,
} from "react-icons/ri";
import { BiCategoryAlt } from "react-icons/bi";

const menuItems = [
  { path: "/admin", icon: RiDashboardLine, label: "Dashboard" },
  { path: "/admin/products", icon: RiProductHuntLine, label: "Products" },
  { path: "/admin/categories", icon: BiCategoryAlt, label: "Categories" },
  { path: "/admin/brands", icon: RiPriceTag3Line, label: "Brands" },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 w-64 h-full bg-white shadow-md">
      {/* Logo Area */}
      <div className="p-4 border-b">
        <Link to="/admin" className="text-xl font-bold text-amber-600">
          Admin Panel
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-amber-50 text-amber-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-amber-600"
                  }`}
                >
                  <Icon className="text-xl" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
