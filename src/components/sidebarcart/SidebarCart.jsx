import React from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../../store/cartStore"; // Verified path based on Navbar structure

const formatPrice = (value) => {
  const num = parseFloat(value);
  return isNaN(num) ? "0.000" : num.toFixed(3);
};

const SidebarCart = ({ isOpen, onClose }) => {
  const {
    items: cartItems,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
  } = useCartStore();

  // Normalize prices
  const normalizedItems = cartItems.map((item) => ({
    ...item,
    price: parseFloat(item.price || item.sale_price || 0),
  }));

  const subtotal = normalizedItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <>
      {/* Semi-transparent overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
          onClick={onClose}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col overflow-hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Shopping cart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
          {normalizedItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-gray-500 mb-6 text-lg">Your cart is empty</p>
              <button
                onClick={onClose}
                className="text-white bg-amber-500 hover:bg-amber-600 px-6 py-2 rounded-full font-medium transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {normalizedItems.map((item) => (
                <div
                  key={item.id}
                  className="relative bg-white rounded-lg p-3 border border-gray-100 shadow-sm flex gap-3"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden border border-gray-100">
                    <img
                      src={
                        item.image ||
                        item.images?.[0]?.image_url ||
                        "https://via.placeholder.com/80x80?text=No+Image"
                      }
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="pr-6">
                       <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight mb-1">
                        {item.name}
                      </h3>
                      {item.product_barcode && (
                        <p className="text-xs text-gray-400">
                          {item.product_barcode}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                       {/* Quantity */}
                       <div className="flex items-center border border-gray-200 rounded bg-gray-50 h-7">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="px-2 h-full flex items-center text-gray-600 hover:bg-gray-200 rounded-l transition-colors"
                          >
                            −
                          </button>
                          <span className="px-2 text-xs font-semibold text-gray-900 min-w-[1.5rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQuantity(item.id)}
                            className="px-2 h-full flex items-center text-gray-600 hover:bg-gray-200 rounded-r transition-colors"
                          >
                            +
                          </button>
                       </div>
                       
                       {/* Price */}
                       <div className="text-sm font-bold text-gray-900">
                          KD {formatPrice(item.price * item.quantity)}
                       </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {normalizedItems.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Subtotal</span>
              <span className="text-lg font-bold text-gray-900">
                KD {formatPrice(subtotal)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/cart"
                onClick={onClose}
                className="flex items-center justify-center py-3 border border-gray-300 text-gray-700 bg-white rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                View Cart
              </Link>
              <Link 
                to="/checkout" 
                onClick={onClose}
                className="flex items-center justify-center py-3 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SidebarCart;