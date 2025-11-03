import React, { useState } from "react";
import BrandForm from "../../components/admin/Brands/BrandForm";

const BrandsPage = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Brands</h1>
        <button
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add New Brand"}
        </button>
      </div>

      {/* Add Brand Form */}
      {showForm && (
        <div className="mb-6">
          <BrandForm />
        </div>
      )}

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Empty state */}
        <div className="col-span-full text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">No brands found</p>
        </div>
      </div>
    </div>
  );
};

export default BrandsPage;
