import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AnnouncementBar = () => {
  const [displayText, setDisplayText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/site-setting/`);
        
        if (response.data && response.data.length > 0) {
          const settings = response.data[0];
          
          const texts = [
            settings.scrolling_text_1,
            settings.scrolling_text_2,
            settings.scrolling_text_3
          ].filter(text => text && text.trim() !== "");

          if (texts.length > 0) {
            setDisplayText(texts.join(" | "));
          } else {
            setDisplayText("Welcome to our store!");
          }
        } else {
            setDisplayText("Welcome to our store! | Great deals available daily.");
        }
      } catch (error) {
        console.error("Failed to fetch site settings:", error);
        setDisplayText("Welcome to our store!");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) return <div className="h-10 w-full bg-black mt-16 md:mt-[68px]" />;

  return (
    <div className="w-full mt-16 md:mt-[68px] z-40 bg-black">
      <div className="relative max-w-screen-2xl mx-auto">
        <div
          className="overflow-hidden whitespace-nowrap py-3"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, #000 20px, #000 calc(100% - 20px), transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, #000 20px, #000 calc(100% - 20px), transparent)",
          }}
        >
          <div className="flex items-center">
            {/* Block 1 */}
            <div className="animate-[scroll_25s_linear_infinite] flex items-center shrink-0">
              <span className="text-white text-sm md:text-base font-inter font-medium tracking-wide px-4">
                {displayText}
              </span>
              <span className="text-white text-sm md:text-base font-inter font-medium tracking-wide px-4">
                |
              </span>
            </div>

            {/* Block 2 (Duplicate for seamless scroll) */}
            <div className="animate-[scroll_25s_linear_infinite] flex items-center shrink-0" aria-hidden="true">
              <span className="text-white text-sm md:text-base font-inter font-medium tracking-wide px-4">
                {displayText}
              </span>
              <span className="text-white text-sm md:text-base font-inter font-medium tracking-wide px-4">
                |
              </span>
            </div>

            {/* Block 3 (Duplicate for extra width) */}
            <div className="animate-[scroll_25s_linear_infinite] flex items-center shrink-0" aria-hidden="true">
              <span className="text-white text-sm md:text-base font-inter font-medium tracking-wide px-4">
                {displayText}
              </span>
              <span className="text-white text-sm md:text-base font-inter font-medium tracking-wide px-4">
                |
              </span>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;