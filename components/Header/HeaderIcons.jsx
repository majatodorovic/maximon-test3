"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartBadge, useWishlistBadge } from "@/hooks/ecommerce.hooks";
import SearchProducts from "./SearchProducts";

const HeaderIcons = () => {
  const { data: cartCount } = useCartBadge();
  const { data: wishListCount } = useWishlistBadge();

  return (
    <div className="flex items-center h-[32px] gap-3">
      <Link href="/korpa">
        <div className="relative">
          <Image
            src="/icons/shopping-bag.png"
            width={25}
            height={25}
            className="object-cover h-auto"
            alt="shopping-bag"
          />
          {cartCount != 0 && (
            <span className="absolute -top-3 text-white -right-2 bg-[#e10000] rounded-full w-5 h-5 flex items-center justify-center  text-xs">
              {cartCount}
            </span>
          )}
        </div>
      </Link>
      <Link href="/lista-zelja">
        <div className="relative">
          <Image
            src="/icons/heart.png"
            width={28}
            height={28}
            className="object-cover mx-2 h-auto"
            alt="heart"
          />
          {wishListCount != 0 && (
            <span className="absolute -top-2.5 text-white -right-1 bg-[#e10000] rounded-full w-5 h-5 flex items-center justify-center  text-xs">
              {wishListCount}
            </span>
          )}
        </div>
      </Link>
      <SearchProducts />
    </div>
  );
};

export default HeaderIcons;
