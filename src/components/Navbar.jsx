import React from "react";
import { Link } from "react-router-dom";
import { UserRound, ShoppingCart } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { BsCart4 } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";

const Navbar = () => {
  // 3. Get the items from the store
  const { items } = useCartStore();

  // 4. Calculate the total quantity of all items in the cart
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="navbar h-20 w-full flex justify-between items-center text-lg font-bold bg-slate-200">
      <nav className="flex justify-around items-center w-full">
        <Link to="/">
          <img
            className="h-22 m-2 p-3"
            src="src/assets/logo/Logo.png"
            alt="logo"
          />
        </Link>
        <ul className="flex justify-center items-center gap-10">
          <Link to="/">Home</Link>
          <Link to="/category/power-tools">Products</Link> {/* Example Link */}
          <li>Contact Us</li>
        </ul>

        <div className="Icons flex justify-center items-center gap-5 ml-10 mr-10">
          <input
            type="text"
            placeholder="Search"
            className="px-3 py-1 border border-black rounded-md"
          />

          <FaRegUserCircle size={23} />
          {/* 5. Update the cart link and add a badge */}
          <Link to="/cart" className="relative">
            <BsCart4 size={23} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </div>
  );
};
export default Navbar;
