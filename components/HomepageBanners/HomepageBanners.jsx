import IndexSlider from "../IndexSlider/IndexSlider";

const HomepageBanners = ({ banners, mobileBanners }) => {
    
  return (
    <div className="mx-auto max-md:mt-1 line2 relative">
      <div className={`max-md:hidden`}>
        <IndexSlider banners={banners} />
      </div>
      <div className={`md:hidden`}>
        <IndexSlider banners={mobileBanners} />
      </div>
      <div className="flex max-lg:justify-center justify-end mt-5 w-[95%] lg:w-[80%] mx-auto items-center max-lg:gap-5 gap-10"></div>
    </div>
  );
};

export default HomepageBanners;