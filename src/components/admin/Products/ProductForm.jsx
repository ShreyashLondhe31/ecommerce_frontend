import React, { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProductForm = ({ productId, onSave, onCancel }) => {
  const isEditMode = Boolean(productId);

  // --- States for Product model fields ---
  const [name, setName] = useState("");
  const [productBarcode, setProductBarcode] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState(0);
  const [weight, setWeight] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);

  // --- States for related models (FKs) ---
  const [imageBase64, setImageBase64] = useState(""); // For storing base64
  const [imagePreview, setImagePreview] = useState(""); // For preview
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  
  // --- ✅ Step 1: Add newImageSelected flag ---
  const [newImageSelected, setNewImageSelected] = useState(false);

  // --- States for UI and data loading ---
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(false);

  // --- Fetch Categories and Brands ---
  useEffect(() => {
    fetch(`${API_BASE_URL}/categories/`).then(r => r.json()).then(setCategories).catch(console.error);
    fetch(`${API_BASE_URL}/brands/`).then(r => r.json()).then(setBrands).catch(console.error);
  }, []);

  // --- 'useEffect' to READ product data when in Edit Mode ---
  useEffect(() => {
    setSuccess(false);
    setErr(null);
    // --- ✅ Step 3: Reset flag on load ---
    setNewImageSelected(false);

    if (isEditMode) {
      fetch(`${API_BASE_URL}/products/${productId}/`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch product');
          return res.json();
        })
        .then(data => {
          // ... (setting all form data)
          setName(data.name);
          setNameAr(data.name_ar || "");
          setProductBarcode(data.product_barcode);
          setDescription(data.description || "");
          setDescriptionAr(data.description_ar || "");
          setSalePrice(data.sale_price);
          setStockQuantity(data.stock_quantity || 0);
          setWeight(data.weight || 0);
          setIsActive(data.is_active);
          setIsFeatured(data.is_featured);
          setIsBestSeller(data.is_best_seller);
          setCategoryId(data.category || "");
          setBrandId(data.brand || "");

          const primaryImage = data.images?.find(img => img.is_primary);
          
          if (primaryImage && primaryImage.image_base64) {
            const base64Data = primaryImage.image_base64;
            // Build the full Data URL
            const imagePreviewUrl = base64Data.startsWith('data:') 
              ? base64Data 
              : `data:image/jpeg;base64,${base64Data}`;
            
            setImagePreview(imagePreviewUrl);
            setImageBase64(imagePreviewUrl); // Store the full URL
          } else {
            console.log("No primary image found");
          }
        })
        .catch(error => {
          console.error("Fetch error:", error);
          setErr(error.message);
        });
    } else {
      handleClear();
    }
  }, [productId, isEditMode]);

  // --- Handle Image Upload ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // ... (validations are unchanged)
    if (!file.type.startsWith('image/')) {
      setErr("Please upload a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErr("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setImagePreview(base64String);
      setImageBase64(base64String);
      setErr(null);
      // --- ✅ Step 2: Set flag on new upload ---
      setNewImageSelected(true);
    };
    reader.onerror = () => {
      setErr("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  // --- Form Submit Logic (CREATE and UPDATE) ---
  const handleSubmit = async () => {
    if (!name || !productBarcode || !salePrice) {
      setErr("Name, Barcode, and Sale Price are required");
      return;
    }

    setSubmitting(true);
    setErr(null);
    setSuccess(false);

    // --- ✅ Step 2: Conditionally add image_upload ---
    const payload = {
      product_barcode: productBarcode,
      name,
      name_ar: nameAr,
      description,
      description_ar: descriptionAr,
      sale_price: salePrice,
      stock_quantity: Number(stockQuantity),
      weight: Number(weight),
      is_active: isActive,
      is_featured: isFeatured,
      is_best_seller: isBestSeller,
      category: categoryId ? categoryId : null,
      brand: brandId ? brandId : null,
    };
    
    if (newImageSelected) {
      payload.image_upload = imageBase64;
    }
    // --- End of change ---

    const url = isEditMode 
      ? `${API_BASE_URL}/products/${productId}/` 
      : `${API_BASE_URL}/products/`;
      
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const resp = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Status ${resp.status}: ${text}`);
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
    } catch (error) {
      console.error("Product submit error:", error);
      setErr(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // --- Form Clear Logic ---
  const handleClear = () => {
    setName("");
    setProductBarcode("");
    setNameAr("");
    setDescription("");
    setDescriptionAr("");
    setSalePrice("");
    setStockQuantity(0);
    setWeight(0);
    setIsActive(true);
    setIsFeatured(false);
    setIsBestSeller(false);
    setImageBase64("");
    setImagePreview("");
    setCategoryId("");
    setBrandId("");
    setErr(null);
    setSuccess(false);
    // --- ✅ Step 3: Reset flag on clear ---
    setNewImageSelected(false);
  };

  // ... (handleDelete and Toggle component are unchanged) ...
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product? This cannot be undone.")) {
      return;
    }
    setSubmitting(true);
    setErr(null);
    try {
      const resp = await fetch(`${API_BASE_URL}/products/${productId}/`, {
        method: 'DELETE',
      });
      if (!resp.ok) {
        throw new Error(`Failed to delete product. Status: ${resp.status}`);
      }
      if (onSave) onSave();
      if (onCancel) onCancel();
    } catch (error) {
      console.error("Delete error:", error);
      setErr(error.message);
      setSubmitting(false);
    }
  };

  const Toggle = ({ label, enabled, setEnabled }) => (
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

  return (
    <div className="w-full">
      {/* ... (Header, Success/Error Messages are unchanged) ... */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {isEditMode ? 'Edit Product' : 'Add New Product'}
      </h2>
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-800 font-medium">
            Product {isEditMode ? 'updated' : 'added'} successfully!
          </span>
        </div>
      )}
      {err && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="text-red-800 font-medium">{err}</span>
        </div>
      )}

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* ... (Form inputs are unchanged) ... */}
        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter product name"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Barcode (SKU) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={productBarcode}
              onChange={e => setProductBarcode(e.target.value)}
              placeholder="e.g., 123456789"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all outline-none"
            />
          </div>
           <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all outline-none bg-white"
            >
              <option value="">Select a category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Name (Arabic)
            </label>
            <input
              type="text"
              value={nameAr}
              onChange={e => setNameAr(e.target.value)}
              placeholder="Enter Arabic name"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Price (KWD) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="1"
              min="1"
              value={salePrice}
              onChange={e => setSalePrice(e.target.value)}
              onBlur={e => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) {
                  setSalePrice(val.toFixed(3));
                }
              }}
              placeholder="0.000"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Brand
            </label>
            <select
              value={brandId}
              onChange={e => setBrandId(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all outline-none bg-white"
            >
              <option value="">Select a brand</option>
              {brands.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Stock Quantity
            </label>
            <input
              type="number"
              step="1"
              value={stockQuantity}
              onChange={e => setStockQuantity(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              step="1"
              min="1"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              onBlur={e => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) {
                  setWeight(val.toFixed(2));
                }
              }}
              placeholder="0.000"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all outline-none"
            />
          </div>
        </div>

        {/* --- Image Upload --- */}
        <div className="md:col-span-full">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Product Image
          </label>
          <div className="flex flex-col gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
            />
            {/* --- Image Preview --- */}
            {imagePreview && (
              <div className="relative w-48 h-48 border-2 border-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview("");
                    setImageBase64("");
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
        
        {/* ... (Description, Toggles, and Action Buttons are unchanged) ... */}
        <div className="md:col-span-full lg:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            placeholder="Enter product description..."
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all outline-none resize-none"
          />
        </div>
        
        <div className="md:col-span-full lg:col-span-1">
          {/* Spacer */}
        </div>

        <div className="md:col-span-full lg:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description (Arabic)
          </label>
          <textarea
            value={descriptionAr}
            onChange={e => setDescriptionAr(e.target.value)}
            rows={4}
            placeholder="Enter Arabic description..."
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all outline-none resize-none"
          />
        </div>

        <div className="md:col-span-full">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Product Status
          </label>
          <div className="flex flex-col sm:flex-row sm:space-x-8 space-y-3 sm:space-y-0">
            <Toggle label="Active" enabled={isActive} setEnabled={setIsActive} />
            <Toggle label="Featured" enabled={isFeatured} setEnabled={setIsFeatured} />
            <Toggle label="Best Seller" enabled={isBestSeller} setEnabled={setIsBestSeller} />
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-8 mt-8 border-t-2 border-gray-100">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-orange-700 focus:ring-4 focus:ring-amber-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {isEditMode ? 'Update Product' : 'Add Product'}
            </span>
          )}
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

export default ProductForm;