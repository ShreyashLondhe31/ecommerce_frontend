import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCartStore } from "../../store/cartStore"; // Adjust path to your store

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- Image Helper (Same as ProductPage.jsx) ---
const getPrimaryImageSrc = (product) => {
  const placeholder = "https://via.placeholder.com/400x400?text=No+Image";
  if (!product || !product.images || product.images.length === 0) {
    return placeholder;
  }
  
  const primary = product.images.find(img => img.is_primary) || product.images[0];
  if (!primary) return placeholder;

  if (primary.image_base64) {
    return `data:image/png;base64,${primary.image_base64}`;
  }
  if (primary.image_url) {
    return primary.image_url;
  }
  
  return placeholder;
};

const HomeSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // Search Logic with Debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length > 0) {
        setLoading(true);
        axios
          .get(`${API_BASE_URL}/products/?search=${query}`)
          .then((res) => {
            setResults(res.data);
            setLoading(false);
          })
          .catch((err) => {
            console.error("Search Error:", err);
            setLoading(false);
          });
      } else {
        setResults([]);
      }
    }, 500); // Wait 500ms after typing stops

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleAddToCart = (e, product) => {
    e.preventDefault(); // Prevent navigation if clicking the add button
    e.stopPropagation();

    if (product.stock_quantity > 0) {
      const cartItem = {
        id: product.id,
        name: product.name,
        sale_price: product.sale_price,
        price: product.sale_price, // Normalize for cart logic
        product_barcode: product.product_barcode,
        image: getPrimaryImageSrc(product),
        stock_quantity: product.stock_quantity,
        quantity: 1, // Default to 1 for quick add
      };
      addItem(cartItem);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      {/* Search Input Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-300 focus:ring focus:ring-blue-200 sm:text-sm transition duration-150 ease-in-out shadow-sm"
          placeholder="Search for products, brands, or categories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>

      {/* Search Results Grid */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="block transition-transform hover:-translate-y-1"
            >
              {/* CARD DESIGN: 
                  Copied structure from SidebarCart.jsx 
                  (bg-gray-50, rounded-lg, border-gray-200)
              */}
              <div className="relative bg-gray-50 rounded-lg p-3 border border-gray-200 flex gap-3 items-center h-full shadow-sm hover:shadow-md transition-shadow">
                
                {/* Image */}
                <img
                  src={getPrimaryImageSrc(product)}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded flex-shrink-0 border border-gray-200 bg-white"
                />

                {/* Info Column */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                    {product.name}
                  </h3>
                  {product.product_barcode && (
                    <p className="text-xs text-gray-500 mb-1">
                      SKU: {product.product_barcode}
                    </p>
                  )}
                  <p className="text-sm font-bold text-gray-900">
                     KD {parseFloat(product.sale_price).toFixed(3)}
                  </p>
                </div>

                {/* Action Button (Add to Cart) */}
                <div className="flex flex-col justify-center pl-2">
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={product.stock_quantity === 0}
                    className={`p-2 rounded-full transition-colors ${
                      product.stock_quantity > 0
                        ? "bg-gray-900 text-white hover:bg-gray-700"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                    title={product.stock_quantity > 0 ? "Add to Cart" : "Out of Stock"}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {!loading && query.length > 0 && results.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No products found for "{query}"
        </div>
      )}
    </div>
  );
};

export default HomeSearch;