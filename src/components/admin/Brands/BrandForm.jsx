import React, { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Toggle = ({ label, enabled, setEnabled }) => (
  // ... (Toggle component is unchanged) ...
  <div className="flex items-center">
    <button
      type="button"
      onClick={() => setEnabled(!enabled)}
      className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
        enabled ? "bg-amber-600" : "bg-gray-200"
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


const BrandForm = ({ brandId, onSave, onCancel }) => {
  const isEditMode = Boolean(brandId);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showOnHomepage, setShowOnHomepage] = useState(false);
  const [logoBase64, setLogoBase64] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  
  // --- ✅ Step 1: Add newImageSelected flag ---
  const [newImageSelected, setNewImageSelected] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setError("");
    setSuccess(false);
    // --- ✅ Step 3: Reset flag on load ---
    setNewImageSelected(false);

    if (isEditMode) {
      fetch(`${API_BASE_URL}/brands/${brandId}/`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch brand');
          return res.json();
        })
        .then(data => {
          setName(data.name || "");
          setDescription(data.description || "");
          setShowOnHomepage(data.show_on_homepage || false);

          if (data.logo_base64) {
            // FIX: Always store the full Data URL in state
            const previewUrl = `data:image/jpeg;base64,${data.logo_base64}`;
            setLogoPreview(previewUrl);
            setLogoBase64(previewUrl); // Store the full URL
          }
        })
        .catch(err => {
          console.error("Fetch brand error:", err);
          setError(err.message);
        });
    } else {
      handleClear();
    }
  }, [brandId, isEditMode]);

  const handleClear = () => {
    setName("");
    setDescription("");
    setShowOnHomepage(false);
    setLogoBase64("");
    setLogoPreview("");
    setError("");
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
      setLogoPreview(base64String);
      setLogoBase64(base64String);
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
    if (!name) {
      setError("Brand name is required");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    // --- ✅ Step 2: Conditionally add logo_upload ---
    const payload = {
      name,
      description,
      show_on_homepage: showOnHomepage,
    };

    if (newImageSelected) {
      payload.logo_upload = logoBase64;
    }
    // --- End of change ---

    const url = isEditMode
      ? `${API_BASE_URL}/brands/${brandId}/`
      : `${API_BASE_URL}/brands/`;
    
    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Failed to save brand");
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
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... (handleDelete is unchanged) ...
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this brand?")) {
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const resp = await fetch(`${API_BASE_URL}/brands/${brandId}/`, {
        method: 'DELETE',
      });
      if (!resp.ok) throw new Error('Failed to delete brand');
      if (onSave) onSave();
      if (onCancel) onCancel();
    } catch (error) {
      console.error("Delete error:", error);
      setError(error.message);
      setIsSubmitting(false);
    }
  };


  return (
    <div className="w-full">
      {/* ... (Header, Success/Error Messages are unchanged) ... */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {isEditMode ? 'Edit Brand' : 'Add New Brand'}
      </h2>
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-800 font-medium">Brand {isEditMode ? 'updated' : 'added'} successfully!</span>
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="text-red-800 font-medium">{error}</span>
        </div>
      )}

      {/* Form Fields Grid (3-column) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* ... (Name input is unchanged) ... */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Brand Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter brand name"
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all outline-none"
          />
        </div>
        
        {/* --- Image Upload --- */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Logo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
          />
        </div>

        {/* ... (Description is unchanged) ... */}
        <div className="md:col-span-full lg:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Enter brand description..."
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all outline-none resize-none"
          />
        </div>

        {/* --- Status & Preview --- */}
        <div className="md:col-span-full lg:col-span-1">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Status & Preview
          </label>
          <div className="flex flex-col space-y-3">
            <Toggle
              label="Show on Homepage"
              enabled={showOnHomepage}
              setEnabled={setShowOnHomepage}
            />
            {/* --- Image Preview --- */}
            {logoPreview && (
              <div className="relative w-48 h-48 border-2 border-gray-200 rounded-lg overflow-hidden mt-2">
                <img 
                  src={logoPreview} 
                  alt="Preview" 
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setLogoPreview("");
                    setLogoBase64("");
                    setNewImageSelected(true); // Clearing is a "new" choice
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ... (Action Buttons are unchanged) ... */}
      <div className="flex gap-4 pt-8 mt-8 border-t-2 border-gray-100">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-orange-700 focus:ring-4 focus:ring-amber-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {isSubmitting ? "Saving..." : isEditMode ? 'Update Brand' : 'Add Brand'}
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
            disabled={isSubmitting}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default BrandForm;