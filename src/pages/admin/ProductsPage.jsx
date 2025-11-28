import React, { useState, useEffect, useRef } from "react";
// UPDATED: Changed to relative path. Assumes ProductForm is in the same directory.
import ProductForm from "../../components/admin/Products/ProductForm";

// UPDATED: Safe access for import.meta.env to prevent build warnings/errors in some environments
const API_BASE_URL = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL) || "https://your-api-url.com/";

// STUB: Placeholder component since the source for ProductAttributesForm was not provided.
const ProductAttributesForm = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Attributes Form</h3>
      <p className="text-gray-600 mb-4">The ProductAttributesForm component source was not found. This is a placeholder.</p>
      <button 
        onClick={onClose}
        className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
      >
        Close
      </button>
    </div>
  </div>
);

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [showAttributesForm, setShowAttributesForm] = useState(false);
  const [attributesProductId, setAttributesProductId] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  
  const scrollContainerRef = useRef(null);

  const fetchProducts = () => {
    // Build query parameters
    const params = new URLSearchParams();
    params.append('show_all', 'true');
    
    if (searchQuery) {
      params.append('search', searchQuery);
    }
    if (selectedCategory) {
      params.append('category', selectedCategory);
    }
    if (selectedBrand) {
      params.append('brand', selectedBrand);
    }
    if (selectedStatus !== 'all') {
      params.append('is_active', selectedStatus === 'active' ? 'true' : 'false');
    }

    fetch(`${API_BASE_URL}products/?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  };

  const fetchCategories = () => {
    fetch(`${API_BASE_URL}categories/?show_all=true`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  };

  const fetchBrands = () => {
    fetch(`${API_BASE_URL}brands/`)
      .then((res) => res.json())
      .then((data) => setBrands(data))
      .catch((err) => console.error("Error fetching brands:", err));
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory, selectedBrand, selectedStatus]);

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  const handleFormSuccess = () => {
    fetchProducts();
    setShowForm(false);
    setEditingProductId(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProductId(null);
  };

  const handleAddNew = () => {
    setEditingProductId(null);
    setShowForm(true);
    scrollToTop();
  };

  const handleEdit = (productId) => {
    setEditingProductId(productId);
    setShowForm(true);
    scrollToTop();
  };

  const handleManageAttributes = (productId) => {
    setAttributesProductId(productId);
    setShowAttributesForm(true);
  };

  const handleCloseAttributesForm = () => {
    setShowAttributesForm(false);
    setAttributesProductId(null);
  };

  const handleAttributesSaveSuccess = () => {
    fetchProducts();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedStatus("all");
  };

  const getPrimaryImage = (product) => {
    if (!product.images || product.images.length === 0) {
      return "https://via.placeholder.com/60x60?text=No+Image";
    }
    const primary = product.images.find(img => img.is_primary);
    const imageData = primary ? primary.image_base64 : product.images[0].image_base64;
    
    if (!imageData) {
      return "https://via.placeholder.com/60x60?text=No+Image";
    }
    
    if (imageData.startsWith('data:')) {
      return imageData;
    }
    
    if (imageData.startsWith('http')) {
      return imageData;
    }
    
    return `data:image/jpeg;base64,${imageData}`;
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedBrand || selectedStatus !== 'all';

  return (
    <div ref={scrollContainerRef} className="fixed inset-0 top-[60px] overflow-auto bg-gray-50">
      <div className="flex justify-between items-center px-8 py-6 bg-white border-b sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <div className="flex gap-3">
          <button
            onClick={showForm ? handleFormCancel : handleAddNew}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            {showForm ? "Cancel" : "Add New Product"}
          </button>
        </div>
      </div>

      {/* Filter Panel (Hidden when editing) */}
      {!showForm && (
        <div className="bg-white shadow px-8 py-6 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, categories, brands..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="bg-white shadow px-8 py-6 border-b">
          <ProductForm
            productId={editingProductId}
            onSave={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      {showAttributesForm && (
        <ProductAttributesForm
          productId={attributesProductId}
          onClose={handleCloseAttributesForm}
          onSaveSuccess={handleAttributesSaveSuccess}
        />
      )}

      <div className="bg-white shadow">
        {/* Results Count */}
        <div className="px-8 py-3 bg-gray-50 border-b">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{products.length}</span> product{products.length !== 1 ? 's' : ''}
            {hasActiveFilters && <span className="text-amber-600"> (filtered)</span>}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attributes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <tr 
                    key={product.id} 
                    className={`hover:bg-gray-50 transition-colors ${!product.is_active ? "bg-gray-100 opacity-60" : ""}`}
                  >
                    <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={getPrimaryImage(product)} alt={product.name} className="h-12 w-12 object-cover rounded" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                      <div className="flex gap-2 mt-1">
                        {product.is_featured && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Featured
                          </span>
                        )}
                        {product.is_best_seller && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            Best Seller
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category_detail?.name || "Uncategorized"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-amber-600">
                      د.ك {product.sale_price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.stock_quantity || 0}
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-500 text-white"
                        }`}
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleManageAttributes(product.id)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors"
                        title="Manage attributes"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                        <span className="font-medium">
                          {product.attributes?.length || 0}
                        </span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleEdit(product.id)} 
                        className="text-blue-600 hover:text-blue-900 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-10 text-center text-gray-500">
                    {hasActiveFilters ? (
                      <div>
                        <p className="text-lg font-medium mb-2">No products found</p>
                        <p className="text-sm">Try adjusting your filters or search query</p>
                      </div>
                    ) : (
                      "No products found"
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;