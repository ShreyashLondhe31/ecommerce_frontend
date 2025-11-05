import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Page imports
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import NotFoundPage from "./pages/NotFoundPage";
import CategoryPage from "./pages/CategoryPage";
import LoginPage from "./pages/LoginPage";

// Admin pages
import AdminLayout from "./components/admin/Layout/AdminLayout";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import ProductsPage from "./pages/admin/ProductsPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import BrandsPage from "./pages/admin/BrandsPage";

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("adminAuth") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}; // Component imports
import Navbar from "./components/navbar/Navbar";
import AnnouncementBar from "./components/AnnouncementBar";

// Layout wrapper for public routes
const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <AnnouncementBar />
      <main className="relative">
        <Outlet />
      </main>
    </>
  );
};

function App() {
  return (
    <div className="App min-h-screen w-full overflow-x-hidden">
      <Routes>
        {/* Public Routes with Navbar and AnnouncementBar */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Redirect unauthorized admin-like paths to 404 */}
          <Route path="/products" element={<NotFoundPage />} />
          <Route path="/categories" element={<NotFoundPage />} />
          <Route path="/brands" element={<NotFoundPage />} />
          <Route path="/dashboard" element={<NotFoundPage />} />

          {/* 404 catch-all route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin Routes - all protected under /admin/ path */}
        <Route path="/admin">
          <Route path="login" element={<AdminLoginPage />} />
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="brands" element={<BrandsPage />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
