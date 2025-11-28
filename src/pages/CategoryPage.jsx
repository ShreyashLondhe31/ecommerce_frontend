import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { Check } from "lucide-react"; 
import axios from "axios";
import SidebarCart from "../components/sidebarcart/SidebarCart";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- IMAGE HELPER FUNCTIONS ---
const getCategorySrc = (category) => {
  if (category?.image_base64) {
    return `data:image/png;base64,${category.image_base64}`;
  }
  return category?.image_url || "https://via.placeholder.com/150?text=No+Image";
};

const getPrimaryImageSrc = (product) => {
  const placeholder = "https://via.placeholder.com/150";
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

const CategoryPage = () => {
  const { categoryName } = useParams(); // This will be undefined at /category
  const { addItem } = useCartStore();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Check if we are viewing a specific category or the main page
  const isSpecificCategory = Boolean(categoryName);

  const formattedCategoryName = categoryName
    ? categoryName
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "All Products";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get(`${API_BASE_URL}categories/`),
          axios.get(`${API_BASE_URL}products/`),
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // LOGIC UPDATE: If specific category, filter. If not, show all products.
  const filteredProducts = isSpecificCategory
    ? products.filter(
        (p) =>
          p.category_detail?.name?.toLowerCase() ===
          formattedCategoryName.toLowerCase()
      )
    : products;

  const displayedCategories = showAllCategories
    ? categories
    : categories.slice(0, 12);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const imageSrc = getPrimaryImageSrc(product);
    const cartItem = { ...product, image: imageSrc };
    addItem(cartItem);
    setIsCartOpen(true);
  };

  return (
    <>
      <SidebarCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      <div className={`min-h-screen transition-opacity duration-300 ${isCartOpen ? 'opacity-40' : ''}`}>
        
        {/* Category List Section */}
        <div className="bg-white py-10 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="h-[1px] w-16 bg-amber-500"></div>
                <h1 className="text-3xl md:text-4xl font-semibold text-center">
                  Product Categories
                </h1>
                <div className="h-[1px] w-16 bg-amber-500"></div>
              </div>
            </div>

            <div className="category-grid-container w-full max-w-7xl mx-auto">
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
                  {displayedCategories.map((category, idx) => {
                    const categoryNameSafe = category.name || "Unnamed";
                    const categorySlug = categoryNameSafe
                      .toLowerCase()
                      .replace(/ /g, "-");
                    
                    const imageSrc = getCategorySrc(category);

                    return (
                      <Link
                        to={`/category/${categorySlug}`}
                        key={category.id || idx}
                        className="category-card bg-white rounded-lg border border-gray-200
                                  shadow-md p-2 md:p-4 flex flex-col items-center justify-between
                                  transform hover:scale-105 hover:shadow-xl hover:border-amber-300
                                  transition-all duration-300 h-32 md:h-44"
                      >
                        <div className="w-full h-20 md:h-28 flex items-center justify-center mb-1 md:mb-2">
                          <img
                            className="object-contain w-full h-full"
                            src={imageSrc}
                            alt={categoryNameSafe}
                          />
                        </div>
                        <h3 className="text-[10px] md:text-sm font-medium text-center text-gray-800 leading-tight line-clamp-2">
                          {categoryNameSafe}
                        </h3>
                      </Link>
                    );
                  })}
                </div>

                {!showAllCategories && categories.length > 12 && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={() => setShowAllCategories(true)}
                      className="px-8 py-3 bg-amber-500 text-white font-semibold 
                                 rounded-lg hover:bg-amber-600 transition-colors duration-300
                                 shadow-md hover:shadow-lg"
                    >
                      View All Categories
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="container mx-auto px-4 py-8">
          {/* Dynamic Title based on route */}
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">
            {isSpecificCategory ? (
               <>Category: <span className="text-amber-500">{formattedCategoryName}</span></>
            ) : (
               <span className="text-amber-500">All Products</span>
            )}
          </h2>
          
          <p className="text-gray-600 mb-8">
            Showing {filteredProducts.length} results.
          </p>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {filteredProducts.map((product) => (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  className="block group"
                >
                  <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-lg transition-shadow h-full flex flex-col">
                    
                    <div className="relative w-full aspect-[4/5] mb-2 flex items-center justify-center bg-white">
                      <img
                        src={getPrimaryImageSrc(product)}
                        alt={product.name}
                        className="object-contain w-full h-full"
                      />
                    </div>

                    <div className="flex flex-col flex-1">
                      <h3 className="text-sm font-medium text-gray-900 leading-tight mb-1 line-clamp-2 group-hover:text-green-700 transition-colors">
                        {product.name}
                      </h3>
                      
                      <p className="text-[10px] md:text-xs text-gray-500 mb-1 line-clamp-1">
                         {product.category_detail?.name || "General"}
                      </p>

                      {product.stock_quantity > 0 ? (
                        <div className="flex items-center gap-1 text-green-700 text-[10px] md:text-xs font-medium mb-1">
                          <Check size={12} /> In stock
                        </div>
                      ) : (
                         <div className="flex items-center gap-1 text-red-600 text-[10px] md:text-xs font-medium mb-1">
                          Out of stock
                         </div>
                      )}

                      <div className="text-green-700 font-bold text-sm md:text-base mb-2">
                         KD {parseFloat(product.sale_price).toFixed(3)}
                      </div>
                    </div>

                    <div className="mt-auto">
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={product.stock_quantity === 0}
                        className={`w-full py-2 rounded font-bold text-[10px] md:text-xs tracking-wide transition-colors ${
                           product.stock_quantity > 0
                             ? "bg-[#5cae6e] hover:bg-[#4d945d] text-white shadow-sm"
                             : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {product.stock_quantity > 0 ? "ADD TO CART" : "OUT OF STOCK"}
                      </button>
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-700">
                No products found.
              </p>
              {isSpecificCategory && (
                <Link
                  to="/category"
                  className="mt-4 inline-block text-amber-500 hover:underline"
                >
                  &larr; View all products
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryPage;