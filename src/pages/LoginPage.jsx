import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore"; // Import cart store to check for items

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter OTP
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { items } = useCartStore(); // Get cart items

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      // Use the configured API base URL or fallback
      const res = await axios.post(`${API_BASE_URL}send-otp/`, { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (error) {
      setMessage(error.response?.data?.error || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${API_BASE_URL}verify-otp/`, { email, otp });
      setMessage(res.data.message);
      console.log("User logged in:", res.data.user);

      // ✅ Save user info to localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ Smart Redirect: 
      // If the user has items in their cart, send them to checkout.
      // Otherwise, send them to their profile.
      const targetPath = items.length > 0 ? "/checkout" : "/profile";

      // ✅ Redirect after short delay
      setTimeout(() => navigate(targetPath), 1000);
    } catch (error) {
      setMessage(error.response?.data?.error || "Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {step === 1 ? "Sign In" : "Enter OTP"}
        </h1>

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="block w-full border rounded-md p-2 mb-4 focus:ring-amber-500 focus:border-amber-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md text-white font-medium ${
                loading ? "bg-gray-400" : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the OTP sent to your email"
              className="block w-full border rounded-md p-2 mb-4 focus:ring-amber-500 focus:border-amber-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md text-white font-medium ${
                loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="mt-4 w-full text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Change Email
            </button>
          </form>
        )}

        {message && (
          <p
            className={`text-center mt-4 text-sm font-medium ${
              message.toLowerCase().includes("error") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;