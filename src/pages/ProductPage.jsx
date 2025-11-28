import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCartStore } from "../store/cartStore";
import SidebarCart from "../components/sidebarcart/SidebarCart";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- ✅ ADDED IMAGE HELPER FUNCTION ---
const getPrimaryImageSrc = (product) => {
  const placeholder = "https://via.placeholder.com/400x400?text=No+Image";
  if (!product || !product.images || product.images.length === 0) {
    return placeholder;
  }
  
  const primary = product.images.find(img => img.is_primary) || product.images[0];
  if (!primary) return placeholder;

  if (primary.image_base64) {
    return `data:image/png;base64,${primary.image_base64}`;
  }
  if (primary.image_url) {
    return primary.image_url; // Fallback for old data
  }
  
  return placeholder;
};


function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    axios.get(`${API_BASE_URL}products/${id}/`)
      .then((res) => {
        setProduct(res.data);
        // Initialize selected attributes with first value of each attribute
        const initial = {};
        res.data.attributes?.forEach((attr) => {
          if (!initial[attr.attribute_key]) {
            initial[attr.attribute_key] = attr.attribute_value;
          }
        });
        setSelectedAttributes(initial);
      })
      .catch((err) => console.log(err));
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  // --- ✅ UPDATED: Use the helper function ---
  const primaryImageSrc = getPrimaryImageSrc(product);

  // Group attributes by key
  const groupedAttributes = {};
  // ... (grouping logic is unchanged) ...
  product.attributes?.forEach((attr) => {
    if (!groupedAttributes[attr.attribute_key]) {
      groupedAttributes[attr.attribute_key] = [];
    }
    groupedAttributes[attr.attribute_key].push(attr.attribute_value);
  });

  const handleAttributeSelect = (key, value) => {
    // ... (unchanged) ...
    setSelectedAttributes({
      ...selectedAttributes,
      [key]: value
    });
  };

  const handleIncrease = () => {
    // ... (unchanged) ...
    setQuantity((prev) => {
      const newQty = prev + 1;
      if (newQty > product.stock_quantity) return product.stock_quantity;
      return newQty;
    });
  };

  const handleDecrease = () => {
    // ... (unchanged) ...
    setQuantity((prev) => {
      const newQty = prev - 1;
      if (newQty < 1) return 1;
      return newQty;
    });
  };

  // --- ✅ UPDATED: 'image' property now uses 'primaryImageSrc' ---
  const handleAddToCart = () => {
    if (!product || product.stock_quantity === 0) return;

    const cartItem = {
      id: product.id,
      name: product.name,
      sale_price: product.sale_price,
      price: product.sale_price,
      product_barcode: product.product_barcode,
      image: primaryImageSrc, // Use the correct Data URL
      images: product.images,
      category_detail: product.category_detail,
      selectedAttributes: selectedAttributes,
      stock_quantity: product.stock_quantity
    };

    // Add to cart quantity times
    for (let i = 0; i < quantity; i++) {
      addItem(cartItem);
    }

    // Open sidebar cart instead of alert
    setIsCartOpen(true);
    setQuantity(1);
  };

  return (
    <>
      <SidebarCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      <div className={`min-h-screen bg-gray-50 relative transition-all duration-300 ${isCartOpen ? 'opacity-40' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="flex items-start justify-center">
              <img 
                src={primaryImageSrc} // --- ✅ UPDATED
                alt={product.name} 
                className="w-full max-w-md rounded-lg shadow-md pointer-events-none"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col relative z-10">
              {/* ... (rest of the product details are unchanged) ... */}
              {product.brand_detail && (
                <div className="text-sm text-gray-600 mb-2">
                  {product.brand_detail.name}
                </div>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              {product.product_barcode && (
                <div className="text-sm text-gray-500 mb-6">
                  SKU: {product.product_barcode}
                </div>
              )}
              {Object.keys(groupedAttributes).length > 0 && (
                <div className="mb-8 space-y-6">
                  {Object.entries(groupedAttributes).map(([key, values]) => (
                    <div key={key} className="relative z-10">
                      <div className="text-sm font-semibold text-gray-700 uppercase mb-3">
                        {key}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {values.map((value, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleAttributeSelect(key, value)}
                            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer relative z-20 ${
                              selectedAttributes[key] === value
                                ? "bg-gray-900 text-white border-2 border-gray-900"
                                : "bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="text-3xl font-bold text-gray-900 mb-6">
                {product.sale_price} KWD
              </div>
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Quantity ({product.stock_quantity || 0} in stock)
                </div>
                <div className="inline-flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                  <button 
                    type="button"
                    onClick={handleDecrease}
                    className="px-4 py-2.5 text-gray-700 hover:bg-gray-100 transition-colors font-bold text-lg cursor-pointer relative z-20 bg-white"
                  >
                    −
                  </button>
                  <span className="w-16 text-center py-2.5 font-semibold text-lg border-x-2 border-gray-300 bg-white select-none">
                    {quantity}
                  </span>
                  <button 
                    type="button"
                    onClick={handleIncrease}
                    className="px-4 py-2.5 text-gray-700 hover:bg-gray-100 transition-colors font-bold text-lg cursor-pointer relative z-20 bg-white"
                  >
                    +
                  </button>
                </div>
              </div>
              {product.stock_quantity > 0 ? (
                <div className="inline-flex items-center gap-2 text-green-700 bg-green-100 px-3 py-1 rounded w-fit mb-6">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  In Stock
                </div>
              ) : (
                <div className="inline-flex items-center text-red-700 bg-red-100 px-3 py-1 rounded w-fit mb-6">
                  Out of Stock
                </div>
              )}
              <button 
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="w-full bg-white border-2 border-gray-900 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-900 cursor-pointer relative z-20"
              >
                {product.stock_quantity === 0 ? "Out of Stock" : "Add to cart"}
              </button>
              {product.description && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Description
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default ProductPage;