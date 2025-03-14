"use client";
import { list } from "@/api/api";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { currencyFormat } from "@/helpers/functions";
import useDebounce from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import {
  useCartBadge,
  useCategoryTree,
  useLandingPages,
  useWishlistBadge,
} from "@/hooks/ecommerce.hooks";

const NavigationMobile = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { data: categories } = useCategoryTree();
  const { data: landingPagesList } = useLandingPages();
  const { data: cartCount, refetch } = useCartBadge();
  const { data: wishListCount } = useWishlistBadge();

  const [menuOpen, setMenuOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [activeCategory, setActiveCategory] = useState({
    id: undefined,
    data: [],
    parentCategory: undefined,
    firstCategory: null,
  });

  let exActiveIds = [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm?.length >= 3) {
      router.push(`/search?search=${searchTerm}`);
      setSearchOpen(false);
      setSearchTerm("");
    }
  };
  useEffect(() => {
    const handleBodyOverflow = () => {
      if (menuOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    };
    handleBodyOverflow();
  }, [menuOpen]);
  useEffect(() => {
    if (!pathname?.includes("/")) {
      setActiveCategory({
        id: categories[0]?.id ?? 0,
        data: categories[0]?.children ?? [],
        parentCategory: categories[0]?.id ?? 0,
        firstCategory: true,
      });
    }
  }, [categories]);

  const [searchVisible, setSearchVisible] = useState(false);

  useEffect(() => {
    const handleScrollIconDisappear = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 300) {
        setSearchVisible(true);
      } else {
        setSearchVisible(false);
      }
    };

    window.addEventListener("scroll", handleScrollIconDisappear);
    return () => {
      window.removeEventListener("scroll", handleScrollIconDisappear);
    };
  }, []);

  useEffect(() => {
    if (pathname?.includes("/korpa/")) {
      refetch();
      router?.refresh();
    }
  }, [pathname]);

  const debouncedSearch = useDebounce(searchTerm, 500);
  const { data: searchData, isFetching } = useQuery({
    queryKey: ["searchData", debouncedSearch],
    queryFn: async () => {
      if (debouncedSearch?.length >= 3) {
        return await list(`/products/search/list`, {
          search: debouncedSearch,
        }).then((res) => {
          return res?.payload;
        });
      }
    },
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const categoriesMain = [
    { name: "Novo", slug: "novo", isCategory: false },
    ...categories,
    {name: "Kontakt", slug: "kontakt", isCategory: false },
    {name: "O nama", slug: "o-nama", isCategory: false }
  ];

  const [openCategory, setOpenCategory] = useState(null);

  const toggleCategory = (name) => {
    setOpenCategory((prev) => (prev === name ? null : name));
  };

  return (
    <>
      <div className="lg:hidden w-full z-[2000] sticky top-0 bg-white bg-opacity-90 backdrop-blur-md">
        <div className="w-[95%] py-3 mx-auto flex justify-between items-center">
          <div onClick={() => setMenuOpen(true)}>
            <Image
              alt={`HAMBURGER ICON`}
              src={"/icons/hamburger.png"}
              width={50}
              height={40}
            />
          </div>
          <Link
            href="/"
            className="absolute left-16 m-auto w-[170px] flex align-center justify-center"
          >
            <div className="relative">
              <Image
                alt={`logo`}
                src={"/images/logo/logo.png"}
                width={150}
                height={33}
                className="w-36 h-auto"
              />
            </div>
          </Link>
          <div className="relative flex items-center gap-0">
            <Link href="/korpa">
              <div className="relative">
                <Image
                  src="/icons/shopping-bag.png"
                  width={25}
                  height={25}
                  className="object-cover h-auto mr-5"
                  alt="shopping-bag"
                />
                {cartCount != 0 && (
                  <span className="absolute -top-3 text-white right-2 bg-[#e10000] rounded-full w-5 h-5 flex items-center justify-center  text-xs">
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
                  className="object-cover h-auto"
                  alt="heart"
                />
                {wishListCount != 0 && (
                  <span className="absolute -top-2.5 text-white -right-2 bg-[#e10000] rounded-full w-5 h-5 flex items-center justify-center  text-xs">
                    {wishListCount}
                  </span>
                )}
              </div>
            </Link>

            {pathname === "/" ? (
              <div
                className={
                  searchVisible
                    ? `visible transition-all duration-500 opacity-100`
                    : `invisible transition-all duration-500 opacity-0`
                }
                style={searchVisible ? {} : { display: "none" }}
              >
                <Image
                  src="/icons/search.png"
                  alt="search icon"
                  id="search"
                  width={22}
                  height={22}
                  onClick={() => setSearchOpen(true)}
                  className="ml-5"
                />
              </div>
            ) : (
              <div>
                <Image
                  src={"/icons/search.png"}
                  alt="search icon"
                  id="search"
                  width={22}
                  height={22}
                  onClick={() => setSearchOpen(true)}
                  className="ml-5"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={
          searchVisible
            ? `text-white ${
                pathname === "/" ? `flex items-center justify-center` : `hidden`
              } md:hidden bg-transparent  invisible sticky top-[60px] transition-all duration-500 opacity-0 z-[4000] `
            : `text-white ${
                pathname === "/" ? `flex items-center justify-center` : `hidden`
              } md:hidden bg-transparent visible sticky top-[60px] z-[4000] transition-all duration-500 opacity-100 `
        }
      >
        <form
          className="w-[95%] mx-auto h-12 mt-12 py-2 flex items-center absolute"
          onClick={() => setSearchOpen(true)}
        >
          <div
            type="text"
            className="w-full h-full bg-transparent focus:border-white focus:outline-none focus:ring-0 placeholder:text-white text-white text-xs border-white border  rounded-lg py-2 pl-8 mix-blend-difference placeholder:text-xs"
            placeholder="Pretraga"
            onChange={(e) => setSearchTerm(e.target.value)}
            onMouseDown={() => setSearchOpen(true)}
          />
          <p className="absolute left-8 text-sm">Pretraga</p>
          <i className="text-xs text-white fa-solid fa-search absolute left-2 top-5"></i>
        </form>
      </div>
      <div
        className={
          menuOpen
            ? `translate-x-0 flex flex-col h-screen z-[5000] w-full duration-500 transition-all fixed bg-white top-0 left-0`
            : `-translate-x-full flex flex-col h-screen z-[5000] w-full duration-500 transition-all fixed bg-white top-0 left-0`
        }
      >
        <div className="w-[95%]  mx-auto flex items-center justify-between py-3.5">
          <Image
            src="/images/logo/logo.png"
            width={150}
            height={150}
            alt="logo"
            className="w-36 h-auto"
          />
          <i
            className="fas fa-times text-4xl"
            onClick={() => setMenuOpen(false)}
          ></i>
        </div>

        <div className="flex flex-col mt-10 w-[95%] mx-auto gap-3">
          {(landingPagesList?.items ?? [])?.map((item, index) => {
            return (
              <Link
                key={item?.id}
                onClick={() => {
                  setMenuOpen(false);
                }}
                href={`/promo/${item?.slug}`}
                className="text-red-500 text-[1.2rem] uppercase animate-pulse"
              >
                {item?.name}
              </Link>
            );
          })}
          {(categoriesMain ?? []).map((category) => (
            <div
              key={category.name}
              className={`flex flex-col ${
                category.children ? "cursor-pointer" : ""
              }`}
              onClick={() => {
                if (category.children) {
                  toggleCategory(category.name);
                }
              }}
            >
              <div className="flex justify-between items-center">
                {category.children ? (
                  <div className="text-[2rem] uppercase flex-1">
                    {category?.name}
                  </div>
                ) : (
                  <Link
                    href={`/${category?.slug}`}
                    className="text-[2rem] uppercase flex-1"
                    onClick={() => {
                      setOpenCategory(null);
                      setMenuOpen(false);
                    }}
                  >
                    {category?.name}
                  </Link>
                )}
                {category.children && (
                  <Image
                    src="/icons/right-chevron.png"
                    width={15}
                    height={15}
                    className="object-cover"
                    alt="right-chevron"
                    style={{
                      transform:
                        openCategory === category.name
                          ? "rotate(90deg)"
                          : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                )}
              </div>
              {openCategory === category.name && category.children && (
                <div className="ml-4 mt-2 flex flex-col gap-2">
                  {category.children.map((child) => (
                    <Link
                      key={child.name}
                      href={`/${child.link.link_path}`}
                      className="text-[1.3rem] uppercase"
                      onClick={() => {
                        setOpenCategory(null);
                        setMenuOpen(false);
                      }}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {/* {(categoriesMain ?? [])?.map((category) => (
            <Link
              key={category?.name}
              onClick={() => {
                setMenuOpen(false);
              }}
              href={`${category?.slug}`}
              className={`text-[1.2rem] uppercase`}
            >
              {category?.name}
            </Link>
          ))} */}
        </div>
      </div>
      {menuOpen && (
        <div
          className="fixed top-0 left-0 bg-black bg-opacity-40 h-screen w-screen z-[4000]"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
      {searchOpen && (
        <div className="fixed top-0 left-0 bg-white  w-screen h-screen z-[10000]">
          <div className="w-[95%] mt-6 mx-auto flex items-center gap-2">
            <form onSubmit={handleSearch} className="relative w-[90%] ">
              <input
                type="text"
                className="w-full border  border-[#191919] focus:border-[#191919] focus:outline-none focus:ring-0 placeholder:text-base rounded-lg pl-10"
                placeholder="Unesite pojam za pretragu "
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
              <i className="fas fa-search absolute top-1/2 transform -translate-y-1/2 text-sm left-3 text-[#191919]"></i>
              {searchTerm?.length >= 1 && searchTerm?.length < 3 ? (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 py-2">
                  <span className={`text-[0.8rem] font-normal text-red-500`}>
                    Unesite najmanje 3 karaktera.
                  </span>
                </div>
              ) : null}
            </form>
            <p
              className="text-xs"
              onClick={() => {
                setSearchOpen(false);
                setSearchTerm("");
              }}
            >
              Otkaži
            </p>
          </div>
          {searchData?.items?.length > 0 && searchTerm?.length > 0 && (
            <div className="w-[95%] mx-auto mt-5">
              <p className="text-[1rem] font-normal">Rezultati pretrage</p>
              <div className="flex flex-col gap-5 mt-3">
                {searchData?.items?.slice(0, 6)?.map((item) => {
                  return (
                    <Link
                      key={item?.id}
                      href={`/${item?.link?.link_path}`}
                      onClick={(e) => {
                        setSearchData([]);
                        setSearchOpen(false);
                        handleSearch(e);
                        setSearchTerm("");
                      }}
                    >
                      <div className="flex flex-row items-center gap-5">
                        <div className="w-[60px] h-[60px] relative">
                          <Image
                            src={item.image[0]}
                            alt={``}
                            fill
                            sizes="100vw"
                            className={`object-cover rounded-full`}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-[0.9rem] font-normal">
                            {item?.basic_data?.name}
                          </p>
                          <p className="text-[0.9rem] w-fit bg-[#f8ce5d] px-2 font-bold text-center">
                            {currencyFormat(
                              item?.price?.price?.discount ??
                                item?.price?.price?.original
                            )}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
                {searchData?.items?.length > 6 && (
                  <Link
                    href={`/search?search=${searchTerm}`}
                    className={`text-[0.9rem] text-center text-white bg-[#191919] mt-4 py-3 w-[80%] mx-auto font-normal`}
                    onClick={(e) => {
                      setSearchData([]);
                      setSearchOpen(false);
                      handleSearch(e);
                      setSearchTerm("");
                    }}
                  >
                    {`Pogledaj sve rezultate ( još ${
                      searchData?.pagination?.total_items -
                      (searchData?.items?.length > 6
                        ? 6
                        : searchData?.items?.length)
                    } )`}
                  </Link>
                )}
              </div>
            </div>
          )}
          {isFetching && (
            <div className={`w-[95%] mx-auto text-center mt-5`}>
              <i className={`fas fa-spinner fa-spin text-xl text-black`}></i>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default NavigationMobile;
