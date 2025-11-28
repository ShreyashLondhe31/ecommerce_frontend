import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AnnouncementBar = () => {
  const [displayText, setDisplayText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}site-setting/`);

        if (response.data && response.data.length > 0) {
          const settings = response.data[0];

          const texts = [
            settings.scrolling_text_1,
            settings.scrolling_text_2,
            settings.scrolling_text_3,
          ].filter((text) => text && text.trim() !== "");

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

  if (loading)
    return <div className="h-10 w-full bg-black mt-16 md:mt-[68px]" />;

  // We render this content block twice to create the infinite loop
  const ContentBlock = () => (
    <div className="flex items-center shrink-0">
      <span className="text-white text-sm md:text-base font-inter font-medium tracking-wide px-4">
        {displayText}
      </span>
      <span className="text-white text-sm md:text-base font-inter font-medium tracking-wide px-4">
        |
      </span>
    </div>
  );

  return (
    <div className="w-full mt-16 md:mt-[68px] z-40 bg-black">
      {/* Injecting the keyframe animation here for portability. 
        You can also move this to your global CSS or tailwind config.
      */}
      <style>{`
        @keyframes infinite-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 25s linear infinite;
        }
        /* Pause on hover optional - remove if unwanted */
        .animate-infinite-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="relative max-w-screen-2xl mx-auto border-b border-white/10">
        <div
          className="overflow-hidden whitespace-nowrap py-3 flex"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, #000 20px, #000 calc(100% - 20px), transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, #000 20px, #000 calc(100% - 20px), transparent)",
          }}
        >
          {/* The Container: 
            1. flex: aligns the two duplicates side by side
            2. w-max: allows the width to grow as large as the text needs
            3. animate-infinite-scroll: Moves the whole thing left by 50%
          */}
          <div className="flex w-max animate-infinite-scroll">
            {/* Original Set */}
            <div className="flex">
              {/* Repeat the text a few times to ensure it fills wider screens before duplicating the set */}
              <ContentBlock />
              <ContentBlock />
              <ContentBlock />
              <ContentBlock />
            </div>

            {/* Duplicate Set (Must be identical to the Original Set) */}
            <div className="flex" aria-hidden="true">
              <ContentBlock />
              <ContentBlock />
              <ContentBlock />
              <ContentBlock />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;