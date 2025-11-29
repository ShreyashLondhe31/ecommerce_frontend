import React, { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SiteSettingsForm = ({ onClose }) => {
  // --- States for SiteSetting model fields ---
  const [settingId, setSettingId] = useState(null);
  const [scrollingText1, setScrollingText1] = useState("");
  const [scrollingText2, setScrollingText2] = useState("");
  const [scrollingText3, setScrollingText3] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [newImageSelected, setNewImageSelected] = useState(false);

  // --- States for UI ---
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(false);

  // --- Fetch existing site settings on mount ---
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}site-setting/`);
        if (!response.ok) throw new Error('Failed to fetch site settings');
        
        const data = await response.json();
        
        // Assuming we're using the first setting (singleton pattern)
        if (data && data.length > 0) {
          const setting = data[0];
          setSettingId(setting.id);
          setScrollingText1(setting.scrolling_text_1 || "");
          setScrollingText2(setting.scrolling_text_2 || "");
          setScrollingText3(setting.scrolling_text_3 || "");
          
          // Handle image
          if (setting.image_base64_data) {
            const base64Data = setting.image_base64_data;
            const imagePreviewUrl = base64Data.startsWith('data:') 
              ? base64Data 
              : `data:image/jpeg;base64,${base64Data}`;
            
            setImagePreview(imagePreviewUrl);
            setImageBase64(imagePreviewUrl);
          }
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setErr(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // --- Handle Image Upload ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
      setNewImageSelected(true);
    };
    reader.onerror = () => {
      setErr("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  // --- Form Submit Logic ---
  const handleSubmit = async () => {
    setSubmitting(true);
    setErr(null);
    setSuccess(false);

    const payload = {
      scrolling_text_1: scrollingText1,
      scrolling_text_2: scrollingText2,
      scrolling_text_3: scrollingText3,
    };

    // Only include image if a new one was selected
    if (newImageSelected) {
      payload.image_base64_data = imageBase64;
    }

    try {
      let response;
      
      if (settingId) {
        // Update existing setting
        response = await fetch(`${API_BASE_URL}/site-setting/${settingId}/`, {
          method: 'PATCH',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        // Create new setting
        response = await fetch(`${API_BASE_URL}site-setting/`, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Status ${response.status}: ${text}`);
      }

      const data = await response.json();
      setSettingId(data.id);
      setSuccess(true);
      setNewImageSelected(false);
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Settings submit error:", error);
      setErr(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4">
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-2xl font-semibold text-gray-800">Site Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-800 font-medium">
                Settings updated successfully!
              </span>
            </div>
          )}

          {/* Error Message */}
          {err && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-red-800 font-medium">{err}</span>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Scrolling Text 1 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Scrolling Text 1
              </label>
              <input
                type="text"
                value={scrollingText1}
                onChange={e => setScrollingText1(e.target.value)}
                placeholder="Enter first scrolling text..."
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all outline-none"
              />
            </div>

            {/* Scrolling Text 2 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Scrolling Text 2
              </label>
              <input
                type="text"
                value={scrollingText2}
                onChange={e => setScrollingText2(e.target.value)}
                placeholder="Enter second scrolling text..."
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all outline-none"
              />
            </div>

            {/* Scrolling Text 3 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Scrolling Text 3
              </label>
              <input
                type="text"
                value={scrollingText3}
                onChange={e => setScrollingText3(e.target.value)}
                placeholder="Enter third scrolling text..."
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all outline-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Site Banner Image
              </label>
              <div className="flex flex-col gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                />
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative w-full h-48 border-2 border-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Banner Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("");
                        setImageBase64("");
                        setNewImageSelected(true);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      aria-label="Remove image"
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

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 mt-6 border-t-2 border-gray-100">
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Settings
                </span>
              )}
            </button>
            
            <button
              onClick={onClose}
              disabled={submitting}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 transition-all border-2 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteSettingsForm;