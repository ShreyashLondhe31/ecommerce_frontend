import React, { useState } from "react";
import { useCartStore } from "../store/cartStore";
import { Link, useNavigate } from "react-router-dom";
import { Check } from "lucide-react"; // Changed to lucide-react to fix build error

const formatPrice = (value) => {
  const num = parseFloat(value);
  return isNaN(num) ? "0.000" : num.toFixed(3);
};

const CheckoutPage = () => {
  const { items, clearCart } = useCartStore();
  const navigate = useNavigate();

  // Calculate totals
  const normalizedItems = items.map((item) => ({
    ...item,
    price: parseFloat(item.price || item.sale_price || 0),
  }));
  const subtotal = normalizedItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingCost = subtotal > 30 ? 0 : 4.62;
  const grandTotal = subtotal + shippingCost;

  // Form State
  const [step, setStep] = useState(1); // 1: Billing, 2: Payment
  const [paymentMethod, setPaymentMethod] = useState("link");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    city: "",
    block: "",
    street: "",
    house: "",
    flat: "",
    createAccount: false,
    termsAgreed: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!formData.termsAgreed) {
      alert("Please agree to the terms and conditions.");
      return;
    }
    // Mock Order Submission
    alert("Order Placed Successfully!");
    clearCart();
    navigate("/");
  };

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Your cart is empty
        </h2>
        <Link to="/" className="text-amber-600 hover:underline">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Main Container - stretched to full width with padding */}
      <div className="w-full px-4 md:px-8 pt-8">
        {/* Coupon Link */}
        <div className="mb-8 text-sm">
          <span className="text-gray-600">Have a coupon? </span>
          <button className="text-green-700 hover:underline font-medium">
            Click here to enter your code
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">
          {/* LEFT COLUMN - FORMS (Full width style) */}
          <div className="lg:col-span-7 space-y-8 w-full">
            {/* STEP 1: BILLING DETAILS */}
            <div
              className={`transition-all duration-300 ${
                step === 1 ? "opacity-100" : "opacity-50 grayscale"
              }`}
            >
              <div
                className="flex items-center gap-4 mb-6 cursor-pointer"
                onClick={() => setStep(1)}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm ${
                    step === 1 || step > 1 ? "bg-blue-900" : "bg-gray-400"
                  }`}
                >
                  {step > 1 ? <Check size={16} /> : "1"}
                </div>
                <h2 className="text-xl font-bold text-blue-900">
                  Billing Details
                </h2>
              </div>

              {step === 1 && (
                <form
                  className="space-y-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep(2);
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className="block text-sm text-gray-600">
                        First name <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        type="text"
                        className="w-full bg-gray-50 border border-gray-300 rounded p-3 focus:outline-none focus:border-blue-900 transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm text-gray-600">
                        Last name <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        type="text"
                        className="w-full bg-gray-50 border border-gray-300 rounded p-3 focus:outline-none focus:border-blue-900 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className="block text-sm text-gray-600">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        type="tel"
                        className="w-full bg-gray-50 border border-gray-300 rounded p-3 focus:outline-none focus:border-blue-900 transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm text-gray-600">
                        Email address{" "}
                        <span className="text-gray-400">(optional)</span>
                      </label>
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        type="email"
                        className="w-full bg-gray-50 border border-gray-300 rounded p-3 focus:outline-none focus:border-blue-900 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm text-gray-600">
                      Select City (Mantaqa){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-300 rounded p-3 focus:outline-none focus:border-blue-900 transition-colors text-gray-700"
                    >
                      <option value="">Select an option...</option>
                      <option value="Kuwait City">Kuwait City</option>
                      <option value="Salmiya">Salmiya</option>
                      <option value="Hawally">Hawally</option>
                      <option value="Farwaniya">Farwaniya</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className="block text-sm text-gray-600">
                        Block <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        name="block"
                        value={formData.block}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Block No."
                        className="w-full bg-gray-50 border border-gray-300 rounded p-3 focus:outline-none focus:border-blue-900 transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm text-gray-600">
                        Street No. <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        type="text"
                        placeholder="Street No."
                        className="w-full bg-gray-50 border border-gray-300 rounded p-3 focus:outline-none focus:border-blue-900 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm text-gray-600">
                      House / Building No.{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      name="house"
                      value={formData.house}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="House / Building No."
                      className="w-full bg-gray-50 border border-gray-300 rounded p-3 focus:outline-none focus:border-blue-900 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <input
                      name="flat"
                      value={formData.flat}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="Flat / Floor / Paci No. (optional)"
                      className="w-full bg-gray-50 border border-gray-300 rounded p-3 focus:outline-none focus:border-blue-900 transition-colors"
                    />
                  </div>

                  <div className="pt-2">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Country <span className="text-red-500">*</span>
                    </p>
                    <p className="font-bold text-gray-900">Kuwait</p>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      id="createAccount"
                      type="checkbox"
                      name="createAccount"
                      checked={formData.createAccount}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-900 border-gray-300 rounded focus:ring-blue-900"
                    />
                    <label
                      htmlFor="createAccount"
                      className="text-sm font-bold text-gray-800 cursor-pointer select-none"
                    >
                      Create an account?
                    </label>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full md:w-auto px-8 py-3 bg-blue-900 text-white font-semibold rounded hover:bg-blue-800 transition-colors uppercase text-sm tracking-wider"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* STEP 2: PAYMENT INFORMATION */}
            <div
              className={`transition-all duration-300 ${
                step === 2 ? "opacity-100" : "opacity-50"
              }`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm ${
                    step === 2 ? "bg-blue-900" : "bg-gray-400"
                  }`}
                >
                  2
                </div>
                <h2 className="text-xl font-bold text-blue-900">
                  Payment Information
                </h2>
              </div>

              {step === 2 && (
                <div className="space-y-6 bg-gray-50/50 p-1 rounded-lg">
                  <div className="space-y-4">
                    {/* Pay by Link Option */}
                    <label className="relative flex items-start gap-3 p-4 cursor-pointer group">
                      <div className="flex items-center h-5">
                        <input
                          type="radio"
                          name="payment"
                          value="link"
                          checked={paymentMethod === "link"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-gray-900 block mb-1">
                          Pay by Link
                        </span>
                        {paymentMethod === "link" && (
                          <div className="mt-3 p-4 bg-white border border-gray-200 rounded text-sm text-gray-600 shadow-sm">
                            Our team will send you payment link on your
                            registered number.
                          </div>
                        )}
                      </div>
                    </label>

                    {/* Cash on Delivery Option */}
                    {/* <label className="relative flex items-center gap-3 p-4 cursor-pointer">
                      <div className="flex items-center h-5">
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={paymentMethod === "cod"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                      </div>
                      <span className="font-medium text-gray-900">
                        Cash on delivery
                      </span>
                    </label> */}
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      Your personal data will be used to process your order,
                      support your experience throughout this website, and for
                      other purposes described in our{" "}
                      <span className="font-bold">privacy policy</span>.
                    </p>

                    <div className="flex items-start gap-2 mb-6">
                      <input
                        id="terms"
                        type="checkbox"
                        name="termsAgreed"
                        checked={formData.termsAgreed}
                        onChange={handleInputChange}
                        className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm text-gray-700 cursor-pointer select-none"
                      >
                        I have read and agree to the website{" "}
                        <span className="font-bold text-red-600">
                          terms and conditions
                        </span>{" "}
                        <span className="text-red-500">*</span>
                      </label>
                    </div>

                    <button
                      onClick={handlePlaceOrder}
                      className="w-full py-4 bg-[#5cae6e] hover:bg-[#4d945d] text-white font-bold rounded transition-colors text-sm tracking-widest uppercase shadow-sm"
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - ORDER SUMMARY */}
          <div className="hidden lg:block lg:col-span-5 sticky top-24">
            <div className="border border-gray-300 p-8 bg-white">
              <h3 className="text-lg font-bold text-gray-800 mb-6">
                Your Order
              </h3>

              <div className="flex justify-between text-xs font-bold text-gray-500 border-b border-gray-200 pb-2 mb-4">
                <span>PRODUCT</span>
                <span>SUBTOTAL</span>
              </div>

              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {normalizedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start gap-4 text-sm"
                  >
                    <div className="text-gray-600">
                      <span className="block text-gray-800 font-medium">
                        {item.name}
                      </span>
                      <span className="text-xs">× {item.quantity}</span>
                    </div>
                    <div className="font-bold text-gray-500 whitespace-nowrap">
                      KD {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm font-bold text-gray-800">
                  <span>Subtotal</span>
                  <span className="text-green-700">
                    KD {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-800">
                  <span>Shipping</span>
                  <span className="text-green-700">
                    {shippingCost === 0
                      ? "Free"
                      : `KD ${formatPrice(shippingCost)}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-4 mt-2">
                  <span>Total</span>
                  <span className="text-green-700">
                    KD {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE ORDER SUMMARY (Visible only on small screens) */}
          <div className="mt-10 lg:hidden border border-gray-300 p-6 bg-white">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Your Order</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span className="text-green-700">
                  KD {formatPrice(grandTotal)}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Detailed summary available on desktop view or cart page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
