"use client";
import Image from "next/image";
import {
  useRemoveFromCart,
  useUpdateCartQuantity,
} from "@/hooks/ecommerce.hooks";
import { useEffect, useState } from "react";
import { currencyFormat } from "@/helpers/functions";
import PlusMinusInput from "@/components/PlusMinusInput";
import Link from "next/link";
import noImage from '../../public/images/no-image-maximon.webp'

const CheckoutItems = ({
  id,
  name,
  sku,
  price,
  image,
  slug_path,
  inventory,
  className,
  refreshCart,
  quantity,
  refreshSummary,
  isClosed,
  setIsClosed,
  cart_item_id,
  setSureCheck,
  setRemoveId
}) => {
  const { mutate: removeFromCart, isSuccess: isRemoved } = useRemoveFromCart();
  const {
    mutate: updateCart,
    isSuccess: isUpdated,
    isPending,
    isError,
  } = useUpdateCartQuantity();

  const [productQuantity, setProductQuantity] = useState(Number(quantity));

  useEffect(() => {
    setProductQuantity(Number(quantity));
  }, [quantity]);

  useEffect(() => {
    if (isUpdated || isRemoved) {
      refreshCart();
      refreshSummary();
    }
  }, [isUpdated, isRemoved]);


  return (
    <>
      <div
        className={`relative items-start justify-start grid grid-cols-1 gap-2`}
      >
        <button
          className={`absolute p-1 right-1 top-1 z-10 cursor-pointer opacity-70 ${
            isClosed && !inventory?.inventory_defined && "text-white"
          } text-lg hover:opacity-100`}
          onClick={() => {
            setSureCheck(true);
          }}
        >
          {/* <i className="fas fa-times font-normal text-normal"></i> */}

          <Image
            src={"/icons/cancel.png"}
            alt="cancel"
            width={13}
            height={13}
            onClick={() => {setIsClosed(false)
              setRemoveId(id)}
            }
            className="cursor-pointer"
          />

        </button>
        <Link href={`/${slug_path}`} className="w-full">
        <Image
                    src={image?.[0] ?? noImage}
                    alt={'Comr'}
                    sizes={
                      "(max-width: 639px) 100vw, (max-width: 767px) 100vw, (max-width: 1023px) 100vw, (max-width: 1279px) 100vw, (min-width: 1600px) 50vw"
                    }
                    width={0}
                    height={0}
                    priority={true}
                    className={`transition-all duration-200 opacity-100 object-cover w-full h-[300px]`}
                  />
          {/* <Image
            src={image?.[0] ?? "/comr.png"}
            alt={`Comr`}
            width={0}
            height={0}
            sizes={`90vw`}
            className={`h-44 sm:h-56 w-full object-cover bg-gray-100`}
          /> */}
        </Link>
        <div className={`mb-auto flex flex-col items-center gap-2`}>
          <h4 className={`${className ? className : ""} text-xs font-normal`}>
            {name}
          </h4>
          <div className={`flex items-center flex-col`}>
            <p
              className={`${
                className ? className : ""
              } text-xs font-bold mb-2`}
            >
              {currencyFormat(price?.per_item?.total)}
            </p>
            <PlusMinusInput
              className={`${className ? className : ""} !mr-auto`}
              maxAmount={+inventory?.amount}
              quantity={productQuantity}
              setQuantity={setProductQuantity}
              updateCart={updateCart}
              id={cart_item_id}
              refreshSummary={refreshSummary}
              refreshCart={refreshCart}
              updatingCart={isPending}
              updatingCartError={isError}
              size="small"
            />
          </div>
        </div>
        {isClosed && !inventory?.inventory_defined && (
          <div
            className={`absolute bottom-0 left-0 right-0 top-0 h-full w-full bg-black/40`}
          ></div>
        )}
      </div>
      
    </>
  );
};

export default CheckoutItems;
