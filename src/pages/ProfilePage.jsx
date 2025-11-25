import React, { useEffect, useState } from "react";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Load user info from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setProfileData({
        name: storedUser.name || "",
        email: storedUser.email || "",
      });
    }
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Simulate save (you can later connect this to your backend API)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Example placeholder (no actual backend yet)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      localStorage.setItem("user", JSON.stringify(profileData));
      setMessage("Profile updated successfully ✅");
    } catch (error) {
      setMessage("Failed to update profile ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={profileData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="block w-full border rounded-md p-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={profileData.email}
              onChange={handleChange}
              disabled
              className="block w-full border rounded-md p-2 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                loading
                  ? "bg-gray-400"
                  : "bg-amber-600 hover:bg-amber-700 transition"
              }`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 rounded-md text-red-600 border border-red-600 hover:bg-red-50 transition"
            >
              Logout
            </button>
          </div>
        </form>

        {message && (
          <p className="text-center text-sm mt-4 text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
