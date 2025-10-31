import { Link } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { CiSearch } from "react-icons/ci";
import { PiShoppingCartThin } from "react-icons/pi";
import { MdMenu } from "react-icons/md";
import { IoClose } from "react-icons/io5"; // 1. Import the close icon
import ResponsiveMenu from "./ResponsiveMenu";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  // 2. Add state for the search bar
  const [showSearch, setShowSearch] = useState(false);

  const { items } = useCartStore();
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <nav className="w-full">
        <div className="flex items-center justify-between py-2 px-7 shadow-md">
          {/* Logo Section */}
          <div className="h-2 max-w-26 mt-3 flex items-center gap-2 font-bold py-8">
            <img src="/assets/logo/Logo.png" alt="" />
          </div>

          {/* Menu Section */}
          <div className="hidden md:block">
            <ul className="flex items-center gap-6 font-medium text-lg">
              <Link to="/">Home</Link>
              <Link to="/category/power-tools">Product</Link>{" "}
              {/* Example Link */}
              <Link to="/contact">Contact us</Link>
            </ul>
          </div>

          {/* Icons Section */}
          <div className="flex items-center gap-1">
            {showSearch ? (
              // 3. Show the search bar when showSearch is true
              <div className="flex items-center gap-2 animate-fadeIn">
                <input
                  type="text"
                  placeholder="Search..."
                  className="px-3 py-1.5 border rounded-full focus:outline-none focus:border-amber-500 transition-all duration-300 w-48"
                  autoFocus
                />
                <button
                  onClick={() => setShowSearch(false)}
                  className="text-2xl hover:bg-amber-200 p-2 rounded-full"
                >
                  <IoClose size={24} />
                </button>
              </div>
            ) : (
              // 4. Show the default icons when showSearch is false
              <>
                <button
                  onClick={() => setShowSearch(true)}
                  className="text-2xl hover:bg-amber-200 hover:text-gray-700 duration-200 p-2 mr-4 rounded-full"
                >
                  <CiSearch className="text-2xl" />
                </button>

                {/* 5. Cart button is now a Link to /cart with a badge */}
                <Link
                  to="/cart"
                  className="relative text-2xl hover:bg-amber-200 hover:text-gray-700 duration-200 p-2 mr-4 rounded-full"
                >
                  <PiShoppingCartThin className="text-2xl" />
                  {totalItems > 0 && (
                    <span
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs 
                                     rounded-full h-5 w-5 flex items-center justify-center"
                    >
                      {totalItems}
                    </span>
                  )}
                </Link>

                <button className="hover:bg-amber-200 text-black font-semibold hover:text-white rounded-md border-2 px-6 py-2 duration-200 ">
                  Login
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger Menu Section */}
          <div className="md:hidden" onClick={() => setOpen(!open)}>
            <MdMenu className="text-4xl" />
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar section */}
      <ResponsiveMenu open={open} setOpen={setOpen} />
    </>
  );
};
export default Navbar;
