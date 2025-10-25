import React, { useState, useMemo } from "react";
// 1. Added FaChevronDown to the import
import { FaPlus, FaMinus, FaTrash, FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";

// 2. Data for the accordion is now defined directly in this component
const accordionData = [
  {
    title: "Delivery Information",
    content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat voluptates commodi aperiam nulla eum nobis cumque in? Vero cum officiis fugiat recusandae facilis accusantium voluptate reiciendis at. Aliquid, non debitis?`,
  },
  {
    title: "14 day money back Guarantee",
    content: `Deleniti unde iure maxime necessitatibus, possimus laborum explicabo beatae, adipisci nobis quia minima autem reprehenderit cum, quo amet. Aliquam, repudiandae! Commodi laudantium nostrum labore molestias quos corrupti eligendi, doloremque voluptatem.`,
  },
];

const CartPage = () => {
  // Get state and actions from the Zustand store
  const {
    items: cartItems,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCartStore();

  // 3. State and handler for the accordion are now part of CartPage
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // --- Calculations using useMemo for performance ---
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const shippingCost = subtotal > 30 ? 0 : 4.62;
  const tax = subtotal * 0.05;
  const grandTotal = subtotal + shippingCost + tax;

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
          Your Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {cartItems.length} Items
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
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center p-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md mr-4"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                      <p className="text-lg font-bold text-amber-600 mt-1">
                        {item.price.toFixed(3)} KD
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mx-4">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                      >
                        <FaMinus size={12} />
                      </button>
                      <span className="font-bold text-lg w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                    <div className="text-right w-32">
                      <p className="font-bold text-lg text-gray-800">
                        {(item.price * item.quantity).toFixed(3)} KD
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-4 text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <FaTrash size={20} />
                    </button>
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
                    <span>{subtotal.toFixed(3)} KD</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0
                        ? "Free"
                        : `${shippingCost.toFixed(3)} KD`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (5%)</span>
                    <span>{tax.toFixed(3)} KD</span>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between font-bold text-gray-900 text-lg">
                      <span>Grand Total</span>
                      <span>{grandTotal.toFixed(3)} KD</span>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-6 py-3 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition-all">
                  Proceed to Checkout
                </button>
              </div>

              {/* 4. MoreInformation JSX is now directly embedded here */}
              <div className="mt-8">
                <div className="more-information h-auto w-full border-2 p-5 bg-white rounded-lg shadow-md">
                  <h1 className="text-3xl flex justify-center mb-4 font-bold text-gray-800">
                    More Information
                  </h1>
                  <div className="space-y-2">
                    {accordionData.map((item, index) => (
                      <div key={index} className="border-b last:border-b-0">
                        <h3
                          className="text-lg font-semibold w-full flex justify-between items-center py-3 cursor-pointer select-none"
                          onClick={() => handleToggle(index)}
                        >
                          <span>{item.title}</span>
                          <FaChevronDown
                            className={`transition-transform duration-300 ${
                              openIndex === index ? "rotate-180" : ""
                            }`}
                          />
                        </h3>
                        <div
                          className={`overflow-hidden transition-all duration-500 ease-in-out ${
                            openIndex === index ? "max-h-screen" : "max-h-0"
                          }`}
                        >
                          <p className="pb-4 text-gray-600">{item.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
