import React, { useState } from "react";
import CategoryForm from "../../components/admin/Categories/CategoryForm";

const CategoriesPage = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <button
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add New Category"}
        </button>
      </div>

      {/* Add Category Form */}
      {showForm && (
        <div className="mb-6">
          <CategoryForm />
        </div>
      )}

      {/* Categories Tree/List */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-gray-500 text-center py-4">
          No categories found
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
