const AnnouncementBar = () => {
  return (
    <>
      <marquee
        className="text-3xl font-bold bg-amber-200 flex justify-center items-center fixed top-0 right-0 left-0 z-50"
        scrollamount="10"
        height="70px"
      >
        Sale is live | 10% off on all products
      </marquee>

      {/* Spacer for the fixed marquee */}
      <div className="h-[70px]"></div>
    </>
  );
};
export default AnnouncementBar;
