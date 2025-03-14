"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { convertHttpToHttps } from "@/helpers/convertHttpToHttps";
import ProductPrice from "@/components/ProductPrice/ProductPrice";
import {
  useAddToWishlist,
  useIsInWishlist,
  useProductThumb,
  useRemoveFromWishlist,
} from "@/hooks/ecommerce.hooks";
import { getColorByColorName } from "@/helpers/getColorByColorName";
import { truncateText } from "@/helpers/truncateText";
import noImage from '../../public/images/no-image-maximon.webp'

export const Thumb = ({ slug, categoryId, refreshWishlist = () => {} }) => {
  const { data: product } = useProductThumb({
    slug: slug,
    id: slug,
    categoryId: categoryId ?? "*",
  });
  const { mutate: addToWishlist, isSuccess: isAdded } = useAddToWishlist();
  const { mutate: removeFromWishlist, isSuccess: isRemoved } =
    useRemoveFromWishlist();

  const { data: wishlist_data, refetch } = useIsInWishlist({ id: slug });

  useEffect(() => {
    refetch();
    refreshWishlist();
  }, [isAdded, isRemoved]);

  const [swiper, setSwiper] = useState(null);

  const variantOptionColor = product?.variant_options?.find((variant) => {
    return (
      variant?.attribute?.slug === "boja" ||
      variant?.attribute?.slug === "color"
    );
  });

  const [selected, setSelected] = useState(
    variantOptionColor
      ? [
          {
            attribute_key: variantOptionColor.attribute.key,
            value_key: variantOptionColor.values[0].key,
          },
        ]
      : []
  );

  const isInWishlist = {
    exist: wishlist_data?.exist,
    wishlist_item_id: wishlist_data?.wishlist_item_id,
  };

  const imageList = variantOptionColor?.values
    ? variantOptionColor?.values
    : product?.image
    ? product.image
    : null;

  return (
    <div
      key={slug}
      className="col-span-1 aspect-2/3 relative item hoveredColor thumbComponent "
    >
      <div className={`aspect-2/3 w-full item relative md:h-[500px]`}>
        <Swiper
          modules={[Navigation, Pagination]}
          pagination={true}
          rewind
          initialSlide={product?.image?.findIndex(
            (item) => item === product?.image[0]
          )}
          breakpoints={{
            320: {
              navigation: {
                enabled: false,
              },
            },
            1024: {
              navigation: {
                enabled: true,
              },
              pagination: {
                enabled: false,
              },
            },
          }}
          className={`categoryImageSwiper relative w-full h-full`}
          onSwiper={(swiperInstance) => {
            setSwiper(swiperInstance);
          }}
        >
          {imageList?.map((item, index) => {
            let url;
            if (item) {
              if (
                item.product_image &&
                typeof item.product_image === "string"
              ) {
                url = item.product_image;
              } else if (typeof item === "string") {
                url = item;
              }
            }

            return (
              <SwiperSlide key={`${slug}-${index}`}>
                <Link href={`/${product?.link?.link_path}`}>
                  <Image
                    src={url ? convertHttpToHttps(url) : noImage}
                    alt={product?.basic_data?.name}
                    sizes={
                      "(max-width: 639px) 100vw, (max-width: 767px) 100vw, (max-width: 1023px) 100vw, (max-width: 1279px) 100vw, (min-width: 1600px) 50vw"
                    }
                    width={0}
                    height={0}
                    priority={true}
                    className={`transition-all duration-200 opacity-100 object-cover w-full h-full`}
                  />
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div
          id="thumb-onhover-actions"
          className="flex align-center justify-center absolute z-10 w-full bg-white chevrons"
          style={{
            width: "calc(100% - 12px)",
            margin: "0 6px",
            bottom: "6px",
            padding: "0",
          }}
        >
          <div
            className="p-1 rounded-full group cursor-pointer mx-3 hover:bg-black/90"
            title="Kupi"
          >
            <Link href={`/${product?.link?.link_path}`}>
              <Image
                src={"/icons/shopping-bag.png"}
                className="group-hover:invert"
                alt="wishlist"
                width={23}
                height={23}
              />
            </Link>
          </div>

          <div
            title="Dodaj u listu želja"
            onClick={() => {
              if (!isInWishlist?.exist) {
                addToWishlist({ id: slug, name: product?.basic_data?.name });
              } else {
                removeFromWishlist({ id: isInWishlist?.wishlist_item_id });
              }
            }}
            className={`scale-90 group p-1 inline-flex max-md:hidden rounded-full cursor-pointer mx-3
              ${isInWishlist?.exist ? "" : "hover:bg-red-500"}
              `}
          >
            <Image
              src={
                isInWishlist?.exist
                  ? `/icons/heart-active.png`
                  : `/icons/heart.png`
              }
              alt="wishlist"
              className={`!block  ${
                isInWishlist?.exist ? "" : "group-hover:invert"
              }`}
              width={26}
              height={26}
            />
          </div>
        </div>

        {product?.price?.discount?.active && (
          <div className={`absolute left-2 top-2 z-[1] text-white text-[13px]`}>
            <div
              className={`bg-[#c23d27] px-[0.85rem] py-1 rounded-lg font-bold`}
            >
              -
              {(
                ((product?.price?.price?.original -
                  product?.price?.price?.discount) /
                  product?.price?.price?.original) *
                100
              ).toFixed(0)}
              %
            </div>
          </div>
        )}
        {product?.stickers?.length > 0 && (
          <div
            className={`absolute right-2 top-2 z-[1] text-center text-white text-[13px] flex flex-col gap-2`}
          >
            {product?.stickers?.map((sticker, index) => {
              return (
                <div
                  className={`text-[13px] bg-[#39ae00] px-[0.85rem] py-1 rounded-lg font-bold`}
                  key={index}
                >
                  {sticker?.name}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="mt-[0.813rem] flex flex-col items-center justify-center relative z-[50]">
        <Link
          href={`/${product?.link?.link_path}`}
          className="max-md:text-[0.85] text-[1rem] relative max-md:leading-4 max-sm:line-clamp-1"
        >
          <h3
            className="text-center font-light"
            title={
              product?.basic_data?.name.length > 63
                ? product?.basic_data?.name
                : ""
            }
          >
            {truncateText(product?.basic_data?.name)}
          </h3>
        </Link>
        <div className="thumb-product-price">
          <ProductPrice
            price={product?.price}
            inventory={product?.inventory}
            is_details={false}
          />
        </div>
      </div>

      <div className={`w-full`}>
        <div
          className={`flex flex-row items-center justify-center gap-[0.5rem] mt-2`}
        >
          {variantOptionColor?.values?.map((item3, index) => {
            const variantAttributeKey = variantOptionColor?.attribute?.key;
            const isSelected = selected.find(
              (item) =>
                item?.attribute_key === variantAttributeKey &&
                item?.value_key === item3?.key
            );
            const colorBySlug = getColorByColorName(item3?.slug);

            if (index > 2) {
              if (index === 3) {
                return (
                  <div
                    key="more-colors"
                    className="text-sm"
                  >
                    + još boja
                  </div>
                );
              }
              return null;
            }

            return (
              <div
                key={item3?.key}
                className={`${
                  !isSelected ? "hover:opacity-40" : ""
                } relative rounded-full cursor-pointer flex items-center justify-center text-center text-xs w-[20px] h-[20px] min-w-[20px] transition-all duration-500 `}
                style={{
                  backgroundColor: item3?.image ? "" : colorBySlug,
                  border: item3?.image
                    ? ""
                    : item3.name === "BELA"
                    ? `1px solid #b2b2b2`
                    : "none",
                }}
                onClick={() => {
                  setSelected((prevSelected) => {
                    // Remove previous selections with the same variantAttributeKey
                    const filteredSelections = prevSelected.filter(
                      (selection) =>
                        selection.attribute_key !== variantAttributeKey
                    );
                    return [
                      ...filteredSelections,
                      {
                        attribute_key: variantAttributeKey,
                        value_key: item3?.key,
                      },
                    ];
                  });

                  const imageIndex = variantOptionColor?.values.findIndex(
                    (value) => value?.product_image === item3?.product_image
                  );

                  if (imageIndex !== -1 && swiper) {
                    swiper.slideTo(imageIndex);
                  }
                }}
              >
                {isSelected && (
                  <div
                    className={`absolute rounded-full w-[18px] h-[18px] bg-transparent border-2 border-white ${
                      item3.name === "BELA" ? "border-black/20" : ""
                    } `}
                  ></div>
                )}

                {item3?.image && (
                  <Image
                    src={item3?.image}
                    alt="Boja"
                    className="rounded-full"
                    sizes="20px"
                    width={20}
                    height={20}
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
