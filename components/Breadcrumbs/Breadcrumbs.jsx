"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Breadcrumbs = ({ pages, currentPage,nazad, marginTop = "mt-0 md:mt-8" }) => {
  const router = useRouter();

  return (
    <div
      className={`${marginTop} bg-[#f2f2f2] border flex mx-0 w-[90%] 2xl:w-[85%] max-sm:w-full max-sm:mx-0 md:mx-auto border-r-0 border-l-0`}
    >
      <span
        className="back-button pr-2 bg-white flex items-center cursor-pointer breadcrumb-back-helper"
        onClick={() =>nazad ? router.push(`${nazad}`) : router.back()}
      >
        <Image
          src="/icons/right-chevron.png"
          width={15}
          height={15}
          className="object-cover cursor-pointer"
          alt="right-chevron"
          style={{
            transform: "rotate(90deg)",
            width: "15px",
            height: "15px",
          }}
        />
        <span className="ml-2 cursor-pointer text-[14px] md:text-[15px] leading-7 font-light">Nazad</span>
      </span>
      <div className="pl-2 flex items-center gap-1 md:gap-3 flex-wrap pr-5 lg:pr-[3rem] bg-[#f2f2f2] lg:pl-10 lg:grap-4 breadcrumb-content-helper">
        <Link href={`/`} className="text-[#343434] text-[14px] md:text-[15px] font-normal leading-7">
          Početna
        </Link>

        {pages && pages.length > 0 && <>/</>}
        {pages &&
          pages.length > 0 &&
          pages.map((page, index, arr) => {
            return (
              <div key={index} className="flex items-center gap-1 md:gap-2">
                <Link
                  href={`/${page?.link?.link_path}`}
                  className="text-[#343434] text-[14px] md:text-[15px] font-normal leading-7"
                >
                  {page?.name}
                </Link>
                {index !== arr.length - 1 && <>/</>}
              </div>
            );
          })}

        {currentPage && (
          <>
            /
            <p className="text-[#343434] text-[14px] md:text-[15px] font-normal leading-7">
              {currentPage}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Breadcrumbs;
