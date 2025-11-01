import { Link } from "react-router-dom";
import { useState } from "react";
import { useCartStore } from "../../store/cartStore";
import { CiSearch } from "react-icons/ci";
import { PiShoppingCartThin } from "react-icons/pi";
import { MdMenu } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import ResponsiveMenu from "./ResponsiveMenu";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { items } = useCartStore();
  
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <nav className="w-full bg-amber-200 sticky top-12 z-40 shadow-sm">
        <div className="flex items-center justify-between py-4 px-4 md:px-7">
          {/* Logo */}
          <Link to="/" className="h-12 flex items-center">
            <img 
              src={`${import.meta.env.BASE_URL}assets/logo/Logo.png`}
              className="h-full w-auto object-contain" 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <ul className="flex items-center gap-8 font-medium">
              <li>
                <Link to="/" 
                  className="text-amber-900 hover:text-amber-700 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link to="/category/power-tools" 
                  className="text-amber-900 hover:text-amber-700 transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link to="/contact" 
                  className="text-amber-900 hover:text-amber-700 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {showSearch ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-48 px-4 py-2 bg-amber-100/50 rounded-full 
                           text-amber-900 placeholder:text-amber-700
                           focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-amber-100 transition-all"
                  autoFocus
                />
                <button
                  onClick={() => setShowSearch(false)}
                  className="p-2 hover:bg-amber-200 rounded-full transition-colors"
                  aria-label="Close search"
                >
                  <IoClose size={24} className="text-amber-900" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-2 hover:bg-amber-200 rounded-full transition-colors"
                  aria-label="Search"
                >
                  <CiSearch size={24} className="text-amber-900" />
                </button>

                <Link
                  to="/cart"
                  className="relative p-2 hover:bg-amber-200 rounded-full transition-colors"
                  aria-label="Shopping cart"
                >
                  <PiShoppingCartThin size={24} className="text-amber-900" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs
                                   rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>

                <button className="ml-2 px-4 py-2 bg-amber-100 text-amber-900
                                font-medium rounded-lg hover:bg-amber-900 hover:text-amber-100 
                                transition-colors">
                  Login
                </button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              <MdMenu size={28} />
            </button>
          </div>
        </div>
      </nav>
      
      <ResponsiveMenu open={open} setOpen={setOpen} />
    </>
  );
};

export default Navbar;
