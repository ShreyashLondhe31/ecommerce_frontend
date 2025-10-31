import React from "react";
// 1. Import routing components and your pages
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import Navbar from "./components/navbar/Navbar";
import AnnouncementBar from "./components/AnnouncementBar";
import NotFoundPage from "./pages/NotFoundPage";
import CategoryPage from "./pages/CategoryPage";

function App() {
  return (
    <div className="App h-screen w-full overflow-x-hidden">
      {/* 1. Add the AnnouncementBar so it's visible on every page */}
      <AnnouncementBar />
      {/* 2. Add the Navbar so it's visible on every page */}
      <Navbar />

      {/* 3. Define the routes */}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          {/* You can add a 404 Not Found route here too */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
