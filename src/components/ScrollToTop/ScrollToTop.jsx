import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  // This hook listens for changes in the URL
  const { pathname } = useLocation();

  useEffect(() => {
    // Instantly scrolls the window to the very top (0, 0)
    window.scrollTo(0, 0);
  }, [pathname]); // Runs every time 'pathname' changes

  return null; // This component does not render anything on screen
};

export default ScrollToTop;