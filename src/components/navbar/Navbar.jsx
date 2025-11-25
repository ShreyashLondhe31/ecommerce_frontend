import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useCartStore } from "../../store/cartStore";
import axios from "axios";
import { CiSearch } from "react-icons/ci";
import { PiShoppingCartThin } from "react-icons/pi";
import { MdMenu } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FaUserCircle, FaChevronDown, FaChevronRight } from "react-icons/fa"; // Added FaChevronRight
import ResponsiveMenu from "./ResponsiveMenu";

// --- Helper Function for Images ---
const getPrimaryImageSrc = (product) => {
  const placeholder = "https://via.placeholder.com/150";
  if (!product || !product.images || product.images.length === 0) {
    return placeholder;
  }
  const primary = product.images.find(img => img.is_primary) || product.images[0];
  if (!primary) return placeholder;

  if (primary.image_base64) return `data:image/png;base64,${primary.image_base64}`;
  if (primary.image_url) return primary.image_url;
  
  return placeholder;
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showBrandsDropdown, setShowBrandsDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const { items, addItem } = useCartStore();
  const navigate = useNavigate();

  // --- Search State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  // --- Search Logic (Debounced) ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        axios.get(`${API_BASE_URL}/products/?search=${searchQuery}`)
          .then((res) => {
            setSearchResults(res.data);
            setIsSearching(false);
          })
          .catch((err) => {
            console.error("Search Error", err);
            setIsSearching(false);
          });
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, API_BASE_URL]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock_quantity > 0) {
      const cartItem = {
        ...product,
        image: getPrimaryImageSrc(product),
        quantity: 1,
      };
      addItem(cartItem);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data.filter(cat => cat.is_active));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [API_BASE_URL]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoadingBrands(true);
        const response = await fetch(`${API_BASE_URL}/brands`);
        if (response.ok) {
          const data = await response.json();
          setBrands(data);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoadingBrands(false);
      }
    };
    fetchBrands();
  }, [API_BASE_URL]);

  const categoryColumns = () => {
    const columns = [[], [], [], []];
    categories.forEach((category, index) => {
      columns[index % 4].push(category);
    });
    return columns;
  };

  const brandColumns = () => {
    const columns = [[], [], []];
    brands.forEach((brand, index) => {
      columns[index % 3].push(brand);
    });
    return columns;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setIsLoggedIn(!!storedUser);
  }, []);

  // --- Helper Component: Search Results Dropdown ---
  const SearchResultsDropdown = () => (
    <div className="absolute top-full right-0 mt-2 w-[24rem] sm:w-[28rem] bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[80vh] overflow-y-auto z-50 p-3">
      <div className="space-y-3">
        {searchResults.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            onClick={() => {
              setSearchQuery("");
              setSearchResults([]);
              setShowMobileSearch(false);
            }}
            className="block group"
          >
            <div className="relative bg-gray-50 hover:bg-white rounded-lg p-3 border border-gray-200 hover:border-amber-300 transition-all shadow-sm hover:shadow-md flex gap-3 items-center">
              <img
                src={getPrimaryImageSrc(product)}
                alt={product.name}
                className="w-16 h-16 object-cover rounded bg-white border border-gray-200 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-amber-700 transition-colors">
                  {product.name}
                </h4>
                <div className="flex justify-between items-center">
                   <p className="text-xs text-gray-500">
                      {product.product_barcode ? `SKU: ${product.product_barcode}` : ''}
                   </p>
                   <p className="text-sm font-bold text-gray-900">
                      KD {parseFloat(product.sale_price).toFixed(3)}
                   </p>
                </div>
              </div>
              <button
                onClick={(e) => handleAddToCart(e, product)}
                disabled={product.stock_quantity === 0}
                className={`p-2 rounded-full transition-colors flex-shrink-0 shadow-sm ${
                  product.stock_quantity > 0
                    ? "bg-gray-900 text-white hover:bg-amber-500 hover:scale-105 transform duration-200"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                title={product.stock_quantity > 0 ? "Add to Cart" : "Out of Stock"}
              >
                <PiShoppingCartThin size={18} strokeWidth={8} />
              </button>
            </div>
          </Link>
        ))}
      </div>
      
      {searchResults.length === 0 && searchQuery && !isSearching && (
         <div className="p-6 text-center text-gray-500">
            <p>No products found for "{searchQuery}"</p>
         </div>
      )}
    </div>
  );

  return (
    <>
      <nav className="w-full bg-amber-200 fixed top-0 left-0 z-50 shadow-sm">
        <div className="flex items-center justify-between h-16 md:h-[68px] px-4 md:px-6 lg:px-8">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img
              src={`${import.meta.env.BASE_URL}assets/logo/Logo.png`}
              alt="Logo"
              className="h-10 w-auto object-contain md:h-12"
            />
            <div className="hidden xl:flex flex-col leading-tight">
              <span className="text-xl font-bold text-amber-900">Hakimi Establishment</span>
              <span className="text-xs text-amber-800">Quality Tools & Hardware Since 1989</span>
            </div>
          </Link>

          {/* Centered Links (Desktop) */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            <ul className="flex items-center gap-6 lg:gap-8 font-medium text-sm lg:text-base">
              <li><Link to="/" className="text-amber-900 hover:text-amber-700 transition-colors">Home</Link></li>
              
              {/* Categories Mega Menu */}
              <li className="relative" onMouseEnter={() => setShowCategoriesDropdown(true)} onMouseLeave={() => setShowCategoriesDropdown(false)}>
                <button className="text-amber-900 hover:text-amber-700 transition-colors flex items-center gap-1 py-4">
                  Categories <FaChevronDown size={10} className={`transition-transform duration-200 ${showCategoriesDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showCategoriesDropdown && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-0 w-screen max-w-5xl animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] py-6 px-8 border-t-4 border-amber-500 ring-1 ring-gray-100">
                       {loadingCategories ? (
                         <div className="h-32 flex items-center justify-center text-gray-400">Loading categories...</div>
                       ) : (
                        <>
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
                           <h3 className="text-lg font-bold text-gray-800">Browse Categories</h3>
                           <Link to="/category" className="text-sm text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1">
                              View All <FaChevronRight size={10}/>
                           </Link>
                        </div>
                        <div className="grid grid-cols-4 gap-x-8 gap-y-2">
                          {categoryColumns().map((column, idx) => (
                            <div key={idx} className="space-y-1">
                              {column.map((category) => (
                                  <Link 
                                    key={category.id} 
                                    to={`/category/${category.slug}`} 
                                    className="group flex items-center justify-between py-2 px-3 rounded-lg hover:bg-amber-50 text-gray-600 hover:text-amber-800 transition-all duration-200"
                                  >
                                    <span className="text-sm font-medium transform group-hover:translate-x-1 transition-transform duration-200">
                                      {category.name}
                                    </span>
                                    <FaChevronRight size={10} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-amber-500 transition-all duration-200" />
                                  </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                        </>
                       )}
                    </div>
                  </div>
                )}
              </li>

              {/* Brands Mega Menu */}
              <li className="relative" onMouseEnter={() => setShowBrandsDropdown(true)} onMouseLeave={() => setShowBrandsDropdown(false)}>
                <button className="text-amber-900 hover:text-amber-700 transition-colors flex items-center gap-1 py-4">
                  Brands <FaChevronDown size={10} className={`transition-transform duration-200 ${showBrandsDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showBrandsDropdown && (
                   <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-0 w-screen max-w-3xl animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] py-6 px-8 border-t-4 border-amber-500 ring-1 ring-gray-100">
                       {loadingBrands ? (
                         <div className="h-32 flex items-center justify-center text-gray-400">Loading brands...</div>
                       ) : (
                        <>
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
                           <h3 className="text-lg font-bold text-gray-800">Featured Brands</h3>
                           <Link to="/brands" className="text-sm text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1">
                              View All <FaChevronRight size={10}/>
                           </Link>
                        </div>
                        <div className="grid grid-cols-3 gap-x-8 gap-y-2">
                          {brandColumns().map((column, idx) => (
                            <div key={idx} className="space-y-1">
                                {column.map((brand) => (
                                  <Link 
                                    key={brand.id} 
                                    to={`/brand/${brand.id}`} 
                                    className="group flex items-center justify-between py-2 px-3 rounded-lg hover:bg-amber-50 text-gray-600 hover:text-amber-800 transition-all duration-200"
                                  >
                                    <span className="text-sm font-medium transform group-hover:translate-x-1 transition-transform duration-200">
                                      {brand.name}
                                    </span>
                                    <FaChevronRight size={10} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-amber-500 transition-all duration-200" />
                                  </Link>
                                ))}
                            </div>
                          ))}
                        </div>
                        </>
                       )}
                    </div>
                   </div>
                )}
              </li>

              <li><Link to="/blog" className="text-amber-900 hover:text-amber-700 transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="text-amber-900 hover:text-amber-700 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Right Side Actions & SEARCH */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Desktop Search Bar */}
            <div className="hidden lg:block relative" ref={searchRef}>
              <div className="relative transition-all duration-300">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-56 xl:w-72 pl-10 pr-8 py-2 bg-white/80 hover:bg-white focus:bg-white rounded-lg 
                           text-sm text-gray-900 placeholder:text-gray-500 border border-transparent focus:border-amber-500
                           focus:outline-none focus:ring-2 focus:ring-amber-200 shadow-sm transition-all"
                />
                <CiSearch size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                
                <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 flex items-center">
                  {isSearching ? (
                    <div className="animate-spin h-3.5 w-3.5 border-2 border-amber-600 border-t-transparent rounded-full"></div>
                  ) : searchQuery ? (
                    <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                      <IoClose size={16} />
                    </button>
                  ) : null}
                </div>
              </div>
              
              {(searchResults.length > 0 || (searchQuery && !isSearching)) && (
                <SearchResultsDropdown />
              )}
            </div>

            {/* Mobile Search Icon */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="lg:hidden p-2 hover:bg-amber-300 rounded-full transition-colors"
              aria-label="Search"
            >
              {showMobileSearch ? <IoClose size={24} className="text-amber-900" /> : <CiSearch size={24} className="text-amber-900" />}
            </button>

            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 hover:bg-amber-300 rounded-full transition-colors" aria-label="Shopping cart">
              <PiShoppingCartThin size={26} className="text-amber-900" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-amber-200">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Icon */}
            {isLoggedIn ? (
              <button onClick={() => navigate("/profile")} className="hidden sm:block ml-1 p-2 hover:bg-amber-300 rounded-full transition-colors">
                <FaUserCircle size={26} className="text-amber-900" />
              </button>
            ) : (
              <Link to="/login" className="hidden sm:block ml-1 p-2 hover:bg-amber-300 rounded-full transition-colors">
                <FaUserCircle size={26} className="text-amber-900" />
              </Link>
            )}

            {/* Mobile Menu Hamburger */}
            <button className="md:hidden p-2 hover:bg-amber-300 rounded-lg transition-colors" onClick={() => setOpen(!open)}>
              <MdMenu size={28} className="text-amber-900" />
            </button>
          </div>
        </div>
        
        {/* Mobile Search Bar Drawer */}
        {showMobileSearch && (
          <div className="lg:hidden bg-white/95 backdrop-blur-sm px-4 py-4 border-t border-amber-200 absolute w-full shadow-lg">
            <div className="relative">
              <input 
                 type="text" 
                 className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-base"
                 placeholder="Search products..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 autoFocus
              />
              <CiSearch size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 bg-gray-200 rounded-full text-gray-600"
                >
                  <IoClose size={14} />
                </button>
              )}
            </div>
            
            {(searchResults.length > 0 || (searchQuery && !isSearching)) && (
               <div className="mt-4 max-h-[60vh] overflow-y-auto">
                  <div className="space-y-3">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        onClick={() => {
                          setSearchQuery("");
                          setSearchResults([]);
                          setShowMobileSearch(false);
                        }}
                        className="block"
                      >
                         <div className="bg-white rounded-lg p-3 border border-gray-200 flex gap-3 items-center shadow-sm">
                            <img
                              src={getPrimaryImageSrc(product)}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded bg-gray-50 border border-gray-100"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</h4>
                              <p className="text-sm font-bold text-amber-600 mt-1">
                                KD {parseFloat(product.sale_price).toFixed(3)}
                              </p>
                            </div>
                             <button
                                onClick={(e) => handleAddToCart(e, product)}
                                disabled={product.stock_quantity === 0}
                                className="p-2 bg-gray-900 text-white rounded-full"
                              >
                                <PiShoppingCartThin size={20} />
                              </button>
                         </div>
                      </Link>
                    ))}
                  </div>
               </div>
            )}
          </div>
        )}
</nav>


<ResponsiveMenu open={open} setOpen={setOpen} />
    </>
  );
};

export default Navbar;