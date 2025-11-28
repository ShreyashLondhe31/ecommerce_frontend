import React, { useState, useEffect, useCallback } from "react";
import {
  UserRound,
  ShoppingCart,
  Instagram,
  Contact,
  MapPin,
  Mail,
  MessageCircleMore,
  Home,
  ChevronRight,
  Check, // Added Check icon for "In stock"
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import axios from "axios";
import Sidebar, { SidebarItem } from "../components/Sidebar";
import SidebarCart from "../components/sidebarcart/SidebarCart";
import { SiWhatsapp, SiInstagram } from "react-icons/si";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const carouselSlides = [
  {
    id: "slide1",
    image: `${import.meta.env.BASE_URL}assets/hero_carousel/HC_1.png`,
    alt: "High-quality construction tools on a blueprint",
    title: "Professional Grade Tools",
    subtitle: "Built to last for any project, big or small.",
  },
  {
    id: "slide2",
    image: `${import.meta.env.BASE_URL}assets/hero_carousel/HC_2.png`,
    alt: "A collection of power tools hanging on a wall",
    title: "Unleash Your Power",
    subtitle: "Explore our wide range of cordless power tools.",
  },
  {
    id: "slide3",
    image: `${import.meta.env.BASE_URL}assets/hero_carousel/HC_3.png`,
    alt: "A circular saw cutting through a piece of wood",
    title: "Precision in Every Cut",
    subtitle: "Get the perfect finish with our collection of saws.",
  },
];

const getCategorySrc = (category) => {
  if (category?.image_base64) {
    return `data:image/png;base64,${category.image_base64}`;
  }
  return category?.image_url || "https://via.placeholder.com/150?text=No+Image";
};

const getPrimaryImageSrc = (product) => {
  const placeholder = "https://via.placeholder.com/150";
  if (!product || !product.images || product.images.length === 0) {
    return placeholder;
  }
  
  const primary = product.images.find(img => img.is_primary) || product.images[0];
  if (!primary) return placeholder;

  if (primary.image_base64) {
    return `data:image/png;base64,${primary.image_base64}`;
  }
  if (primary.image_url) {
    return primary.image_url;
  }
  if (product.image) {
    return product.image;
  }
  
  return placeholder;
};

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllBestsellers, setShowAllBestsellers] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [touchEnd, setTouchEnd] = useState(0);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [homepageBrands, setHomepageBrands] = useState([]);
  const minSwipeDistance = 50;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setIsLoggedIn(!!storedUser);
  }, []);

  const { addItem } = useCartStore();

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const imageSrc = getPrimaryImageSrc(product);
    const cartItem = {
      ...product,
      image: imageSrc,
    };
    addItem(cartItem);
    setIsCartOpen(true);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes, brandsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}categories/`),
          axios.get(`${API_BASE_URL}products/?is_best_seller=true`),
          axios.get(`${API_BASE_URL}brands/?show_on_homepage=true`),
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data);
        setHomepageBrands(brandsRes.data);
      } catch (error) {
        console.error("API fetch error:", error);
      }
    };
    fetchData();
  }, []);

  const slidesToRender = [...carouselSlides, carouselSlides[0]];
  const totalSlides = carouselSlides.length;
  
  const goToSlide = useCallback((index) => {
    setIsTransitioning(true);
    setCurrentSlide(index);
  }, []);
  
  const goToNext = useCallback(() => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev + 1);
  }, []);
  
  const goToPrevious = useCallback(() => {
    if (currentSlide === 0) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(totalSlides);
        setTimeout(() => {
          setIsTransitioning(true);
          setCurrentSlide(totalSlides - 1);
        }, 20);
      }, 0);
    } else {
      setIsTransitioning(true);
      setCurrentSlide((prev) => prev - 1);
    }
  }, [currentSlide, totalSlides]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, 4500);
    return () => clearInterval(timer);
  }, [goToNext]);
  
  useEffect(() => {
    if (currentSlide === totalSlides) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(0);
      }, 500);
    }
  }, [currentSlide, totalSlides]);
  
  const handleTouchStart = (e) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart === 0 || touchEnd === 0) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      goToNext();
    } else if (distance < -minSwipeDistance) {
      goToPrevious();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };
  
  const displayedCategories = showAllCategories
    ? categories
    : categories.slice(0, 12);

  const displayedBestsellers = showAllBestsellers
    ? products
    : products.slice(0, 4);

  const brandsToDisplay = homepageBrands.length > 0 
    ? [...homepageBrands, ...homepageBrands, ...homepageBrands, ...homepageBrands] 
    : [];

  return (
    <div className="main min-h-screen w-full bg-gray-50 pt-4  ">
      {/* Hero Section */}
      <div className="hero-section w-full bg-white pb-6">
        <div className="relative w-full px-4 md:px-8">
          {/* Carousel */}
          <div
            className="overflow-hidden rounded-lg shadow-md"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className={`flex ${
                isTransitioning
                  ? "transition-transform duration-500 ease-in-out"
                  : ""
              }`}
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slidesToRender.map((slide, index) => (
                <div key={slide.id + "-" + index} className="min-w-full">
                  <div className="relative w-full h-full">
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="w-full h-full object-cover relative z-1"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-4 text-center">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                        {slide.title}
                      </h2>
                      <p className="text-base md:text-lg mt-2">
                        {slide.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentSlide % totalSlides === index
                    ? "bg-amber-500"
                    : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Brands Scrolling Section */}
      {homepageBrands.length > 0 && (
        <div className="w-full mt-6 md:mt-10">
          <div className="border-2 border-amber-500 h-[70px] overflow-hidden relative bg-white">
            <div className="flex items-center h-full animate-scroll-brands w-max">
              {brandsToDisplay.map((brand, index) => (
                <div
                  key={`${brand.id}-${index}`}
                  className="h-10 mx-6 md:h-14 md:mx-10 flex-shrink-0 flex items-center"
                >
                  <img
                    src={brand.logo_base64 ? `data:image/png;base64,${brand.logo_base64}` : (brand.logo_url || "https://via.placeholder.com/150x60?text=Brand")}
                    alt={brand.name}
                    className="h-full w-auto object-contain"
                    title={brand.name}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Product Categories */}
      <div className="product-categories w-full flex flex-col justify-center items-center mt-10 py-10 bg-white">
        <div className="flex flex-col items-center mb-8 px-4 md:px-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-[1px] w-16 bg-amber-500"></div>
            <h1 className="text-3xl md:text-4xl font-semibold text-center">
              Product Categories
            </h1>
            <div className="h-[1px] w-16 bg-amber-500"></div>
          </div>
        </div>
        
        <div className="category-grid-container w-full max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
            {displayedCategories.map((category, idx) => {
              const categoryName = category.name || "Unnamed Category";
              const categorySlug = categoryName.toLowerCase().replace(/ /g, "-");
              const imageSrc = getCategorySrc(category);

              return (
                <Link
                  to={`/category/${categorySlug}`}
                  key={category.id || idx}
                  className="category-card bg-white rounded-lg border border-gray-200
                            shadow-md p-2 md:p-4 flex flex-col items-center justify-between
                            transform hover:scale-105 hover:shadow-xl hover:border-amber-300
                            transition-all duration-300 h-32 md:h-44"
                >
                  <div className="w-full h-20 md:h-28 flex items-center justify-center mb-1 md:mb-2">
                    <img
                      className="object-contain w-full h-full"
                      src={imageSrc}
                      alt={categoryName}
                    />
                  </div>
                  <h3 className="text-[10px] md:text-sm font-medium text-center text-gray-800 leading-tight line-clamp-2">
                    {categoryName}
                  </h3>
                </Link>
              );
            })}
          </div>
          
          {!showAllCategories && categories.length > 12 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowAllCategories(true)}
                className="px-8 py-3 bg-amber-500 text-white font-semibold 
                           rounded-lg hover:bg-amber-600 transition-colors duration-300
                           shadow-md hover:shadow-lg"
              >
                View All Categories
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Best Sellers - Updated Card Design */}
      <div className="w-full bg-amber-200 flex flex-col justify-center items-center mt-7 py-10">
        <div className="flex flex-col items-center mb-10 px-4 md:px-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-[1px] w-16 bg-white"></div>
            <h1 className="text-3xl md:text-4xl font-semibold text-center">
              Best Sellers
            </h1>
            <div className="h-[1px] w-16 bg-white"></div>
          </div>
        </div>

<div className="w-full px-4 md:px-8 mt-5">
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">

    {products.map((product) => (
      <Link
        key={product.id}
        to={`/product/${product.id}`}
        className="block group"
      >
        <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-lg transition-shadow h-full flex flex-col">

          <div className="relative w-full aspect-[4/5] mb-2 flex items-center justify-center bg-white">
            <img
              src={getPrimaryImageSrc(product)}
              alt={product.name}
              className="object-contain w-full h-full"
            />
          </div>

          <div className="flex flex-col flex-1">
            <h3 className="text-sm font-medium text-gray-900 leading-tight mb-1 line-clamp-2 group-hover:text-green-700 transition-colors">
              {product.name}
            </h3>

            <p className="text-[10px] md:text-xs text-gray-500 mb-1 line-clamp-1">
              {product.category_detail?.name || "General"}
            </p>

            {product.stock_quantity > 0 ? (
              <div className="flex items-center gap-1 text-green-700 text-[10px] md:text-xs font-medium mb-1">
                <Check size={12} /> In stock
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-600 text-[10px] md:text-xs font-medium mb-1">
                Out of stock
              </div>
            )}

            <div className="text-green-700 font-bold text-sm md:text-base mb-2">
              KD {parseFloat(product.sale_price).toFixed(3)}
            </div>
          </div>

          <div className="mt-auto">
            <button
              onClick={(e) => handleAddToCart(e, product)}
              disabled={product.stock_quantity === 0}
              className={`w-full py-2 rounded font-bold text-[10px] md:text-xs tracking-wide transition-colors ${
                product.stock_quantity > 0
                  ? "bg-[#5cae6e] hover:bg-[#4d945d] text-white shadow-sm"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              {product.stock_quantity > 0 ? "ADD TO CART" : "OUT OF STOCK"}
            </button>
          </div>

        </div>
      </Link>
    ))}

  </div>
</div>

      </div>

      {/* Footer */}
      <footer className="w-full bg-amber-200 mt-7 py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="h-24 flex items-center mb-4">
              <img
                src={`${import.meta.env.BASE_URL}assets/logo/Logo.png`}
                alt="Company Logo"
                className="h-full w-auto object-contain"
              />
            </Link>
            <h2 className="text-xl md:text-2xl font-bold text-amber-900 mb-2">
              Hakimi Establishment
            </h2>
            <p className="text-amber-900 text-center md:text-left mt-2">
              Your trusted partner for quality tools and hardware.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-12 bg-amber-500"></div>
              <h1 className="text-2xl font-semibold">Contact Us</h1>
              <div className="h-[1px] w-12 bg-amber-500"></div>
            </div>
            <ul className="flex flex-wrap gap-6 text-lg justify-center md:justify-start">
              <li className="hover:text-amber-700 cursor-pointer transition-colors">Email</li>
              <li className="hover:text-amber-700 cursor-pointer transition-colors">Whatsapp</li>
              <li className="hover:text-amber-700 cursor-pointer transition-colors">Facebook</li>
              <li className="hover:text-amber-700 cursor-pointer transition-colors">X</li>
            </ul>
          </div>
        </div>
      </footer>
      
      {/* Mobile Sidebar Trigger */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="fixed top-1/2 -translate-y-1/2 left-0 z-10 
                   p-2 bg-white rounded-r-lg shadow-md 
                   md:hidden"
        aria-label="Open sidebar"
      >
        <ChevronRight size={24} />
      </button>
      
      {/* Mobile Sidebar Drawer */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
        />
      )}
      
      <aside>
        <Sidebar isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen}>
          <SidebarItem
            icon={<SiWhatsapp size={20} className="text-[#25D366]" />}
            text="Whatsapp"
          />
          <SidebarItem
            icon={<SiInstagram size={20} className="text-[#E1306C]" />}
            text="Instagram"
          />
          <SidebarItem icon={<Contact size={20} />} text="Contact" />
          <SidebarItem icon={<MapPin size={20} />} text="Location" />
          <SidebarItem icon={<Mail size={20} />} text="Email" />
        </Sidebar>
      </aside>
      
      {/* Sidebar Cart */}
      <SidebarCart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
};

export default HomePage;