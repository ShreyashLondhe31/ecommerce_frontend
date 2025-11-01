const AnnouncementBar = () => {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-amber-300">
        <div className="relative max-w-screen-2xl mx-auto">
          <div
            className="overflow-hidden whitespace-nowrap py-4"
            style={{
              maskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)'
            }}
          >
            <div className="flex space-x-4">
              <div className="animate-[scroll_25s_linear_infinite] inline-block">
                <span className="text-amber-800 text-base font-inter font-medium tracking-wide px-4">
                  Special Offer: 10% off on all products | Free shipping on orders over 15.000 د.ك | Limited time offer
                </span>
                <span className="text-amber-800 text-base font-inter font-medium tracking-wide px-4">
                  |
                </span>
                <span className="text-amber-800 text-base font-inter font-medium tracking-wide px-4">
                  New arrivals every week | Sign up for exclusive deals | Shop now
                </span>
                <span className="text-amber-800 text-base font-inter font-medium tracking-wide px-4">
                  |
                </span>
              </div>
              <div className="animate-[scroll_25s_linear_infinite] inline-block" aria-hidden="true">
                <span className="text-amber-800 text-base font-inter font-medium tracking-wide px-4">
                  Special Offer: 10% off on all products | Free shipping on orders over 15.000 د.ك | Limited time offer
                </span>
                <span className="text-amber-800 text-base font-inter font-medium tracking-wide px-4">
                  |
                </span>
                <span className="text-amber-800 text-base font-inter font-medium tracking-wide px-4">
                  New arrivals every week | Sign up for exclusive deals | Shop now
                </span>
                <span className="text-amber-800 text-base font-inter font-medium tracking-wide px-4">
                  |
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Spacer */}
      <div className="h-12"></div>
    </>
  );
};

export default AnnouncementBar;
