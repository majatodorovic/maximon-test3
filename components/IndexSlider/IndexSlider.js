"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Aos from "aos";
import { useIsMobile } from "@/hooks/ecommerce.hooks";
import { convertHttpToHttps } from "@/helpers/convertHttpToHttps";

function extractYoutubeId(url) {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

const RenderBanner = ({ banner }) => {
  switch (banner.type) {
    case "image":
      return (
        <Image
          src={banner?.image}
          alt={banner?.title}
          width={0}
          height={0}
          sizes={`100vw`}
          className="w-full h-auto"
        />
      );

    case "video_link":
      const videoProvider = banner.video_provider;
      const videoUrl = banner.video_url;

      const src =
  videoProvider === "youtube"
    ? `https://www.youtube.com/embed/${extractYoutubeId(videoUrl)}?autoplay=1&mute=1&loop=1&playsinline=1&controls=0&playlist=${extractYoutubeId(videoUrl)}`
    : `${videoUrl}?autoplay=1&muted=1&loop=1&background=1&playsinline=1}`;

      return (
        <iframe
          className="w-full h-full object-cover aspect-[960/1550] md:aspect-[1920/800] pointer-events-none"
          width={banner.width}
          height={banner.height}
          src={src}
          frameborder="0"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
      case "video":
      return (
        <>
                <video
        key={banner?.file}
          width={banner?.file_data?.banner_position?.width}
          height={banner?.file_data?.banner_position?.height}
          className="bg-fixed w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          controls={false}
        >
          <source src={convertHttpToHttps(banner?.file)} type="video/mp4" />
          <source src={convertHttpToHttps(banner?.file.replace(".mp4", ".webm"))} type="video/webm" />
          Your browser does not support the video tag.
        </video>
        </>

      );
      default:
        break
  }
};

const IndexSlider = ({ banners }) => {
  // const is_mobile = useIsMobile();
  const [currentSlide, setCurrentSlide] = useState({
    index: 0,
    banner: banners[0]?.image,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(0);
  const sliderRef = useRef();

  useEffect(() => {
    let banner = banners;

    const handleMouseUp = () => {
      if (isDragging) {
        setCurrentSlide({
          index: draggingIndex,
          banner: banner?.[draggingIndex]?.image,
        });
        setIsDragging(false);
      }
    };

    const handleMouseMove = (event) => {
      if (isDragging) {
        let banner = banners;
        const sliderRect = sliderRef.current.getBoundingClientRect();
        const slideWidth = sliderRect.width / banner.length;
        const mouseX = event.clientX - sliderRect.left;
        let newIndex = Math.floor(mouseX / slideWidth);
        if (newIndex < 0) newIndex = 0;
        if (newIndex > banner.length - 1) newIndex = banner.length - 1;
        setDraggingIndex(newIndex);
      }
    };

    document.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDragging, draggingIndex, banners]);

  useEffect(() => {
    Aos.init();
  });
  const intervalRef = useRef(null);

  useEffect(() => {
    let banner = banners;

    const nextSlide = () => {
      setCurrentSlide((prevState) => {
        const nextIndex = (prevState.index + 1) % banner?.length;
        return {
          index: nextIndex,
          banner: banner?.[nextIndex]?.image,
        };
      });
    };
    intervalRef.current = setInterval(nextSlide, 5000);
    const handleInteraction = () => {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(nextSlide, 5000);
    };
    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };
  }, [banners]);

  return (
    <div
      className="block mx-0 w-[90%] 2xl:w-[85%] max-md:w-full max-sm:mx-0 md:mx-auto"
      ref={sliderRef}
    >
      <div className="relative h-full overflow-hidden">
        <div className="items-center justify-between h-full w-full">
          {(banners ?? [])?.map((banner, index) => {
            const isActive = currentSlide?.index === index;
            return (
              <div
                key={index}
                className={
                  isActive
                    ? "relative w-full overflow-hidden h-full opacity-100 duration-[1000ms] transition-all ease-linear"
                    : "absolute w-full h-full overflow-hidden opacity-0 duration-[1000ms] transition-all ease-linear"
                }
              >
                <div className="relative sm:h-full">
                  <RenderBanner banner={banner} />
                  <Link
                    href={`${banner?.url ?? `/stranica-u-izradi`}`}
                    target={`${banner?.target}` ?? "_self"}
                    className="absolute z-[49] top-0 left-0 w-full h-full transition-all duration-500"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex flex-col items-center md:items-start justify-center md:justify-start gap-[14px] text-center md:text-left">
                        {banner?.title && (
                          <h1 className="text-black font-light uppercase text-[56px] w-[320px] leading-[58px]">
                            {banner?.title}
                          </h1>
                        )}
                        {banner?.subtitle && (
                          <h2 className="text-white max-sm:text-xl text-4xl font-bold uppercase max-sm:mt-0 max-sm:mb-0 mt-2 mb-2">
                            {banner?.subtitle}
                          </h2>
                        )}
                        {banner?.text && (
                          <p className="text-white text-left sm:max-w-[60%] max-sm:text-[0.925rem] text-base font-normal">
                            {banner?.text}
                          </p>
                        )}
                        {banner?.button && (
                          <button className="relative bg-transparent text-black/90 text-sm font-light uppercase py-2 px-0 transition-all duration-300 border-none hover:opacity-70 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-black">
                            {banner?.button}
                          </button>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IndexSlider;
