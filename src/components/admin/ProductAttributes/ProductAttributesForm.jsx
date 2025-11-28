import React, { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProductAttributesForm = ({ productId, onClose, onSaveSuccess }) => {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    attribute_key: "",
    attribute_value: "",
    attribute_key_ar: "",
    attribute_value_ar: ""
  });

  useEffect(() => {
    if (productId) {
      fetchProductWithAttributes();
    }
  }, [productId]);

  const fetchProductWithAttributes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}products/${productId}/`);
      const data = await response.json();
      
      console.log("Fetched product data:", data);
      console.log("Attributes from API:", data.attributes);
      
      if (data.attributes && data.attributes.length > 0) {
        const mappedAttributes = data.attributes.map(attr => {
          console.log("Mapping attribute:", attr);
          return {
            id: attr.id || null,
            attribute_key: attr.attribute_key || "",
            attribute_value: attr.attribute_value || "",
            attribute_key_ar: attr.attribute_key_ar || "",
            attribute_value_ar: attr.attribute_value_ar || "",
            _isExisting: true
          };
        });
        console.log("Mapped attributes:", mappedAttributes);
        setAttributes(mappedAttributes);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      setLoading(false);
    }
  };

  const handleAddAttribute = () => {
    if (!formData.attribute_key.trim() || !formData.attribute_value.trim()) {
      alert("Please enter both key and value for the attribute");
      return;
    }

    if (editingIndex !== null) {
      // Update existing attribute - PRESERVE id and _isExisting
      const updatedAttributes = [...attributes];
      updatedAttributes[editingIndex] = {
        id: updatedAttributes[editingIndex].id, // Keep original id
        _isExisting: updatedAttributes[editingIndex]._isExisting, // Keep existing flag
        attribute_key: formData.attribute_key,
        attribute_value: formData.attribute_value,
        attribute_key_ar: formData.attribute_key_ar,
        attribute_value_ar: formData.attribute_value_ar
      };
      setAttributes(updatedAttributes);
      setEditingIndex(null);
    } else {
      // Add new attribute
      setAttributes([
        ...attributes,
        {
          id: null,
          ...formData,
          _isExisting: false
        }
      ]);
    }

    // Reset form
    setFormData({
      attribute_key: "",
      attribute_value: "",
      attribute_key_ar: "",
      attribute_value_ar: ""
    });
  };

  const handleEditAttribute = (index) => {
    setEditingIndex(index);
    setFormData({
      attribute_key: attributes[index].attribute_key,
      attribute_value: attributes[index].attribute_value,
      attribute_key_ar: attributes[index].attribute_key_ar || "",
      attribute_value_ar: attributes[index].attribute_value_ar || ""
    });
  };

  const handleDeleteAttribute = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setFormData({
        attribute_key: "",
        attribute_value: "",
        attribute_key_ar: "",
        attribute_value_ar: ""
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setFormData({
      attribute_key: "",
      attribute_value: "",
      attribute_key_ar: "",
      attribute_value_ar: ""
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log("=== STARTING SAVE ===");
      console.log("All attributes to save:", attributes);
      
      const savePromises = attributes.map(async (attr) => {
        const payload = {
          product: productId,
          attribute_key: attr.attribute_key,
          attribute_value: attr.attribute_value,
          attribute_key_ar: attr.attribute_key_ar || null,
          attribute_value_ar: attr.attribute_value_ar || null
        };

        console.log("Processing attribute:", attr);
        console.log("- ID:", attr.id, "Type:", typeof attr.id);
        console.log("- _isExisting:", attr._isExisting);
        console.log("- Payload:", payload);

        if (attr._isExisting && attr.id) {
          const url = `${API_BASE_URL}product-attributes/${attr.id}/`;
          console.log(`Updating attribute with PUT to: ${url}`);
          
          const response = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          
          console.log("PUT Response status:", response.status);
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => response.statusText);
            console.error("Update failed:", errorData);
            throw new Error(`Failed to update attribute ${attr.id}: ${JSON.stringify(errorData)}`);
          }
          
          const responseData = await response.json();
          console.log("PUT Response data:", responseData);
          return response;
        } else if (!attr._isExisting) {
          const url = `${API_BASE_URL}product-attributes/`;
          console.log("Creating new attribute with POST to:", url);
          
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          
          console.log("POST Response status:", response.status);
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => response.statusText);
            console.error("Create failed:", errorData);
            throw new Error(`Failed to create new attribute: ${JSON.stringify(errorData)}`);
          }
          
          const responseData = await response.json();
          console.log("POST Response data:", responseData);
          return response;
        }
      });

      await Promise.all(savePromises);
      
      console.log("=== SAVE COMPLETED SUCCESSFULLY ===");
      alert("Attributes saved successfully!");
      if (onSaveSuccess) {
        onSaveSuccess(); // Call the callback to refresh product data
      }
      onClose();
    } catch (error) {
      console.error("=== SAVE FAILED ===");
      console.error("Error:", error);
      alert(`Failed to save attributes: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 top-[60px] bg-white z-50 overflow-auto">
      <div className="bg-white w-full h-full flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-gray-800">Manage Product Attributes</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-8 py-6 bg-white">
          {/* Existing Attributes Display */}
          {attributes.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Attributes</h3>
              <div className="space-y-4">
                {(() => {
                  // Group attributes by key
                  const groupedAttrs = attributes.reduce((acc, attr, index) => {
                    const key = attr.attribute_key;
                    if (!acc[key]) {
                      acc[key] = [];
                    }
                    acc[key].push({ ...attr, originalIndex: index });
                    return acc;
                  }, {});

                  return Object.entries(groupedAttrs).map(([key, attrs]) => (
                    <div key={key} className="border-b border-gray-200 pb-4">
                      <div className="text-sm font-medium text-gray-700 uppercase mb-3">
                        {key}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {attrs.map((attr) => (
                          <div key={attr.originalIndex} className="inline-flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:border-gray-400 transition-colors">
                            <span>{attr.attribute_value}</span>
                            <div className="flex gap-1 ml-2">
                              <button
                                onClick={() => handleEditAttribute(attr.originalIndex)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Edit"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteAttribute(attr.originalIndex)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Show Arabic translations if any exist */}
                      {attrs.some(attr => attr.attribute_key_ar || attr.attribute_value_ar) && (
                        <div className="mt-3 space-y-1">
                          {attrs.filter(attr => attr.attribute_key_ar || attr.attribute_value_ar).map((attr) => (
                            <div key={attr.originalIndex} className="text-sm text-gray-500" dir="rtl">
                              <span className="font-medium">{attr.attribute_key_ar}</span>: {attr.attribute_value_ar}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          {/* Add/Edit Form */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editingIndex !== null ? "Edit Attribute" : "Add New Attribute"}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attribute Name (EN) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.attribute_key}
                  onChange={(e) => setFormData({ ...formData, attribute_key: e.target.value })}
                  placeholder="e.g., SIZE, COLOR, UNIT"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attribute Value (EN) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.attribute_value}
                  onChange={(e) => setFormData({ ...formData, attribute_value: e.target.value })}
                  placeholder="e.g., 1 X 25 MTR, Red, Roll"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attribute Name (AR)
                </label>
                <input
                  type="text"
                  value={formData.attribute_key_ar}
                  onChange={(e) => setFormData({ ...formData, attribute_key_ar: e.target.value })}
                  placeholder="الحجم، اللون"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-right"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attribute Value (AR)
                </label>
                <input
                  type="text"
                  value={formData.attribute_value_ar}
                  onChange={(e) => setFormData({ ...formData, attribute_value_ar: e.target.value })}
                  placeholder="القيمة"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-right"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddAttribute}
                className="px-6 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                {editingIndex !== null ? "Update Attribute" : "Add Attribute"}
              </button>
              {editingIndex !== null && (
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-200 flex justify-end gap-3 bg-white sticky bottom-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {saving ? "Saving..." : "Save All Attributes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductAttributesForm;