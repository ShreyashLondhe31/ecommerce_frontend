import React, { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CategoryForm = ({ categoryId, onSave, onCancel }) => {
  const isEditMode = Boolean(categoryId);

  const [formData, setFormData] = useState({
    name: "",
    name_ar: "",
    slug: "",
    parent: "",
    is_popular: false,
    is_active: true,
  });
  
  const [imageBase64, setImageBase64] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  
  // --- ✅ Step 1: Add newImageSelected flag ---
  const [newImageSelected, setNewImageSelected] = useState(false);

  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch all categories
  useEffect(() => {
    fetch(`${API_BASE_URL}categories/`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Fetch category for edit mode
  useEffect(() => {
    setError(null);
    setSuccess(false);
    
    // --- ✅ Step 3: Reset flag on load ---
    setNewImageSelected(false);

    if (isEditMode) {
      fetch(`${API_BASE_URL}categories/${categoryId}/`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch category");
          return res.json();
        })
        .then((data) => {
          setFormData({
            name: data.name || "",
            name_ar: data.name_ar || "",
            slug: data.slug || "",
            parent: data.parent || "",
            is_popular: data.is_popular || false,
            is_active: data.is_active || true,
          });
          
          if (data.image_base64) {
            // FIX: Always store the full Data URL in state for consistency
            const previewUrl = `data:image/jpeg;base64,${data.image_base64}`;
            setImagePreview(previewUrl);
            setImageBase64(previewUrl); // Store the full URL
          }
        })
        .catch((err) => {
          console.error("Fetch category error:", err);
          setError(err.message);
        });
    } else {
      handleClear();
    }
  }, [categoryId, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError(null);
  };

  const handleClear = () => {
    setFormData({
      name: "",
      name_ar: "",
      slug: "",
      parent: "",
      is_popular: false,
      is_active: true,
    });
    setImageBase64("");
    setImagePreview("");
    setError(null);
    setSuccess(false);
    // --- ✅ Step 3: Reset flag on clear ---
    setNewImageSelected(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // ... (validations are unchanged)
    if (!file.type.startsWith('image/')) {
      setError("Please upload a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setImagePreview(base64String);
      setImageBase64(base64String);
      setError(null);
      // --- ✅ Step 2: Set flag on new upload ---
      setNewImageSelected(true);
    };
    reader.onerror = () => {
      setError("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = async () => {
    if (!formData.name || !formData.slug) {
      setError("Name and Slug are required fields");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    // --- ✅ Step 2: Conditionally add image_upload ---
    const payload = {
      ...formData,
      parent: formData.parent ? formData.parent : null,
    };
    
    if (newImageSelected) {
      payload.image_upload = imageBase64;
    }
    // --- End of change ---

    const url = isEditMode
      ? `${API_BASE_URL}categories/${categoryId}/`
      : `${API_BASE_URL}categories/`;

    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Status ${response.status}: ${errorText}`);
      }

      setSuccess(true);
      if (onSave) onSave();
      if (!isEditMode) {
        handleClear(); // This already resets the flag
      } else {
        // --- ✅ Step 3: Reset flag after successful edit ---
        setNewImageSelected(false);
      }
      setTimeout(() => setSuccess(false), 3000);
    } catch (err)
      {
      console.error("Category create error:", err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ... (handleDelete and Toggle component are unchanged) ...
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    setSubmitting(true);
    setError(null);
    try {
      const resp = await fetch(`${API_BASE_URL}categories/${categoryId}/`, {
        method: "DELETE",
      });
      if (!resp.ok) throw new Error("Failed to delete category");
      if (onSave) onSave();
      if (onCancel) onCancel();
    } catch (error) {
      console.error("Delete error:", error);
      setError(error.message);
      setSubmitting(false);
    }
  };

  const Toggle = ({ label, enabled, setEnabled }) => (
    <div className="flex items-center">
      <button
        type="button"
        onClick={() => setEnabled(!enabled)}
        className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
          enabled ? "bg-purple-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
      <span className="ml-3 text-sm font-medium text-gray-700">{label}</span>
    </div>
  );

  return (
    <div className="w-full max-w-none px-0">
      {/* ... (Header, Success/Error Messages are unchanged) ... */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {isEditMode ? "Edit Category" : "Add New Category"}
      </h2>
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-green-800 font-medium">
            Category {isEditMode ? "updated" : "added"} successfully!
          </span>
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span className="text-red-800 font-medium">{error}</span>
        </div>
      )}

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* ... (Form inputs are unchanged) ... */}
        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter category name"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="category-slug"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Arabic Name
            </label>
            <input
              type="text"
              name="name_ar"
              value={formData.name_ar}
              onChange={handleChange}
              placeholder="أدخل الاسم بالعربية"
              dir="rtl"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Parent Category
            </label>
            <select
              name="parent"
              value={formData.parent}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all outline-none bg-white"
            >
              <option value="">No parent (top level)</option>
              {categories.map(
                (cat) =>
                  cat.id !== categoryId && (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  )
              )}
            </select>
          </div>
        </div>
        
        {/* --- Image Upload --- */}
        <div className="md:col-span-full">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
        </div>

        {/* --- Image Preview --- */}
        {imagePreview && (
          <div className="relative w-48 h-48 border-2 border-gray-200 rounded-lg overflow-hidden">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full h-full object-contain"
            />
            <button
              type="button"
              onClick={() => {
                setImagePreview("");
                setImageBase64("");
                setNewImageSelected(true); // Clearing is also a "new" choice
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* ... (Toggles and Action Buttons are unchanged) ... */}
        <div className="md:col-span-full">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Category Status
          </label>
          <div className="flex flex-col sm:flex-row sm:space-x-8 space-y-3 sm:space-y-0">
            <Toggle
              label="Active"
              enabled={formData.is_active}
              setEnabled={(val) =>
                setFormData((f) => ({ ...f, is_active: val }))
              }
            />
            <Toggle
              label="Popular"
              enabled={formData.is_popular}
              setEnabled={(val) =>
                setFormData((f) => ({ ...f, is_popular: val }))
              }
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-8 mt-8 border-t-2 border-gray-100">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:ring-4 focus:ring-purple-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {submitting ? "Saving..." : isEditMode ? "Update Category" : "Add Category"}
        </button>

        <button
          onClick={onCancel}
          className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 transition-all border-2 border-gray-300"
        >
          Cancel
        </button>

        {isEditMode && (
          <button
            onClick={handleDelete}
            disabled={submitting}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryForm;