import React, { useEffect, useState, useRef } from "react";
import BrandForm from "../../components/admin/Brands/BrandForm"; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBrandId, setEditingBrandId] = useState(null);
  
  // --- 1. Filter state (Removed showFilters) ---
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnHomepageFilter, setShowOnHomepageFilter] = useState(""); // "" (Any), "true", "false"
  
  const scrollContainerRef = useRef(null);

  // --- 2. fetchBrands now includes filter logic ---
  const fetchBrands = () => {
    const params = new URLSearchParams();
    
    if (searchQuery) {
      params.append('search', searchQuery);
    }
    if (showOnHomepageFilter) {
      params.append('show_on_homepage', showOnHomepageFilter);
    }

    const url = `${API_BASE_URL}brands/${params.toString() ? '?' + params.toString() : ''}`;
    
    fetch(url)
      .then((res) => res.json())
      .then((data) => setBrands(data))
      .catch((err) => console.error("Error fetching brands:", err));
  };

  // --- 3. useEffect now re-fetches when filters change ---
  useEffect(() => {
    fetchBrands();
  }, [searchQuery, showOnHomepageFilter]); 

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  const handleFormSuccess = () => {
    fetchBrands(); 
    setShowForm(false);
    setEditingBrandId(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingBrandId(null);
  };

  const handleAddNew = () => {
    setEditingBrandId(null); 
    setShowForm(true);
    scrollToTop(); 
  };

  const handleEdit = (brandId) => {
    setEditingBrandId(brandId); 
    setShowForm(true);
    scrollToTop(); 
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setShowOnHomepageFilter("");
  };

  // FIXED: Helper function to get logo image source
  const getBrandLogo = (brand) => {
    if (!brand.logo_base64) {
      return "https://via.placeholder.com/60x60?text=No+Logo";
    }
    
    if (brand.logo_base64.startsWith('data:')) {
      return brand.logo_base64;
    }
    
    if (brand.logo_base64.startsWith('http')) {
      return brand.logo_base64;
    }
    
    return `data:image/jpeg;base64,${brand.logo_base64}`;
  };

  const hasActiveFilters = searchQuery || showOnHomepageFilter;

  return (
    <div ref={scrollContainerRef} className="fixed inset-0 top-[60px] overflow-auto bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-6 bg-white border-b sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-800">Brands</h1>
        
        <div className="flex items-center gap-4">
          <button
            onClick={showForm ? handleFormCancel : handleAddNew}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            {showForm ? "Cancel" : "Add New Brand"}
          </button>
        </div>
      </div>

      {/* --- 5. Search Panel (Permanently Visible) --- */}
      <div className="bg-white shadow px-8 py-6 border-b">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* Search Input */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Brands
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand name or description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Homepage Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Show on Homepage
            </label>
            <select
              value={showOnHomepageFilter}
              onChange={(e) => setShowOnHomepageFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
            >
              <option value="">Any</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          {/* Clear Button */}
          {hasActiveFilters && (
            <div className="md:col-span-3">
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
      </div>

      {/* --- 6. Form Container --- */}
      {showForm && (
        <div className="bg-white shadow px-8 py-6 border-b">
          <BrandForm
            brandId={editingBrandId}
            onSave={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      {/* --- 7. List Container --- */}
      <div className="bg-white shadow">
        <div className="px-8 py-3 bg-gray-50 border-b border-gray-200">
          <span className="text-sm font-semibold text-gray-600">
            Showing {brands.length} {brands.length === 1 ? 'brand' : 'brands'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Homepage</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {brands.length > 0 ? (
                brands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-4">
                      <img
                        src={getBrandLogo(brand)}
                        alt={brand.name}
                        className="h-10 w-10 object-contain rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {brand.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-sm truncate">
                      {brand.description || "No description"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {brand.show_on_homepage ? (
                        <span className="text-green-600 font-semibold">Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(brand.id)}
                        className="text-blue-600 hover:text-blue-900 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    No brands found
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

export default BrandsPage;