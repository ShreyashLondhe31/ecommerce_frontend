import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Page imports
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import NotFoundPage from "./pages/NotFoundPage";
import CategoryPage from "./pages/CategoryPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage"; 
import ProductPage from "./pages/ProductPage";

// Component imports
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

// Admin pages
import AdminLayout from "./components/admin/Layout/AdminLayout";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import ProductsPage from "./pages/admin/ProductsPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import BrandsPage from "./pages/admin/BrandsPage";
import AdminRegister from "./pages/admin/AdminRegister";

// Component imports
import Navbar from "./components/navbar/Navbar";
import AnnouncementBar from "./components/AnnouncementBar";

// --- Admin Protected Route ---
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("adminAuth") === "true";
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

// --- ✅ NEW: User Protected Route (For Checkout) ---
const UserProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

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
      <ScrollToTop />
      <Routes>
        {/* Public Routes with Navbar and AnnouncementBar */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          
          {/* ✅ PROTECTED CHECKOUT ROUTE */}
          <Route 
            path="/checkout" 
            element={
              <UserProtectedRoute>
                <CheckoutPage />
              </UserProtectedRoute>
            } 
          />

          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />

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
          <Route path="register" element={<AdminRegister />} />
          
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