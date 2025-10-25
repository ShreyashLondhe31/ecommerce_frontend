import React from "react";
import { useParams, Link } from "react-router-dom";
import { allProducts } from "../data/products";
// 1. Import the cart store
import { useCartStore } from "../store/cartStore";

const CategoryPage = () => {
  const { categoryName } = useParams();
  // 2. Get the addItem action from the store
  const { addItem } = useCartStore();

  const formattedCategoryName = categoryName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const filteredProducts = allProducts.filter(
    (product) => product.category === formattedCategoryName
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">
        Category:{" "}
        <span className="text-amber-500">{formattedCategoryName}</span>
      </h1>
      <p className="text-gray-600 mb-8">
        Showing {filteredProducts.length} results.
      </p>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {product.name}
                </h2>
                <p className="text-gray-500 text-sm mt-1">{product.category}</p>
                <div className="flex justify-between items-center mt-auto pt-4">
                  <span className="text-xl font-bold text-amber-600">
                    {product.price.toFixed(3)} KD
                  </span>
                  {/* 3. Add onClick handler to call the addItem action */}
                  <button
                    onClick={() => addItem(product)}
                    className="px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // ... (no changes to the "not found" part)
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
