import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const ResponsiveMenu = ({ open, setOpen }) => {
  const closeMenu = () => {
    setOpen(false);
  };
  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 50 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-20 left-0 w-full h-screen z-20"
        >
          <div className="text-xl font-semibold uppercase bg-amber-200 text-white py-10 m-6 rounded-3xl">
            <ul className="flex flex-col justify-center items-center gap-10">
              <Link to="/" onClick={closeMenu}>
                Home
              </Link>
              <Link to="/category/power-tools" onClick={closeMenu}>
                Product
              </Link>{" "}
              {/* Example Link */}
              <Link to="/contact" onClick={closeMenu}>
                Contact us
              </Link>
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default ResponsiveMenu;
