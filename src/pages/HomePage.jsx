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
} from "lucide-react";
import Sidebar, { SidebarItem } from "../components/Sidebar";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import axios from "axios";

const response = await axios.get("").then((res) => console.log(res.data));
// Data constants
const productCategories = [
  {
    name: "Hammers",
    image:
      "https://imgs.search.brave.com/N438sbyB9BmT622YHVlELFgzLt0P7Bk6mNv4kbB4oTA/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjE3TjktOTY3bkwu/anBn",
  },
  {
    name: "Pliers",
    image:
      "https://imgs.search.brave.com/7E9V30nTpm7jJV7fKfbqftvexzXWZuXGpFKSlwffc1w/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzE2LzYxLzIxLzMw/LzM2MF9GXzE2NjEy/MTMwNDlfbXJkMzdO/azlGMWJrUjNQM2ky/T3hjRGs0ZFpsNnZy/VjYuanBn",
  },
  {
    name: "Power Tools",
    image:
      "https://images.pexels.com/photos/843226/pexels-photo-843226.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    name: "Drill Bits",
    image:
      "https://imgs.search.brave.com/MmWbGqfHlJFkuUbWtoRmybcUSbsr3M1t_2e8EGuDmIY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuZnJlZWltYWdl/cy5jb20vdmFyaWFu/dHMvZkdLbmlqMmFK/ZXVSZ2R5YVJCZ042/dzh3LzYyNGYwZGMx/ZGZmOWJkY2NhYjAz/MmY5M2MzM2U3OWRl/Nzg0ODE3NzBlNzll/MjFkM2IwNDY5ZGFm/NTFmMDI3OTc",
  },
  {
    name: "Screwdrivers",
    image:
      "https://imgs.search.brave.com/0mCgkYSY6OtSpW1ubuBE2XluNn38uVjZsBQIs0gW_ts/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNjM4/Nzg1NzkwL3Bob3Rv/L2NvbG9yZnVsLXNj/cmV3ZHJpdmVycy1v/bi1hLXdoaXRlLWJh/Y2tncm91bmQtaXNv/bGF0aW9uLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1ab2Ra/Qnp2Rk1QTHVhSVJF/REpkSWl2ZHBsNlJm/QnQxYy1NQnRXbGFk/NW1NPQ",
  },
  {
    name: "Wrenches",
    image:
      "https://imgs.search.brave.com/JvQWr7DCdlWq2EWzONBLJdDvJ0i4Nda4jPVKNDjATDM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWM4LmRlcG9zaXRw/aG90b3MuY29tLzEw/MTQ2ODAvMTAwNC9p/LzQ1MC9kZXBvc2l0/cGhvdG9zXzEwMDQ5/MjM1LXN0b2NrLXBo/b3RvLXdyZW5jaGVz/LmpwZw",
  },
  {
    name: "Saws",
    image:
      "https://imgs.search.brave.com/eVqIQmorS0GDQQN79dPlH6RdxpSe6Fu-B-IApC36CBw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/eW91dHViZS5jb20v/dmkvRXpkMHJmZ2JR/SzgvaHFkZWZhdWx0/LmpwZw",
  },
  {
    name: "Measuring Tapes",
    image:
      "https://imgs.search.brave.com/LBGbtK9fK9Vxp-F84G4bciArJJGPcPJgA_2TVUJz-vw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAyLzY3LzEzLzY4/LzM2MF9GXzI2NzEz/NjgzOV9lcUdGV2E3/bXpmNzlQZXEwWU44/Vjk4SE1YcUhielh3/VC5qcGc",
  },
  {
    name: "Levels",
    image:
      "https://imgs.search.brave.com/11JeYUltOk-c0-cIH82Vi8pusRN7kql7jQjB0_OA6H8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFYT3daelMxa0wu/anBn",
  },
];

const bestSellers = [
  {
    id: "bs001",
    name: "Pro-Grade 20V Cordless Drill",
    price: 40.04,
    rating: 4.8,
    reviews: 2450,
    category: "Power Tools",
    image:
      "https://imgs.search.brave.com/DQqv3TKLQ69L88lkb1gDQ8FKq-Y2C1JWSw6XAvMo6VQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFOZlZxZ0hnYUwu/anBn",
  },
  {
    id: "bs002",
    name: "Mechanic's 52-Piece Wrench Set",
    price: 27.72,
    rating: 4.7,
    reviews: 1890,
    category: "Wrenches",
    image:
      "https://imgs.search.brave.com/Jj1QKhB_HaG_0lIfd2AvYVOFxkCWMnRpmA5805MF_TU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4x/MS5iaWdjb21tZXJj/ZS5jb20vcy05dDR3/azgvaW1hZ2VzL3N0/ZW5jaWwvNjAweDYw/MC9wcm9kdWN0cy8x/NTA0LzgzMzA4L1dS/MDIwMDEyXzFfXzg3/NTI5LjE3NTQ2Nzg4/NjAuanBnP2M9NA",
  },
  {
    id: "bs003",
    name: "Titan 16 oz. Claw Hammer",
    price: 7.7,
    rating: 4.9,
    reviews: 3120,
    category: "Hammers",
    image:
      "https://imgs.search.brave.com/Kq50-hKWoRCZhlwdcQk13JOsIAg-Yp_TPvhWQYq_njY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMtbmEuc3NsLWlt/YWdlcy1hbWF6b24u/Y29tL2ltYWdlcy9J/LzcxSEZOdDBqWldM/LmpwZw",
  },
  {
    id: "bs004",
    name: "Precision 5-Piece Pliers Set",
    price: 10.78,
    rating: 4.6,
    reviews: 985,
    category: "Pliers",
    image:
      "https://imgs.search.brave.com/TP1wUjqLyEtqwnlea7ZeeH_NAR_eAbQOBItVuntwWlk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NTFZVkVzalZwbUwu/anBn",
  },
  {
    id: "bs005",
    name: "Digital Laser Measure (165 ft)",
    price: 15.38,
    rating: 4.7,
    reviews: 1243,
    category: "Measuring Tapes",
    image:
      "https://imgs.search.brave.com/-hqqPvihtKgQa77dMlfVlENhTZLUUeo555e8Z3FwWyg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFyMldYZXhtZUwu/anBn",
  },
  {
    id: "bs006",
    name: "PowerCut 7-1/4 Inch Circular Saw",
    price: 45.9,
    rating: 4.7,
    reviews: 1500,
    category: "Saws",
    image:
      "https://imgs.search.brave.com/0Sz-RQxiMQNpI_4lr8LbGsl3KRagksPQWAkMK1-v7QM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly91ZWVz/aG9wLmx5MjAwLWNk/bi5jb20vdV9maWxl/L1VQQkQvVVBCRDE5/MS8yNTA0LzE0L3By/b2R1Y3RzLzEuanBn/P3gtb3NzLXByb2Nl/c3M9aW1hZ2UvcXVh/bGl0eSxxXzEwMC9y/ZXNpemUsbV9sZml0/LGhfMjQwLHdfMjQw",
  },
  {
    id: "bs007",
    name: "Magnetic Tip 10-Piece Screwdriver Set",
    price: 9.24,
    rating: 4.8,
    reviews: 2200,
    category: "Screwdrivers",
    image:
      "https://imgs.search.brave.com/xRfxAvTq1QOQj85WJ-9ep_GKrvhRu3gHABQr8uQYVJc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NDFhMkdmQVVBaUwu/anBn",
  },
];

const carouselSlides = [
  {
    id: "slide1",
    image: "/assets/hero_carousel/HC_1.png",
    alt: "High-quality construction tools on a blueprint",
    title: "Professional Grade Tools",
    subtitle: "Built to last for any project, big or small.",
  },
  {
    id: "slide2",
    image: "/assets/hero_carousel/HC_2.png",
    alt: "A collection of power tools hanging on a wall",
    title: "Unleash Your Power",
    subtitle: "Explore our wide range of cordless power tools.",
  },
  {
    id: "slide3",
    image: "/assets/hero_carousel/HC_3.png",
    alt: "A circular saw cutting through a piece of wood",
    title: "Precision in Every Cut",
    subtitle: "Get the perfect finish with our collection of saws.",
  },
];
// End of data constants

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllBestsellers, setShowAllBestsellers] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const minSwipeDistance = 50;

  const { addItem } = useCartStore();

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
    ? productCategories
    : productCategories.slice(0, 4);

  const displayedBestsellers = showAllBestsellers
    ? bestSellers
    : bestSellers.slice(0, 4);

  return (
    <div className="main min-h-screen w-full">
      {/* Hero Section - Custom Carousel */}
      <div className="hero-section w-full py-6 bg-white">
        <div className="relative w-[70%] mx-auto">
          {/* Carousel Container with Swipe Handlers */}
          <div
            className="overflow-hidden shadow-md rounded-lg"
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

          {/* Dots Indicator */}
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

      {/* Marquee Section is unchanged */}
      <div className="w-full mt-6 md:mt-10">
        <marquee
          className="flex text-3xl font-bold bg-amber-200"
          scrollamount="15"
          height="70px"
        >
          <div className="flex items-center h-full">
            <img
              src="/assets/brand_images/Brand_Image1.jpg"
              alt="Brand 1"
              className="h-10 mx-4 md:h-16 md:mx-8"
            />
            <img
              src="/assets/brand_images/Brand_Image2.jpg"
              alt="Brand 2"
              className="h-10 mx-4 md:h-16 md:mx-8"
            />
            <img
              src="/assets/brand_images/Brand_Image3.jpg"
              alt="Brand 3"
              className="h-10 mx-4 md:h-16 md:mx-8"
            />
          </div>
        </marquee>
      </div>

      {/* Product Categories Section */}
      <div className="product-categories w-full flex flex-col justify-center items-center mt-10 py-10 px-4 md:px-8">
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-[1px] w-16 bg-amber-500"></div>
            <h1 className="text-3xl md:text-4xl font-semibold text-center">
              Product Categories
            </h1>
            <div className="h-[1px] w-16 bg-amber-500"></div>
          </div>
        </div>
        <div className="category-container grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-5 w-full max-w-6xl">
          {displayedCategories.map((category, idx) => {
            const categorySlug = category.name.toLowerCase().replace(/ /g, "-");
            return (
              <Link
                to={`/category/${categorySlug}`}
                key={idx}
                className="container-card w-full flex flex-col justify-center 
                           items-center bg-white rounded-2xl shadow-sm 
                           p-3 md:p-4 h-56 md:h-64 
                           transform hover:scale-105 transition-transform duration-300"
              >
                <img
                  className="object-contain w-full rounded-lg p-2
                             h-32 md:h-40 bg-gray-50"
                  src={category.image}
                  alt={category.name}
                />
                <h1
                  // --- 3. STYLING CHANGES ---
                  className="text-sm md:text-base font-semibold mt-3 text-center"
                >
                  {category.name}
                </h1>
              </Link>
            );
          })}
        </div>
        {productCategories.length > 4 && (
          <div className="w-full flex justify-center mt-8">
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="px-6 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors"
            >
              {showAllCategories ? "See less" : "See more"}
            </button>
          </div>
        )}
      </div>

      {/* Best Seller section */}
      <div className="w-full bg-amber-200 flex flex-col justify-center items-center mt-7 py-10 px-4 md:px-8">
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-[1px] w-16 bg-white"></div>
            <h1 className="text-3xl md:text-4xl font-semibold text-center">
              BestSellers
            </h1>
            <div className="h-[1px] w-16 bg-white"></div>
          </div>
        </div>
        <div className="productCard-holder grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-5 w-full max-w-6xl">
          {displayedBestsellers.map((product) => (
            <div
              key={product.id}
              className="container-card w-full flex flex-col justify-between 
                         bg-white rounded-2xl shadow-sm 
                         p-3 md:p-4 h-64 md:h-72"
            >
              <div>
                <img
                  className="object-contain w-full rounded-lg p-2
                             h-28 md:h-32 bg-gray-50"
                  src={product.image}
                  alt={product.name}
                />
                <h1
                  // --- 3. STYLING CHANGES ---
                  className="text-sm font-semibold mt-3 truncate"
                >
                  {product.name}
                </h1>
                <p
                  // --- 4. STYLING CHANGES ---
                  className="text-base md:text-lg font-bold text-amber-600 mt-1"
                >
                  {product.price.toFixed(3)} د.ك
                </p>
              </div>
              <button
                onClick={() => addItem(product)}
                // --- 5. STYLING CHANGES ---
                className="w-full mt-2 px-3 py-1.5 md:px-4 md:py-2 
                           bg-amber-500 text-white 
                           text-xs md:text-sm font-semibold rounded-lg hover:bg-amber-600"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
        {bestSellers.length > 4 && (
          <div className="w-full flex justify-center mt-8">
            <button
              onClick={() => setShowAllBestsellers(!showAllBestsellers)}
              className="px-6 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors"
            >
              {showAllBestsellers ? "See less" : "See more"}
            </button>
          </div>
        )}
      </div>

      {/* Footer and Sidebar sections */}
      <footer className="w-full bg-amber-200 mt-7 py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo Section */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="h-24 flex items-center mb-4">
              <img 
                src="/assets/logo/Logo.png" 
                alt="Company Logo"
                className="h-full w-auto object-contain" 
              />
            </Link>
            <p className="text-amber-900 text-center md:text-left mt-2">
              Your trusted partner for quality tools and hardware.
            </p>
          </div>

          {/* Three columns shifted right */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-12 bg-amber-500"></div>
              <h1 className="text-2xl font-semibold">Contact Us</h1>
              <div className="h-[1px] w-12 bg-amber-500"></div>
            </div>
            <ul className="text-lg space-y-3 text-center md:text-left">
              <li className="hover:text-amber-700 cursor-pointer transition-colors">Email</li>
              <li className="hover:text-amber-700 cursor-pointer transition-colors">Whatsapp</li>
              <li className="hover:text-amber-700 cursor-pointer transition-colors">Facebook</li>
              <li className="hover:text-amber-700 cursor-pointer transition-colors">X</li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-12 bg-amber-500"></div>
              <h1 className="text-2xl font-semibold">Information</h1>
              <div className="h-[1px] w-12 bg-amber-500"></div>
            </div>
            <ul className="text-lg space-y-3 text-center md:text-left">
              <li className="hover:text-amber-700 cursor-pointer transition-colors">About us</li>
              <li className="hover:text-amber-700 cursor-pointer transition-colors">Discounts</li>
              <li className="hover:text-amber-700 cursor-pointer transition-colors">Latest news</li>
              <li className="hover:text-amber-700 cursor-pointer transition-colors">New Products</li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-12 bg-amber-500"></div>
              <h1 className="text-2xl font-semibold">Policies</h1>
              <div className="h-[1px] w-12 bg-amber-500"></div>
            </div>
            <ul className="text-lg space-y-3 text-center md:text-left">
              <li className="hover:text-amber-700 cursor-pointer transition-colors">Policy 1</li>
              <li className="hover:text-amber-700 cursor-pointer transition-colors">Policy 2</li>
              <li className="hover:text-amber-700 cursor-pointer transition-colors">Policy 3</li>
              <li className="hover:text-amber-700 cursor-pointer transition-colors">Policy 4</li>
            </ul>
          </div>
      </div>

      <button
        onClick={() => setIsDrawerOpen(true)}
        className="fixed top-1/2 -translate-y-1/2 left-0 z-10 
                   p-2 bg-white rounded-r-lg shadow-md 
                   md:hidden"
        aria-label="Open sidebar"
      >
        <ChevronRight size={24} />
      </button>

      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
        />
      )}

      <aside>
        <Sidebar isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen}>
          <SidebarItem icon={<MessageCircleMore size={20} />} text="Whatsapp" />
          <SidebarItem icon={<Instagram size={20} />} text="Instagram" />
          <SidebarItem icon={<Contact size={20} />} text="Contact" />
          <SidebarItem icon={<MapPin size={20} />} text="Location" />
          <SidebarItem icon={<Mail size={20} />} text="Email" />
        </Sidebar>
      </aside>
      </footer>
    </div>
  );
};

export default HomePage;
