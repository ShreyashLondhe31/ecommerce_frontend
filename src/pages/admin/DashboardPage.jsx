import React, { useEffect, useState } from "react";
import axios from "axios";
// You'll need to install a chart library
// npm install recharts
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the chart - replace with API data
const salesData = [
  { name: 'Mon', sales: 400 },
  { name: 'Tue', sales: 300 },
  { name: 'Wed', sales: 600 },
  { name: 'Thu', sales: 800 },
  { name: 'Fri', sales: 700 },
  { name: 'Sat', sales: 1100 },
  { name: 'Sun', sales: 900 },
];

// Mock data for recent orders - replace with API data
const recentOrders = [
  { id: 1024, customer: 'John Doe', total: '25.50', status: 'Pending' },
  { id: 1023, customer: 'Jane Smith', total: '89.99', status: 'Shipped' },
  { id: 1022, customer: 'Bob Johnson', total: '14.00', status: 'Delivered' },
];

const DashboardPage = () => {
  const [counts, setCounts] = useState({
    products: 0,
    categories: 0,
    brands: 0,
    // Add new stats
    orders: 0,
    revenue: 0.0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // You'll need to update this endpoint
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}dashboard/counts/`);
        setCounts(res.data);
      } catch (error) {
        console.error("Error fetching dashboard counts:", error);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      {/* --- MODIFIED: Stat Cards Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Products" value={counts.products} />
        <StatCard title="Total Categories" value={counts.categories} />
        <StatCard title="Total Brands" value={counts.brands} />
        <StatCard title="Total Orders" value={counts.orders} />
        {/* You could add a 5th card for Revenue here */}
      </div>

      {/* --- NEW: Main Dashboard Area (Chart + Recent) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart (takes 2/3 width) */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Sales (Last 7 Days)</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#eab308" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders (takes 1/3 width) */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Orders</h3>
          <ul className="divide-y divide-gray-200">
            {recentOrders.map(order => (
              <li key={order.id} className="py-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">{order.customer}</span>
                  <span className="text-gray-600">${order.total}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Order #{order.id} - <span className="font-medium text-blue-600">{order.status}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Helper component for the stat cards
const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
    <p className="text-3xl font-bold text-amber-600">{value}</p>
  </div>
);

export default DashboardPage;