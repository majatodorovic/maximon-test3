"use client";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import "swiper/css/pagination";
import "swiper/css/zoom";


import { FreeMode, Navigation, Pagination, Thumbs, Zoom } from "swiper/modules";
import Image from "next/image";
import { convertHttpToHttps } from "@/helpers/convertHttpToHttps";
import { useSuspenseQuery } from "@tanstack/react-query";
import { get } from "@/api/api";
import { useSearchParams } from "next/navigation";
import noImage from '../../public/images/no-image-maximon.webp'

export const ProductGallery = ({ slug, color }) => {
  const [loading, setLoading] = useState(false);
  const { data: productGallery } = useSuspenseQuery({
    queryKey: ["productGallery", slug],
    queryFn: async () => {
      return await get(`/product-details/gallery/${slug}`).then(
        (res) => res?.payload
      );
    },
    refetchOnWindowFocus: false,
  });

  

  const [gallery, setGallery] = useState(productGallery?.gallery || []);

  const params = useSearchParams();
  // const color = params?.get("color");

  function ImageMagnifier({ src, onClick = () => {},    magnifierHeight = 300,
  magnifierWidth = 300,
  zoomLevel = 2.5, }) {
    const [[x, y], setXY] = useState([0, 0]);

    const [[imgWidth, imgHeight], setSize] = useState([0, 0]);

    const [showMagnifier, setShowMagnifier] = useState(false);
    return (
      <div
        style={{
          position: "relative",
          zIndex: 100,
        }}
        className="h-full w-full object-cover aspect-2/3"
        onClick={onClick}
      >
        <Image
          src={src}
          width={0}
          height={0}
          ref={mainSliderRef}
          sizes={`(max-width: 768px) 100vw, (min-width: 1200px) 70vw`}
          priority={true}
          className="!h-full !object-cover w-full"
          alt={src}
          onMouseEnter={(e) => {
            const elem = e.currentTarget;
            const { width, height } = elem.getBoundingClientRect();
            setSize([width, height]);
            setShowMagnifier(true);
          }}
          onMouseMove={(e) => {
            const elem = e.currentTarget;
            const { top, left } = elem.getBoundingClientRect();
            const x = e.pageX - left - window.pageXOffset;
            const y = e.pageY - top - window.pageYOffset;
            setXY([x, y]);
          }}
          onMouseLeave={() => {
            setShowMagnifier(false);
          }}
        />
        <Image
          src={"/icons/diagonal-arrow.png"}
          alt="back button"
          className="absolute right-4 top-4 z-10 cursor-pointer"
          width={22}
          height={22}
        />
        <div
          style={{
            display: showMagnifier ? "" : "none",
            position: "absolute",
            pointerEvents: "none",
            height: `${magnifierHeight}px`,
            width: `${magnifierWidth}px`,
            top: `${y - magnifierHeight / 2}px`,
            left: `${x - magnifierWidth / 2}px`,
            opacity: "1",
            border: "1px solid lightgray",
            borderRadius: "50%",
            backgroundColor: "white",
            backgroundImage: `url('${src}')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${imgWidth * zoomLevel}px ${
              imgHeight * zoomLevel
            }px`,
            backgroundPositionX: `${-x * zoomLevel + magnifierWidth / 2}px`,
            backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
          }}
        ></div>
      </div>
    );
  }

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [modalImage, setModalImage] = useState(null);

  // const productImage = gallery?.map((image, index) => {
  //   return (
  //     <SwiperSlide key={index} className="w-full relative">
  //       <ImageMagnifier
  //         src={convertHttpToHttps(image?.image)}
  //         onClick={() => {
  //           setModalImage(image?.image);
  //         }}
  //       />
  //     </SwiperSlide>
  //   );
  // });
  const productImage = gallery?.length > 0 ? (
    gallery?.map((image, index) => {
      const imageUrl = convertHttpToHttps(image?.image) || noImage; // fallback to noImage if image is missing

      return (
        <SwiperSlide key={index} className="w-full relative">
          <ImageMagnifier
            src={imageUrl}
            onClick={() => {
              setModalImage(image?.image);
            }}
          />
        </SwiperSlide>
      );
    })
  ) : (
    <SwiperSlide>
      <Image src={noImage} /> {/* Render the fallback image if gallery is empty */}
    </SwiperSlide>
  );

  const thumbImage = gallery?.map((image, index) => {
    return (
      <SwiperSlide
        key={`${slug}-${index}-thumbImage`}
        className={`!overflow-hidden !aspect-2/3`}
      >
        <Image
          src={convertHttpToHttps(image?.image)}
          alt={`croonus Shop`}
          width={0}
          height={0}
          priority={true}
          sizes={`(max-width: 768px) 100vw, (min-width: 1200px) 70vw`}
          className="cursor-pointer max-md:hidden w-full !h-full !object-cover"
        />
      </SwiperSlide>
    );
  });

  // const thumbImage = gallery?.length > 0 ? (
  //   gallery?.map((image, index) => {
  //     const imageUrl = convertHttpToHttps(image?.image) || noImage; // fallback to noImage if image is missing

  //     return (
  //       <SwiperSlide
  //         key={`${slug}-${index}-thumbImage`}
  //         className={`!overflow-hidden !aspect-2/3`}
  //       >
  //         <Image
  //           src={imageUrl}
  //           alt={`Product Thumbnail`}
  //           width={0}
  //           height={0}
  //           priority={true}
  //           sizes={`(max-width: 768px) 100vw, (min-width: 1200px) 70vw`}
  //           className="cursor-pointer max-md:hidden w-full !h-full !object-cover"
  //         />
  //       </SwiperSlide>
  //     );
  //   })
  // ) : (
  //   <SwiperSlide>
  //     <Image
  //       src={noImage}
  //       alt="Fallback Thumbnail"
  //       width={0}
  //       height={0}
  //       priority={true}
  //       sizes={`(max-width: 768px) 100vw, (min-width: 1200px) 70vw`}
  //       className="cursor-pointer max-md:hidden w-full !h-full !object-cover"
  //     />
  //   </SwiperSlide>
  // );

  const [swiper, setSwiper] = useState(null);

  useEffect(() => {
    if (color) {
      setLoading(true);
  
      // Filter images based on the selected color or variant key
      const newImages = productGallery?.gallery?.filter((item) =>
        item?.variant_key?.includes(color)
      );
  
      // Use a Set to track unique attribute_keys
      const seenAttributeKeys = new Set();
      const filteredImages = [];
  
      // Loop through the images and keep only the first image for each unique attribute_key
      newImages.forEach((item) => {
        const variant = item?.variant_key_array?.[0]; // Use the first variant (or any you prefer)
  
        if (variant && !seenAttributeKeys.has(variant?.attribute_key)) {
          seenAttributeKeys.add(variant?.attribute_key);
          filteredImages.push(item); // Add the image to the result
        }
      });
  
      setGallery(filteredImages); // Set the gallery to the filtered images
  
    }
    if (productGallery?.gallery?.length) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [color]);

  const mainSliderRef = useRef(null);

  useEffect(() => {
    const updateMainSliderHeight = () => {
      if (mainSliderRef.current) {
        const thumbsSwiper = document.getElementById("thumbsSwiper");
        thumbsSwiper.style.height = `${mainSliderRef.current.clientHeight}px`;
      }
    };

    updateMainSliderHeight();

    window.addEventListener("resize", updateMainSliderHeight);
    return () => {
      window.removeEventListener("resize", updateMainSliderHeight);
    };
  }, []);

  return (
    <div className="col-span-2 max-lg:col-span-4 max-md:aspect-2/3 md:flex md:flex-row-reverse gap-5 h-fit overflow-hidden">
      <Swiper
        spaceBetween={10}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        pagination={true}
        modules={[FreeMode, Thumbs, Pagination, Navigation]}
        initialSlide={0}
        navigation={true}
        rewind={true}
        onSwiper={(swiper) => setSwiper(swiper)}
        className={`w-full h-full !relative `}
        breakpoints={{
          768: {
            direction: "horizontal",
            slidesPerView: 1,
            pagination: {
              el: ".swiper-pagination",
              enabled: false,
            },
            navigation: {
              enabled: true,
            },
            modules: [FreeMode, Thumbs, Navigation],
          },
          0: {
            direction: "vertical",
            slidesPerView: 1,
            pagination: {
              el: ".swiper-pagination",
              clickable: true,
              enabled: true,
              bulletClass: "swiper-pagination-bullet",
              bulletActiveClass: "swiper-pagination-bullet-active",
            },
            navigation: {
              el: ".swiper-nav-button",
              clickable: true,
              enabled: false,
              bulletClass: "swiper-pagination-bullet",
              bulletActiveClass: "swiper-pagination-bullet-active",
            },
            modules: [FreeMode, Thumbs, Pagination],
          },
        }}
      >
        {loading ? (
          <SwiperSlide>
            <div className="h-full aspect-2/3 w-full bg-gray-200 animate-pulse"></div>
          </SwiperSlide>
        ) : (
          <>{productImage}</>
        )}
        <div className={`absolute z-50 flex flex-col gap-1 top-2 right-2`}>
          {productGallery?.stickers?.length > 0 &&
            productGallery?.stickers?.map((sticker, stickerIndex) => {
              return (
                <div
                  key={`stickerIndex-${stickerIndex}`}
                  className={`text-[13px] bg-[#39ae00] px-[0.85rem] py-1 rounded-lg font-bold`}
                >
                  <span className={`text-[0.75rem] text-white`}>
                    {sticker?.name}
                  </span>
                </div>
              );
            })}
        </div>
      </Swiper>

      <Swiper
        onSwiper={(swiper) => setThumbsSwiper(swiper)}
        spaceBetween={15}
        id={`thumbsSwiper`}
        slidesPerView={0}
        breakpoints={{
          320: {
            direction: "horizontal",
            slidesPerView: 0,
            thumbs: {
              enabled: false,
            },
            modules: [],
          },
          768: {
            direction: "vertical",
            slidesPerView: 4,
            enabled: true,
            allowSlidePrev: true,
            modules: [FreeMode, Thumbs],
          },
        }}
        freeMode={true}
        className={` m-auto w-1/4 h-full max-md:hidden !relative`}
      >
        {thumbImage}
        <div
          slot="container-start"
          className={`absolute ${
            productGallery?.gallery?.length > swiper?.params?.slidesPerView
              ? `block`
              : `hidden`
          } bottom-0 left-0 w-full pt-3 right-0 flex items-center justify-center text-center z-50 cursor-pointer bg-white`}
          onClick={() => {
            swiper?.slideNext();
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" onClick={() => {
              swiper?.slideNext();
            }}>
  <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
</svg>

          {/* <i
            className={`fa-thin fa-chevron-down`}
            
          ></i> */}
        </div>
        <div
          className={`absolute ${
            productGallery?.gallery?.length > swiper?.params?.slidesPerView
              ? `block`
              : `hidden`
          } top-0 left-0 w-full pb-2 right-0 flex items-center justify-center z-50 cursor-pointer bg-white`}
          onClick={() => {
            swiper?.slidePrev();
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" onClick={() => {
              swiper?.slidePrev();
            }}>
  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
</svg>

          {/* <i
            className={`fa-thin fa-chevron-up`}
            
          ></i> */}
        </div>
      </Swiper>

      {modalImage && (
        <div
          className={`fixed top-0 left-0 w-full h-full bg-black/80 z-[999999] flex items-center justify-center overflow-y-auto`}
        >
          <div className="relative w-[30%] max-md:w-full h-[70%]">
            <Swiper
              modules={[Pagination, Zoom]}
              pagination={true}
              direction={"vertical"}
              zoom={{
                maxRatio: 2.5,
                toggle: true,
                minRatio: 1,
              }}
              initialSlide={productGallery?.gallery?.findIndex(
                (item) => item?.image === modalImage
              )}
              className={`modalSwiper w-full h-full swiper-zoom-container`}
              breakpoints={{
                0: {
                  direction: "vertical",
                  slidesPerView: 1,
                  pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                    enabled: true,
                    bulletClass: "swiper-pagination-bullet",
                    bulletActiveClass: "swiper-pagination-bullet-active",
                  },
                },
              }}
            >
              {productGallery?.gallery?.map((image, index) => {
                return (
                  <SwiperSlide
                    key={`${slug}-${index}-product-image-first-swiper`}
                    className="w-full"
                  >
                    <div className="swiper-zoom-container">
                      <Image
                        src={image?.image || noImage}
                        alt={image?.image}
                        layout="fill"
                        objectFit="contain"
                        priority={true}
                        className="cursor-pointer max-h-screen w-auto mx-auto"
                      />
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
            <Image
            src={"/icons/cancel.png"}
            className="px-2 py-1 text-xl cursor-pointer absolute top-3 right-3 z-50"
            width={42}
            height={42}
            alt="cancel gallery"
            onClick={() => {
              setModalImage(null);
            }}
          />
          </div>

          
          <div
            className="fixed z-[-100] bg-black bg-opacity-40 top-0 left-0 w-screen h-screen transition-all duration-500"
            onClick={() => {
              setModalImage(null);
            }}
          ></div>

        </div>
      )}
    </div>
  );
};
