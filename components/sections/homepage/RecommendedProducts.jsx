"use client";
import { Suspense, useEffect, useState } from "react";
import { Thumb } from "@/components/Thumb/Thumb";
import { usePathname } from "next/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const filterProductsByCategory = (recommendedProducts, category) => {
  const categorySlug = category.slug;

  const filteredProducts = recommendedProducts.filter((product) => {
    if (product.categories && product.categories.length > 0) {
      return product.categories.some((cat) => cat.slug === categorySlug);
    }
    return false;
  });

  return filteredProducts;
};

const RecommendedProducts = ({ recommendedProducts, action4 }) => {
  const firstCategory = recommendedProducts[0]?.categories[0];

  const productByCategory = firstCategory
    ? filterProductsByCategory(recommendedProducts, firstCategory)
    : [];

  const [products, setProducts] = useState(productByCategory);

  const uniqueNames = [];
  const uniqueIds = [];
  const pathname = usePathname();
  const [selectedCategory, setSelectedCategory] = useState(
    recommendedProducts &&
      recommendedProducts.length > 0 &&
      recommendedProducts[0].categories &&
      recommendedProducts[0].categories.length > 0
      ? recommendedProducts[0].categories[0].id
      : null
  );

  const [loading, setLoading] = useState(true);
  const [swiperInstance, setSwiperInstance] = useState(null);

  const handleSwiperInit = (swiper) => {
    setSwiperInstance(swiper);
  };

  const handleSlideChange = () => {
    if (swiperInstance) {
      // Check if the swiper reached the last slide
      if (swiperInstance.realIndex === swiperInstance.slides.length - 1) {
        // Reset to the first slide
        swiperInstance.slideTo(0);
      }
    }
  };

  useEffect(() => {
    if (recommendedProducts) {
      setLoading(false);
    }
  }, [recommendedProducts]);

  return (
    <>
      {" "}
      <div className="w-[98%] max-sm:w-full max-sm:mx-auto md:mx-5 lg:mx-auto max-sm:mt-[3rem] md:mt-[4.125rem] overflow-visible">
        <p className="text-center font-normal text-black/80">Leto '24 - Nova kolekcija</p>
        <h2 className={`text-[24px] font-bold  text-center uppercase mb-8`}>{action4}</h2>

        {!pathname.includes("korpa") && (
          <>
            <div className="relative w-full hidden md:block md:w-[710px] md:m-auto lg:w-[1200px] ">
              <Swiper
                spaceBetween={21}
                slidesPerView='auto'
                className="flex items-center swiper-homepage-category"
                onInit={handleSwiperInit}
                onSlideChange={handleSlideChange}
                navigation={{
                  nextEl: ".swiper-button-category-next",
                  prevEl: ".swiper-button-category-prev",
                }}
                modules={[Navigation]}
              >
                {recommendedProducts?.map((category) => {
                  const uniqueCategories = category?.categories?.filter(
                    (item, index, arr) =>
                      arr.findIndex((el) => el.name === item.name) === index
                  );
                  const firstUniqueCategory = uniqueCategories[0];

                  if (uniqueNames.includes(firstUniqueCategory?.name)) {
                    return null;
                  } else {
                    uniqueNames.push(firstUniqueCategory?.name);
                    return (
                      <SwiperSlide
                        key={category.id}
                        className={`group hover:bg-black hover:text-white`}
                        style={{
                          width: "auto",
                          height: "60px",
                          backgroundColor:
                            selectedCategory === firstUniqueCategory?.id
                              ? "black"
                              : "",
                        }}
                        onClick={(e) => {
                          e.preventDefault();

                          if (selectedCategory === firstUniqueCategory?.id) {
                            setSelectedCategory(null);
                            setProducts(recommendedProducts);
                            return;
                          }

                          const productByCategory = filterProductsByCategory(
                            recommendedProducts,
                            firstUniqueCategory
                          );

                          setProducts(productByCategory);
                          setSelectedCategory(firstUniqueCategory?.id);
                        }}
                      >
                        <span
                          className={` !font-light ${
                            selectedCategory === firstUniqueCategory?.id
                              ? "text-white"
                              : " text-black"
                          }`}
                        >
                          {firstUniqueCategory?.name}
                        </span>
                      </SwiperSlide>
                    );
                  }
                })}
              </Swiper>
                <div className="swiper-button-prev swiper-button-category-prev"></div>
              <div className="swiper-button-next swiper-button-category-next"></div>
            </div>

            <div className="md:hidden">
              <select
                onChange={(e) => {
                  let newProducts = [...recommendedProducts];
                  newProducts = recommendedProducts?.filter((item) => {
                    return item?.categories[0]?.id === Number(e.target.value);
                  });
                  setProducts(newProducts);
                }}
                className="rounded-md border-2 border-[#f7f7f7] focus:border-[#f7f7f7] focus:outline-0 focus:ring-0 text-black w-full max-md:text-[0.9rem]"
              >
                {recommendedProducts?.map((category) => {
                  const uniqueCategories = category?.categories?.filter(
                    (item, index, arr) =>
                      arr.findIndex((el) => el.name === item.name) === index
                  );
                  if (uniqueIds.includes(uniqueCategories[0]?.id)) {
                    return null;
                  } else {
                    uniqueIds.push(uniqueCategories[0]?.id);
                    return (
                      <option
                        key={uniqueCategories[0]?.id}
                        value={Number(uniqueCategories[0]?.id)}
                        className={`max-md:text-[0.9rem]`}
                      >
                        {uniqueCategories[0]?.name}
                      </option>
                    );
                  }
                })}
              </select>
            </div>
          </>
        )}

        {!loading && (
          <div className="max-sm:mt-[1rem] mt-[6.5rem] ">
            <Swiper
              slidesPerView={1.1}
              spaceBetween={10}
              navigation={true}
              modules={[Navigation]}
              fadeEffect={{ crossFade: true }}
              loop={products.length > 2}
              className="mySwiper3 w-full select-none"
              breakpoints={{
                640: {
                  slidesPerView: 2.5,
                  spaceBetween: 10,
                },
                1024: {
                  slidesPerView: 4.5,
                  spaceBetween: 10,
                },
                1680: {
                  slidesPerView: 5.5,
                  spaceBetween: 25,
                },
              }}
            >
              {products?.map(({ id }) => {
                return (
                  <SwiperSlide key={id} className="hoveredColor">
                    <Suspense
                      fallback={
                        <div
                          key={id}
                          className="aspect-2/3 h-full w-full animate-pulse bg-slate-300"
                        />
                      }
                    >
                      <Thumb id={id} slug={id} />
                    </Suspense>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        )}
      </div>
    </>
  );
};

export default RecommendedProducts;
