import React from "react";

const DashboardPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Summary Cards */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Total Products
          </h3>
          <p className="text-3xl font-bold text-amber-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Total Categories
          </h3>
          <p className="text-3xl font-bold text-amber-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Total Brands
          </h3>
          <p className="text-3xl font-bold text-amber-600">0</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
