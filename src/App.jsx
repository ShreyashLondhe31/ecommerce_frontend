import React from "react";
import { Routes, Route } from "react-router-dom";

// Page imports
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import NotFoundPage from "./pages/NotFoundPage";
import CategoryPage from "./pages/CategoryPage";

// Component imports
import Navbar from "./components/navbar/Navbar";
import AnnouncementBar from "./components/AnnouncementBar";

function App() {
  return (
    <div className="App min-h-screen w-full overflow-x-hidden">
      <AnnouncementBar />
      <Navbar />
      
      <main className="relative">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
