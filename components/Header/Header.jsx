"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import HeaderIcons from "./HeaderIcons";
import { usePathname, useParams } from "next/navigation";
import { useCategoryTree, useLandingPages } from "@/hooks/ecommerce.hooks";

const getCategoryBySlug = (categories, targetSlug) => {
  for (const category of categories) {
    if (category.slug_path === targetSlug) {
      return category;
    }
  }
  return null;
};

const Header = () => {
  const { data: categories } = useCategoryTree();
  const { data: landingPagesList } = useLandingPages();
  const pathname = usePathname();
  const params = useParams();

  const categoriesMain = [
    { name: "Novo", slug: "/novo", isCategory: false },
    ...categories,
  ];

  let activeCategoryBySlug =
    params && params.path
      ? getCategoryBySlug(categories, params.path[0])
      : false;
  let activeSubCategoryBySlug =
    params && params.path
      ? getCategoryBySlug(categories, params.path[1])
      : false;

  const [activeCategory, setActiveCategory] = useState({
    open: activeCategoryBySlug ? true : false,
    id: activeCategoryBySlug ? activeCategoryBySlug.id : null,
    name: activeCategoryBySlug ? activeCategoryBySlug.name : null,
    slug: activeCategoryBySlug ? activeCategoryBySlug.slug : null,
    data: activeCategoryBySlug ? activeCategoryBySlug.children : [],
    image: activeCategoryBySlug ? activeCategoryBySlug.image : null,
  });

  const [activeSubCategory, setActiveSubCategory] = useState({
    open: false,
    id: activeSubCategoryBySlug ? activeSubCategoryBySlug.id : null,
    name: activeSubCategoryBySlug ? activeSubCategoryBySlug.name : null,
    slug: activeSubCategoryBySlug ? activeSubCategoryBySlug.slug : null,
    data: activeSubCategoryBySlug ? activeSubCategoryBySlug.children : [],
    image: activeSubCategoryBySlug ? activeSubCategoryBySlug.image : null,
  });

  const resetActiveCategory = () => {
    activeCategoryBySlug
      ? null
      : setActiveCategory({
          open: false,
          id: null,
          name: null,
          slug: null,
          data: [],
          image: null,
        });

    activeSubCategory
      ? null
      : setActiveSubCategory({
          open: false,
          id: null,
          name: null,
          slug: null,
          data: [],
          image: null,
        });
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (activeCategoryBySlug) {
      setActiveCategory({
        open: true,
        id: activeCategoryBySlug.id,
        name: activeCategoryBySlug.name,
        slug: activeCategoryBySlug.slug,
        data: activeCategoryBySlug.children,
        image: activeCategoryBySlug.image,
      });
    }

    setActiveSubCategory({
      open: false,
      id: activeSubCategoryBySlug ? activeSubCategoryBySlug.id : null,
      name: activeSubCategoryBySlug ? activeSubCategoryBySlug.name : null,
      slug: activeSubCategoryBySlug ? activeSubCategoryBySlug.slug : null,
      data: activeSubCategoryBySlug ? activeSubCategoryBySlug.children : [],
      image: activeSubCategoryBySlug ? activeSubCategoryBySlug.image : null,
    });
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <>
      <header
        className={`hidden lg:block w-full z-[100] fixed bg-white `}
        id="header"
        style={{
          boxShadow: !isScrolled ? "none" : "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          className={`flex items-center relative mx-0 w-[90%] 2xl:w-[85%] max-sm:w-full max-sm:mx-0 md:mx-auto${
            isScrolled ? " pt-[30px] pb-[30px]" : " pt-[56px] pb-9"
          } transition-all duration-300`}
        >
          <Link
            href="/"
            className={`absolute flex flex-col items-center 
              ${
                isScrolled
                  ? "top-7 left-0 transform -translate-x-0"
                  : "left-1/2 transform -translate-x-1/2 top-7"
              } transition-all duration-300`}
          >
            <Image
              src="/images/logo/logo.png"
              width={272}
              height={43}
              className="object-cover"
              alt="logo"
            />
          </Link>
          <div
            className={`absolute flex items-center left-1/2 transform -translate-x-1/2 
              ${
                isScrolled ? "bottom-7" : "bottom-2"
              } transition-all duration-300`}
          >
            {categoriesMain?.map((category, index) => {
              const isCategory = category?.isCategory ?? true;
              return isCategory ? (
                category?.children ? (
                  <button
                    key={index}
                    className={`
                        font-light text-[20px] uppercase block relative w-fit text-black activeCategoryHover mx-5`}
                    onMouseEnter={() => {
                      setActiveCategory({
                        id:
                          category?.id === activeCategory?.id
                            ? null
                            : category?.id,
                        name:
                          category?.name === activeCategory?.name
                            ? null
                            : category?.name,
                        slug:
                          category?.slug === activeCategory?.slug
                            ? null
                            : category?.slug,
                        data: category?.children ?? [],
                        image: category?.image ?? null,
                        open: true,
                      });
                    }}
                  >
                    {category?.name}
                  </button>
                ) : (
                  <Link
                    href={`/${category?.link?.link_path}`}
                    key={index}
                    onClick={() => resetActiveCategory()}
                  >
                    <span
                      className={`font-light mx-5text-[16px] uppercase block text-black w-fit relative activeCategoryHover ${
                        pathname?.includes(category?.slug) && category?.id !== 0
                          ? "activeCategory"
                          : ""
                      }`}
                    >
                      {category?.name}
                    </span>
                  </Link>
                )
              ) : (
                <Link
                  href={`${category?.slug}`}
                  key={index}
                  onClick={resetActiveCategory}
                >
                  <span
                    className={`font-light mx-5 text-[20px] uppercase block text-black w-fit relative activeCategoryHover ${
                      pathname?.includes(category?.slug) && category?.id !== 0
                        ? "activeCategory"
                        : pathname === category?.slug && category?.id === 0
                        ? "activeCategory"
                        : ""
                    }`}
                  >
                    {category?.name}
                  </span>
                </Link>
              );
            })}
          </div>
          <div
            className="ml-auto relative mr-2 transition-all duration-300"
            style={isScrolled ? { top: "6px" } : { top: "28px" }}
          >
            <HeaderIcons />
          </div>
        </div>
        {activeCategory?.open && (
          <div
            onMouseLeave={() => {
              resetActiveCategory();
            }}
            className={`mx-0 w-[90%] max-sm:w-full 2xl:w-[85%] max-sm:mx-0 md:mx-auto absolute right-0 left-0 bg-black z-[100] max-lg:hidden mx-auto${
              pathname !== "/" ? " max-w-full" : " max-w-[1100px]"
            }`}
          >
            <div className="px-0 relative leading-8">
              <div className={`flex flex-row items-start justify-center`}>
                {landingPagesList?.items?.map((item, index) => {
                  return (
                    <Link
                      key={index}
                      onClick={resetActiveCategory}
                      href={`/promo/${item?.slug}`}
                      className="text-center mx-2 text-red-500 hover:translate-x-5 hover:text-slate-500 transition-all duration-300 text-sm font-medium block"
                    >
                      {item?.name}
                    </Link>
                  );
                })}
                {activeCategory?.data?.map((category, index) => {
                  return category?.children?.length > 0 ? (
                    <div className="relative" key={index}>
                      <button
                        className={`${
                          category?.id === activeSubCategory?.id ||
                          pathname.includes(category?.slug)
                            ? "font-normal"
                            : "font-light"
                        } mx-2 text-center text-[16px] hover:underline block text-white`}
                        onClick={() => {
                          setActiveSubCategory({
                            id:
                              category?.id === activeSubCategory?.id
                                ? null
                                : category?.id,
                            name:
                              category?.name === activeSubCategory?.name
                                ? null
                                : category?.name,
                            slug_path:
                              category?.link?.link_path ===
                              activeSubCategory?.link?.link_path
                                ? null
                                : category?.link?.link_path,
                            data:
                              category?.children === activeSubCategory?.data
                                ? []
                                : category?.children,
                            open: !activeSubCategory?.open,
                            image: category?.image ?? null,
                          });
                        }}
                      >
                        {category?.name}
                      </button>

                      {activeSubCategory &&
                        activeSubCategory.id === category.id && (
                          <div className="text-white w-full absolute h-auto bg-black px-2 pt-2 m-t-[4px]">
                            {activeSubCategory?.data?.map((childCategory) => (
                              <Link
                                href={`/${childCategory?.link?.link_path}`}
                                onClick={resetActiveCategory}
                                key={childCategory?.id}
                                className={`text-[16px] py-1 lowercase text-white first-letter:uppercase block hover:underline ${
                                  pathname?.includes(
                                    childCategory?.link?.link_path
                                  )
                                    ? "font-normal"
                                    : "font-light"
                                }`}
                              >
                                {childCategory.name}
                              </Link>
                            ))}
                            <hr className="my-2" />

                            <Link
                              className={`block text-[16px] font-light text-white/70 hover:underline my-3`}
                              href={`/${activeSubCategory?.slug_path}`}
                              onClick={() => {
                                resetActiveCategory();
                              }}
                            >
                              Pogledaj sve
                            </Link>
                          </div>
                        )}
                    </div>
                  ) : (
                    <Link
                      href={`/${category?.link?.link_path}`}
                      key={index}
                      className={`${
                        category?.id === activeCategory?.id
                          ? "activeCategory"
                          : "font-light"
                      } mx-2 text-center text-[16px] hover:underline block text-white`}
                      onClick={() => {
                        setActiveCategory({
                          id: null,
                          name: null,
                          slug: null,
                          data: [],
                          image: null,
                          open: false,
                        });
                      }}
                    >
                      {category?.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </header>
      <div
      // onClick={() => {
      //   setActiveCategory({
      //     open: false,
      //     id: null,
      //     name: null,
      //     slug: null,
      //     data: [],
      //     image: null,
      //   });
      // }}

      // className={
      //   activeCategory?.open
      //     ? "fixed top-0 left-0 h-screen w-screen transition-all duration-500 bg-black/50 backdrop-blur-md opacity-100 visible z-[99]"
      //     : "fixed top-0 left-0 h-screen w-screen transition-all duration-500 bg-black/50 backdrop-blur-md opacity-0 invisible z-[99]"
      // }
      />
    </>
  );
};

export default Header;
