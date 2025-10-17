import { UserRound, ShoppingCart } from "lucide-react";

const Navbar = () => {
  return (
    <div className="navbar h-20 w-full flex justify-between items-center text-2xl font-bold bg-slate-200">
      <nav className="flex justify-around items-center w-full">
        <img src="" alt="logo" />
        <ul className="flex justify-center items-center gap-10">
          <li>Home</li>
          <li>Products</li>
          <li>Contact Us</li>
        </ul>
        <input
          type="text"
          placeholder="Search"
          className="px-3 py-1 border rounded-2xl"
        />
        <div className="Icons flex justify-center items-center gap-5 ml-10 mr-10">
          <UserRound />
          <ShoppingCart />
        </div>
      </nav>
    </div>
  );
};
export default Navbar;
