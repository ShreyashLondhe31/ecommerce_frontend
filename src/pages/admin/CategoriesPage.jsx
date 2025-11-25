import React, { useEffect, useState, useRef } from "react";
import CategoryForm from "../../components/admin/Categories/CategoryForm"; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showPopularOnly, setShowPopularOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const scrollContainerRef = useRef(null);

  const fetchCategories = () => {
    // First, always fetch ALL categories to build the complete parent map
    fetch(`${API_BASE_URL}/categories/?show_all=true`)
      .then((res) => res.json())
      .then((allCategories) => {
        // Build a complete map of all categories (for parent name lookup)
        const categoryMap = allCategories.reduce((acc, cat) => {
          acc[cat.id] = cat.name;
          return acc;
        }, {});
        
        // Now fetch filtered categories
        const params = new URLSearchParams();
        params.append('show_all', 'true');
        
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        
        if (selectedStatus !== 'all') {
          params.append('is_active', selectedStatus === 'active' ? 'true' : 'false');
        }
        
        if (showPopularOnly) {
          params.append('is_popular', 'true');
        }

        fetch(`${API_BASE_URL}/categories/?${params.toString()}`)
          .then((res) => res.json())
          .then((filteredData) => {
            // Map filtered categories with parent names from the complete map
            const categoriesWithParent = filteredData.map(cat => ({
              ...cat,
              parentName: cat.parent ? categoryMap[cat.parent] || "Unknown" : "---"
            }));
            setCategories(categoriesWithParent);
          })
          .catch((err) => console.error("Error fetching filtered categories:", err));
      })
      .catch((err) => console.error("Error fetching all categories:", err));
  };

  useEffect(() => {
    fetchCategories();
  }, [searchQuery, selectedStatus, showPopularOnly]); // Re-fetch when filters change

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  const handleFormSuccess = () => {
    fetchCategories();
    setShowForm(false);
    setEditingCategoryId(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCategoryId(null);
  };

  const handleAddNew = () => {
    setEditingCategoryId(null);
    setShowForm(true);
    scrollToTop();
  };

  const handleEdit = (categoryId) => {
    setEditingCategoryId(categoryId);
    setShowForm(true);
    scrollToTop();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("all");
    setShowPopularOnly(false);
  };

  // FIXED: Helper function to get category image source
  const getCategoryImage = (category) => {
    if (!category.image_base64) {
      return "https://via.placeholder.com/60x60?text=No+Image";
    }
    
    // If it's already a full data URL (starts with data:), return as is
    if (category.image_base64.startsWith('data:')) {
      return category.image_base64;
    }
    
    // If it's a regular URL (http/https), return as is (backward compatibility)
    if (category.image_base64.startsWith('http')) {
      return category.image_base64;
    }
    
    // Otherwise, it's base64 data, so add the data URL prefix
    return `data:image/jpeg;base64,${category.image_base64}`;
  };

  const hasActiveFilters = searchQuery || selectedStatus !== 'all' || showPopularOnly;

  return (
    <div ref={scrollContainerRef} className="fixed inset-0 top-[60px] overflow-auto bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-6 bg-white border-b sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {showFilters ? "Hide Filters" : "Show Filters"}
            {hasActiveFilters && (
              <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </button>
          <button
            onClick={showForm ? handleFormCancel : handleAddNew}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {showForm ? "Cancel" : "Add New Category"}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white shadow px-8 py-6 border-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>

            {/* Popular Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Popularity
              </label>
              <label className="flex items-center px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={showPopularOnly}
                  onChange={(e) => setShowPopularOnly(e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700">Show Popular Only</span>
              </label>
            </div>
          </div>

          {/* Clear Filters Button */}
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

      {/* Form Container */}
      {showForm && (
        <div className="bg-white shadow px-8 py-6 border-b">
          <CategoryForm
            categoryId={editingCategoryId}
            onSave={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      {/* List Container */}
      <div className="bg-white shadow">
        {/* Results Count */}
        <div className="px-8 py-3 bg-gray-50 border-b">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{categories.length}</span> categor{categories.length !== 1 ? 'ies' : 'y'}
            {hasActiveFilters && <span className="text-amber-600"> (filtered)</span>}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name (Arabic)</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <tr 
                    key={cat.id} 
                    className={`hover:bg-gray-50 transition-colors ${!cat.is_active ? "bg-gray-100 opacity-60" : ""}`}
                  >
                    <td className="px-8 py-4">
                      <img 
                        src={getCategoryImage(cat)} 
                        alt={cat.name} 
                        className="h-10 w-10 object-contain rounded" 
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cat.name}
                      {cat.is_popular && (
                        <span className="block text-xs font-medium text-amber-600 mt-1">
                          ⭐ Popular
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.name_ar}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.parentName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.slug}</td>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          cat.is_active ? "bg-green-100 text-green-800" : "bg-gray-500 text-white"
                        }`}>
                        {cat.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleEdit(cat.id)} 
                        className="text-blue-600 hover:text-blue-900 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                    {hasActiveFilters ? (
                      <div>
                        <p className="text-lg font-medium mb-2">No categories found</p>
                        <p className="text-sm">Try adjusting your filters or search query</p>
                      </div>
                    ) : (
                      "No categories found"
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

export default CategoriesPage;