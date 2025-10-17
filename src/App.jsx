import React, { useState, useEffect } from "react";
import {
  UserRound,
  ShoppingCart,
  Instagram,
  Contact,
  MapPin,
  Mail,
  MessageCircleMore,
} from "lucide-react";
import Sidebar, { SidebarItem } from "./components/Sidebar";
import Navbar from "./components/Navbar";
import AnnouncementBar from "./components/AnnouncementBar";

const productCategories = [
  {
    name: "Hammers",
    image:
      "https://imgs.search.brave.com/cMqKs-WfbjZRjPusr1piLBtt8H1E-F3gHzsgYG9NgxE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFPWmI5bHcxTkwu/anBn",
  },
  {
    name: "Pliers",
    image:
      "https://images.pexels.com/photos/843226/pexels-photo-843226.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    name: "Power Tools",
    image:
      "https://images.pexels.com/photos/175039/pexels-photo-175039.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    name: "Drill Bits",
    image:
      "https://images.pexels.com/photos/5995839/pexels-photo-5995839.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    name: "Screwdrivers",
    image:
      "https://imgs.search.brave.com/HRkUMUXBhyzOTTo79LY3SQaM6oJUQUJsYJnSgikg6UE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNjM4/Nzg1NzkwL3Bob3Rv/L2NvbG9yZnVsLXNj/cmV3ZHJpdmVycy1v/bi1hLXdoaXRlLWJh/Y2tncm91bmQtaXNv/bGF0aW9uLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1ab2Ra/Qnp2Rk1QTHVhSVJF/REpkSWl2ZHBsNlJm/QnQxYy1NQnRXbGFk/NW1NPQ",
  },
  {
    name: "Wrenches",
    image:
      "https://images.pexels.com/photos/4846455/pexels-photo-4846455.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    name: "Saws",
    image:
      "https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    name: "Measuring Tapes",
    image:
      "https://images.pexels.com/photos/7991275/pexels-photo-7991275.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    name: "Levels",
    image:
      "https://images.pexels.com/photos/8134907/pexels-photo-8134907.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

const bestSellers = [
  {
    id: "bs001",
    name: "Pro-Grade 20V Cordless Drill",
    price: 129.99,
    rating: 4.8,
    reviews: 2450,
    category: "Power Tools",
    image:
      "https://images.pexels.com/photos/1249603/pexels-photo-1249603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "bs002",
    name: "Mechanic's 52-Piece Wrench Set",
    price: 89.99,
    rating: 4.7,
    reviews: 1890,
    category: "Wrenches",
    image:
      "https://images.pexels.com/photos/1402930/pexels-photo-1402930.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "bs003",
    name: "Titan 16 oz. Claw Hammer",
    price: 24.99,
    rating: 4.9,
    reviews: 3120,
    category: "Hammers",
    image:
      "https://images.pexels.com/photos/8957088/pexels-photo-8957088.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "bs004",
    name: "Precision 5-Piece Pliers Set",
    price: 34.99,
    rating: 4.6,
    reviews: 985,
    category: "Pliers",
    image:
      "https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "bs005",
    name: "Digital Laser Measure (165 ft)",
    price: 49.95,
    rating: 4.7,
    reviews: 1243,
    category: "Measuring Tapes",
    image:
      "https://images.pexels.com/photos/7991477/pexels-photo-7991477.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "bs006",
    name: "PowerCut 7-1/4 Inch Circular Saw",
    price: 149.0,
    rating: 4.7,
    reviews: 1500,
    category: "Saws",
    image:
      "https://images.pexels.com/photos/8005396/pexels-photo-8005396.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    id: "bs007",
    name: "Magnetic Tip 10-Piece Screwdriver Set",
    price: 29.99,
    rating: 4.8,
    reviews: 2200,
    category: "Screwdrivers",
    image:
      "https://images.pexels.com/photos/1239859/pexels-photo-1239859.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

const App = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const totalSlides = 5;

  // Auto-advance carousel every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCurrentSlide((prev) => prev + 1);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  // Handle the infinite loop reset
  useEffect(() => {
    if (currentSlide === totalSlides) {
      // After transition completes, instantly reset to first slide without transition
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(0);
      }, 500); // Wait for transition to complete (500ms)
    }
  }, [currentSlide]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  return (
    <div className="main min-h-screen w-full">
      {/* AnnouncementBar */}
      <AnnouncementBar />
      {/* Navbar */}
      <Navbar />

      {/* Hero Section - Custom Carousel */}
      <div className="hero-section w-full px-7 py-10">
        <div className="relative w-full">
          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div
              className={`flex ${
                isTransitioning
                  ? "transition-transform duration-500 ease-in-out"
                  : ""
              }`}
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides + 1 }).map((_, index) => (
                <div key={index} className="min-w-full">
                  <div className="bg-white shadow-lg border-2 border-gray-200">
                    <div className="flex aspect-square items-center justify-center p-6">
                      <span className="text-6xl font-semibold text-gray-700">
                        {index === totalSlides ? 1 : index + 1}
                      </span>
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

      {/* Bottom Marquee - Now flows naturally below hero */}
      <div className="w-full mt-7">
        <marquee
          className="text-5xl font-bold bg-amber-200 flex justify-center items-center"
          scrollamount="20"
          height="70px"
        >
          TCC TCC
        </marquee>
      </div>

      {/* Product Categories Section */}
      <div className="product-categories h-full w-full flex flex-col justify-center items-center mt-7">
        <h1 className="text-5xl font-semibold">Product Categories</h1>
        <div className="category-container flex flex-wrap justify-center items-center mt-5">
          {productCategories.map((category, idx) => (
            <div
              key={idx}
              className="container-card h-60 w-60 flex flex-col justify-center items-center border-2 border-gray-200 rounded-2xl shadow-lg m-5 p-5"
            >
              <img
                className="object-contain h-40 w-50 border-2 border-gray-200 rounded-lg p-2"
                src={category.image}
                alt={category.name}
              />

              <h1 className="text-lg font-bold">{category.name}</h1>
            </div>
          ))}
        </div>
      </div>

      {/* Best Seller section */}
      <div className="h-full w-full bg-amber-200 flex flex-col justify-center items-center mt-7 py-7">
        <h1 className="text-5xl font-semibold">BestSeller</h1>
        <div className="productCard-holder flex flex-wrap justify-center items-center mt-5">
          {bestSellers.map((product, idx) => (
            <div
              key={idx}
              className="container-card h-60 w-60 flex flex-col justify-center items-center border-2 bg-white border-gray-200 rounded-2xl shadow-lg m-5 p-5"
            >
              <img
                className="object-contain h-40 w-50 border-2 border-gray-200 rounded-lg p-2"
                src={product.image}
                alt={product.name}
              />

              <h1 className="text-lg font-bold">{product.name}</h1>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="h-full w-full bg-amber-200 flex justify-around items-center mt-7 py-7">
        <div className="h-[200px] w-[300px] contactUs border-2 border-gray-200 rounded-2xl shadow-lg p-5 flex flex-col justify-center items-center">
          <h1 className="text-5xl font-semibold">Contact Us</h1>
          <ul className="text-xl">
            <li>Email</li>
            <li>Whatsapp</li>
            <li>Facebook</li>
            <li>X</li>
          </ul>
        </div>
        <div className="h-[200px] w-[300px] information border-2 border-gray-200 rounded-2xl shadow-lg p-5 flex flex-col justify-center items-center">
          <h1 className="text-5xl font-semibold">Information</h1>
          <ul className="text-xl">
            <li>About us</li>
            <li>Discounts</li>
            <li>Latest news</li>
            <li>New Products</li>
          </ul>
        </div>
        <div className="h-[200px] w-[300px] policies border-2 border-gray-200 rounded-2xl shadow-lg p-5 flex flex-col justify-center items-center">
          <h1 className="text-5xl font-semibold">Policies</h1>
          <ul className="text-xl">
            <li>Policy 1</li>
            <li>Policy 2</li>
            <li>Policy 3</li>
            <li>Policy 4</li>
          </ul>
        </div>
      </div>

      <aside>
        <Sidebar>
          <SidebarItem icon={<MessageCircleMore size={20} />} text="Whatsapp" />
          <SidebarItem icon={<Instagram size={20} />} text="Instgram" />
          <SidebarItem icon={<Contact size={20} />} text="Contact" />
          <SidebarItem icon={<MapPin size={20} />} text="Location" />
          <SidebarItem icon={<Mail size={20} />} text="Email" />
        </Sidebar>
      </aside>
    </div>
  );
};

export default App;
