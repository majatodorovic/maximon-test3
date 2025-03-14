"use client";
import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { get } from "@/api/api";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const Breadcrumbs = ({ id, categoryId }) => {
  const router = useRouter();
  const { data: breadcrumbs } = useSuspenseQuery({
    queryKey: ["breadcrumbs", id],
    queryFn: async () => {
      return await get(
        `/product-details/breadcrumbs/${id}?categoryId=${categoryId ?? "*"}`
      ).then((res) => res?.payload);
    },
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <span
        className="back-button pr-2 bg-white flex items-center cursor-pointer breadcrumb-back-helper"
        onClick={() => router.back()}
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
        <span className="ml-2 cursor-pointer text-[14px] md:text-[15px] leading-7">Nazad</span>
      </span>

      <div className="pl-2 flex items-center gap-1 md:gap-2 flex-wrap pr-5 lg:pr-[3rem] bg-[#f2f2f2] lg:pl-7 lg:grap-4 breadcrumb-content-helper">
        <Link href={`/`} className={`text-[#343434] text-[14px] md:text-[15px] font-normal leading-7`}>
          Početna
        </Link>{" "}
        <>/</>
        {(breadcrumbs?.steps ?? [])?.map((breadcrumb, index, arr) => {
          return (
            <div
              className="flex items-center gap-1 md:gap-2"
              key={breadcrumb?.id}
            >
              <Link
                href={`/${breadcrumb?.link?.link_path}`}
                className="text-[#343434] text-[14px] md:text-[15px] font-normal leading-7"
              >
                {breadcrumb?.name}
              </Link>
              {index !== arr.length - 1 && <>/</>}
            </div>
          );
        })}
        <>/</>
        <h1 className="text-[#343434] text-[14px] md:text-[15px] font-normal leading-7">
          {breadcrumbs?.end?.name}
        </h1>
      </div>
    </>
  );
};
