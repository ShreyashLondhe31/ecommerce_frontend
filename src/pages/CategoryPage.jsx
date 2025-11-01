import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { allProducts } from "../data/products";
import { useCartStore } from "../store/cartStore";
import { FaInfoCircle } from "react-icons/fa";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const { addItem } = useCartStore();
  const [hoveredInfoId, setHoveredInfoId] = useState(null);

  const formattedCategoryName = categoryName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const filteredProducts = allProducts.filter(
    (product) => product.category === formattedCategoryName
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-2">
        Category:{" "}
        <span className="text-amber-500">{formattedCategoryName}</span>
      </h1>
      <p className="text-gray-600 mb-8">
        Showing {filteredProducts.length} results.
      </p>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            // --- 1. REMOVED 'overflow-hidden' from this div ---
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md flex flex-col relative"
            >
              {/* Image Container */}
              <div className="relative group">
                <img
                  src={product.image}
                  alt={product.name}
                  // Added rounded-t-lg because overflow-hidden is gone
                  className="w-full h-36 sm:h-48 object-cover rounded-t-lg"
                />
                {/* Info Icon */}
                <div
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white
                             cursor-pointer opacity-0 group-hover:opacity-100
                             transition-opacity duration-300 hidden md:block"
                  onMouseEnter={() => setHoveredInfoId(product.id)}
                  onMouseLeave={() => setHoveredInfoId(null)}
                >
                  <FaInfoCircle size={20} />
                </div>
              </div>

              {/* Product Details */}
              <div className="p-3 sm:p-4 flex flex-col flex-1">
                <h2 className="text-sm sm:text-lg font-semibold text-gray-800 truncate">
                  {product.name}
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  {product.category}
                </p>
                <div className="flex justify-between items-center mt-auto pt-3">
                  <span className="text-base sm:text-xl font-bold text-amber-600">
                    {product.price.toFixed(3)} د.ك
                  </span>
                  <button
                    onClick={() => addItem(product)}
                    className="p-2 sm:px-4 sm:py-2 bg-amber-500 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Information Pop-up Div */}
              <div
                className={`absolute left-full top-0 ml-2 z-10
                            w-64 h-24 bg-gray-800 text-white p-3 rounded-md shadow-lg
                            transition-opacity duration-300 ease-in-out
                            hidden md:flex flex-col justify-center
                            ${
                              hoveredInfoId === product.id
                                ? "opacity-100"
                                : "opacity-0 pointer-events-none"
                            }`}
                onMouseEnter={() => setHoveredInfoId(product.id)}
                onMouseLeave={() => setHoveredInfoId(null)}
              >
                <h3 className="text-sm font-bold mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-300 line-clamp-3">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam.
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // ... (No products found section remains the same)
        <div className="text-center py-16">
          <p className="text-xl text-gray-700">
            No products found in this category.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block text-amber-500 hover:underline"
          >
            &larr; Back to all categories
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
