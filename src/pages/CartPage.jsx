import React, { useState, useMemo } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";

const formatPrice = (value) => {
  const num = parseFloat(value);
  return isNaN(num) ? "0.000" : num.toFixed(3);
};

const CartPage = () => {
  const {
    items: cartItems,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCartStore();

  const navigate = useNavigate();

  // --- ✅ NEW: Handle Checkout Click ---
  const handleProceedToCheckout = () => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/checkout");
    } else {
      navigate("/login");
    }
  };

  const normalizedItems = cartItems.map((item) => ({
    ...item,
    price: parseFloat(item.price || item.sale_price || 0),
  }));

  const subtotal = useMemo(() => {
    return normalizedItems.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
      0
    );
  }, [normalizedItems]);

  const shippingCost = subtotal > 30 ? 0 : 4.62;
  const tax = subtotal * 0.05;
  const grandTotal = subtotal + shippingCost + tax;

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-2 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 sm:mb-8 text-center">
          Your Shopping Cart
        </h1>

        {normalizedItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700">
              Your cart is empty.
            </h2>
            <p className="text-gray-500 mt-2">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              to="/"
              className="mt-6 inline-block px-6 py-2 bg-amber-500 text-white font-semibold rounded-md hover:bg-amber-600 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="lg:flex lg:gap-8">
            <div className="lg:w-2/3">
              <div className="flex justify-between items-center mb-4 px-2">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  {normalizedItems.length} Items
                </h2>
                <button
                  onClick={clearCart}
                  className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors flex items-center gap-1"
                >
                  <FaTrash />
                  Clear Cart
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
                {normalizedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center p-3 sm:p-4"
                  >
                    <img
                      src={
                        item.image || 
                        "https://via.placeholder.com/100x100?text=No+Image"
                      }
                      alt={item.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md mr-3 sm:mr-4"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-800 text-base sm:text-lg">
                        {item.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {item.category || item.category_detail?.name || "—"}
                      </p>
                      <p className="text-base sm:text-lg font-bold text-amber-600 mt-1">
                        {formatPrice(item.price)} د.ك
                      </p>
                    </div>

                    <div className="w-full flex items-center justify-between mt-4 sm:w-auto sm:mt-0">
                      <div className="flex items-center gap-2 sm:gap-3 sm:mx-4">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="font-bold text-base sm:text-lg w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                      <div className="text-right w-auto sm:w-32">
                        <p className="font-bold text-base sm:text-lg text-gray-800">
                          {formatPrice(item.price * item.quantity)} د.ك
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-3 sm:ml-4 text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <FaTrash size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)} د.ك</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0
                        ? "Free"
                        : `${formatPrice(shippingCost)} د.ك`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (5%)</span>
                    <span>{formatPrice(tax)} د.ك</span>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between font-bold text-gray-900 text-lg">
                      <span>Grand Total</span>
                      <span>{formatPrice(grandTotal)} د.ك</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleProceedToCheckout} 
                  className="w-full mt-6 py-3 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition-all"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;