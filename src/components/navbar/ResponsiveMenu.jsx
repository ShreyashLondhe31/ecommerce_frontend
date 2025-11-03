import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const menuLinks = [
  { path: "/", label: "Home" },
  { path: "/category/power-tools", label: "Products" },
  { path: "/contact", label: "Contact" },
  { path: "/login", label: "Login" },
];

const ResponsiveMenu = ({ open, setOpen }) => {
  const closeMenu = () => setOpen(false);

  return (
    <AnimatePresence mode="wait">
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-45"
            onClick={closeMenu}
          />

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed top-20 left-4 right-4 z-45"
          >
            <nav className="bg-white shadow-lg rounded-xl overflow-hidden">
              <ul className="flex flex-col gap-2">
                {menuLinks.map(({ path, label }) => (
                  <li key={path}>
                    <Link
                      to={path}
                      onClick={closeMenu}
                      className="block px-6 py-4 text-lg font-medium text-gray-700
                               hover:bg-amber-50 hover:text-amber-600 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ResponsiveMenu;
