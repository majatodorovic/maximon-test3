"use client";

import React, { Suspense, useState } from "react";
import { ProductGallery } from "@/components/ProductDetails/ProductGallery";
import { ProductInfo } from "@/components/ProductDetails/ProductInfo";
import { Breadcrumbs } from "@/components/ProductDetails/InfoData/breadcrumbs";
import UpsellProducts from "@/components/UpsellProducts/UpsellProducts";
import CrossSellProducts from "../CrosssellProducts/CrosssellProducts";
import RelatedProducts from "../RelatedProducts/RelatedProducts";
import RecommendedProducts from "../RecommendedProducts/RecommendedProducts";

export const ProductPage = ({ path, categoryId, canonical, base_url, id }) => {
  const [color,setColor] = useState(null);
  return (
    <>
      <div className="bg-[#f2f2f2] border mt-0 md:mt-8 flex mx-0 w-[90%] max-sm:w-full 2xl:w-[85%] max-sm:mx-0 md:mx-auto border-r-0 border-l-0">
        {/* <Suspense
          fallback={<div className={`h-2 bg-slate-300 animate-pulse w-full`} />}
        > */}
          <Breadcrumbs id={id} categoryId={categoryId} />
        {/* </Suspense> */}
      </div>
      <div className="max-md:mt-[1.01rem] mt-16 w-[90%] 2xl:w-[85%] max-md:mx-auto gap-x-[3.063rem] grid grid-cols-4 mx-auto">
        <Suspense
          fallback={
            <div
              className={`h-[50rem] bg-slate-200 animate-pulse col-span-2 max-lg:col-span-4`}
            />
          }
        >
          <ProductGallery slug={id} color={color} />
        </Suspense>
        <ProductInfo
          path={path}
          id={id}
          canonical={canonical}
          base_url={base_url}
          color={color}
          setColor={setColor}
        />
      </div>
      <Suspense
        fallback={
          <div className={`grid grid-cols-4 gap-5 mt-10`}>
            {Array.from({ length: 4 }).map((item, i) => {
              return (
                <div
                  key={i}
                  className={`w-full min-w-0 h-full aspect-2/3 bg-slate-300 animate-pulse`}
                ></div>
              );
            })}
          </div>
        }
      >
        <UpsellProducts slug={id} />
        <CrossSellProducts slug={id} />
        <RecommendedProducts slug={id} />
        <RelatedProducts slug={id} />
      </Suspense>
    </>
  );
};
