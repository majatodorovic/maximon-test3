"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const NewCategoriesSections = ({ categories }) => {
  return (
    <div className="w-[90%] mx-auto 2xl:w-[85%]">
      <div className="mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 grid-flow-row gap-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              className={`relative w-full overflow-hidden`}
              href={`/${category?.link?.link_path}`}
            >
              {category?.images?.image && (
                <Image
                  src={category?.images?.image}
                  alt="category"
                  width={0}
                  height={0}
                  style={{ objectFit: "contain" }}
                  className="w-full h-[500px] lg:h-auto hover:scale-110 transition-all duration-700 ease-in-out"
                  sizes="100vw"
                />
              )}
              <div className="absolute bottom-0 left-0 w-full h-14 flex items-center justify-start">
                <h3
                  style={{ textShadow: "0px 1px 5px #ffffff70" }}
                  className=" text-black text-right text-[20px] md:text-[28px] font-light uppercase pl-12 pb-4"
                >
                  {category?.basic_data?.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewCategoriesSections;
