"use client";

import { useIsMobile } from "@/hooks/ecommerce.hooks";
import { Swiper } from "./Swiper/swiper";

export const BannerSlider = ({ banners, type = "banner" }) => {
  const isMobile = useIsMobile();
  return (
    // className="w-[90%] mx-auto" postavljeno kako bi baner za desktop imao spacing po nekih 10% sa obe strane
    <div className="w-[90%] 2xl:w-[85%] mx-auto">
      {isMobile === false && (
        <Swiper
          className={"!hidden md:!block"}
          swiper_data={{
            slidesPerView: 1,
            spaceBetween: 0,
            rewind: true,
            autoplay: {
              delay: 3500,
              disableOnInteraction: false,
            },
            pagination: {
              clickable: true,
            },
            modules: ["Autoplay"],
            slides: banners?.desktop,
            num_of_slides: banners?.desktop?.length,
            type: type,
          }}
        />
      )}
      {isMobile === true && (
        <Swiper
          className={"md:!hidden"}
          swiper_data={{
            slidesPerView: 1,
            spaceBetween: 0,
            rewind: true,
            autoplay: {
              delay: 3500,
              disableOnInteraction: false,
            },
            pagination: {
              clickable: true,
            },
            modules: ["Autoplay"],
            slides: banners?.mobile,
            num_of_slides: banners?.mobile?.length,
            type: type,
          }}
        />
      )}
    </div>
  );
};
