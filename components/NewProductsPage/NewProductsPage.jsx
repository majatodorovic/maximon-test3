"use client";
import { useState, useEffect, Suspense, useMemo } from "react";
import { list, post } from "@/api/api";
import Image from "next/image";
import Link from "next/link";
import {Thumb} from "@/components/Thumb/Thumb";
// import Filters from "./categories/Filters";
// import FiltersMobile from "./categories/FilterMobile";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Loading from "@/components/sections/categories/Loader";
import LoadingProducts from "@/components/LoadingProducts";
// import element from "@/assets/shapes/shape-brown.png";
// import element2 from "@/assets/shapes/shape-little-meat.png";
// import leaf from "@/assets/shapes/leaf-cut.png";
import { usePathname, useRouter } from "next/navigation";
import { Thumbs } from "swiper";
// import { ThumbSuspense } from "@/_components/thumb-suspense";
// import Filters from "../Filters/Filters";
import FiltersMobile from "../sections/categories/FilterMobile";
import Filters from "../sections/categories/Filters";

const NewProductsPage = ({
  filter,
  singleCategory,
  products,
  text,
  slug,
  sectionSlug,
  path,
}) => {
  const params = useSearchParams();
  const router = useRouter();
  // const [productData, setProductData] = useState({
  //   products: products?.items,
  //   pagination: products?.pagination,
  // });

  const [sort, setSort] = useState({ field: "", direction: "" });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [availableFilters, setAvailableFilters] = useState(filter);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [changeFilters, setChangeFilters] = useState(false);
  const [tempSelectedFilters, setTempSelectedFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastSelectedFilterKey, setLastSelectedFilterKey] = useState("");
  const [sumOfProducts,setSumOfProducts] = useState(null);
  const pathname = usePathname();

  const [lastScrollPos, setLastScrollPos] = useState(0);

  useEffect(() => {
    const savedScrollPos = parseInt(localStorage.getItem("scrollPos"), 10);
    if (!isNaN(savedScrollPos)) {
      setLastScrollPos(savedScrollPos);
    }
    const handleScroll = () => {
      const scrollPos = window.pageYOffset;
      setLastScrollPos(scrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const { data: productData, isFetching } = useQuery({
    queryKey: [
      "products",
      params?.get("strana"),
      limit,
      params?.get("sort"),
      params?.get("filteri"),
      slug,
    ],
    queryFn: async () => {
      // router.refresh();
      let sort_URL = (params?.get("sort") ?? "_")?.split("_");
      const sort_obj = {
        field: sort_URL[0] ?? "",
        direction: sort_URL[1] ?? "",
      };

      let page_URL = Number(params?.get("strana")) ?? 1;

      let filters_URL = (params?.get("filteri") ?? ",").split(",");

      const filters_arr_tmp = filters_URL?.map((filter) => {
        const selectedColumn = filter?.split("=")[0];
        const selectedValues_tmp = filter?.split("=")[1];
        const selectedValues = selectedValues_tmp?.split("_");

        return {
          column: selectedColumn,
          value: {
            selected: selectedValues,
          },
        };
      });

      if (filters_arr_tmp?.some((column) => column?.column)) {
        setSelectedFilters(filters_arr_tmp);
      } else {
        setSelectedFilters([]);
      }
      setPage(page_URL);
      setSort(sort_obj);
      return await list(`/products/new-in/list`, {
        sort: sort_obj ?? sort,
        page: page_URL ?? page,
        limit: limit,
        filters: filters_arr_tmp?.every((column) => column?.column)
          ? filters_arr_tmp
          : [],
        render: false,
      }).then((res) => {
        setChangeFilters(true);
        return res?.payload;
      });
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (changeFilters) {
      post("/products/new-in/filters", {
        filters: selectedFilters,
      }).then((response) => {
        const lastSelectedFilterValues = selectedFilters?.find((item) => {
          return item?.column === lastSelectedFilterKey;
        });

        const lastSelectedFilter = availableFilters?.find((item) => {
          return item?.key === lastSelectedFilterKey;
        });

        const filterLastSelectedFromResponse = response?.payload?.filter(
          (item) => {
            return item?.key !== lastSelectedFilterKey;
          },
        );

        const indexOfLastSelectedFilter = availableFilters?.findIndex(
          (index) => {
            return index?.key === lastSelectedFilterKey;
          },
        );

        if (
          lastSelectedFilter &&
          lastSelectedFilterValues?.value?.selected?.length > 0
        ) {
          setAvailableFilters([
            ...filterLastSelectedFromResponse.slice(
              0,
              indexOfLastSelectedFilter,
            ),
            lastSelectedFilter,
            ...filterLastSelectedFromResponse.slice(indexOfLastSelectedFilter),
          ]);
        } else {
          setAvailableFilters(response?.payload);
        }
      });
      setChangeFilters(false);
    }
  }, [changeFilters]);

  useEffect(() => {
    setSumOfProducts(productData?.items?.length);
  },[productData]);

  const [productsPerView, setProductsPerView] = useState(4);
  const [productsPerViewMobile, setProductsPerViewMobile] = useState(2);
  const [filterOpen, setFilterOpen] = useState(false);

  const updateURLQuery = (sort, page, selectedFilters) => {
    let sort_tmp;
    let page_tmp;
    let filters_tmp;

    if (sort?.field !== "" && sort?.direction !== "") {
      sort_tmp = `${sort?.field}_${sort?.direction}`;
    }
    if (page > 1) {
      page_tmp = page;
    }

    if (selectedFilters?.length > 0) {
      filters_tmp = selectedFilters?.map((filter) => {
        const selectedValues = filter?.value?.selected?.join("_");
        return `${filter?.column}=${selectedValues}`;
      });
    } else {
      filters_tmp = "";
    }

    return { sort_tmp, page_tmp, filters_tmp };
  };

  //ne koristiti singleCategory.slug_path, jer dolazi do infinite loop-a, iz razloga sto strana vidi samo poslednji segment, a slug path sadrzi /
  const slug_path = singleCategory?.slug ?? sectionSlug;
  useEffect(() => {
    const { sort_tmp, page_tmp, filters_tmp } = updateURLQuery(
      sort,
      page,
      selectedFilters,
    );

    let queryString = "";

    switch (true) {
      case slug:
        switch (true) {
          case sort_tmp && !page_tmp && !filters_tmp:
            queryString = `${sectionSlug}?sort=${sort_tmp}`;

            break;
          case sort_tmp && page_tmp && !filters_tmp:
            queryString = `${sectionSlug}?sort=${sort_tmp}&strana=${page_tmp}`;

            break;
          case sort_tmp && filters_tmp && !page_tmp:
            queryString = `${sectionSlug}?filteri=${filters_tmp}&sort=${sort_tmp}`;

            break;
          case page_tmp && !sort_tmp && !filters_tmp:
            queryString = `${sectionSlug}?strana=${page_tmp}`;

            break;
          case page_tmp && sort_tmp && !filters_tmp:
            queryString = `${sectionSlug}?sort=${sort_tmp}&strana=${page_tmp}`;

            break;
          case filters_tmp && !sort_tmp && !page_tmp:
            queryString = `${sectionSlug}?filteri=${filters_tmp}`;

            break;
          case page_tmp && sort_tmp && filters_tmp:
            queryString = `${sectionSlug}?filteri=${filters_tmp}&sort=${sort_tmp}&strana=${page_tmp}`;

            break;
          case !sort_tmp && !page_tmp && !filters_tmp:
            queryString = sectionSlug;

            break;
          default:
            queryString = sectionSlug;

            break;
        }
        break;
      case !slug:
        switch (true) {
          case sort_tmp && !page_tmp && !filters_tmp:
            queryString = `${slug_path}?sort=${sort_tmp}`;

            break;
          case sort_tmp && page_tmp && !filters_tmp:
            queryString = `${slug_path}?sort=${sort_tmp}&strana=${page_tmp}`;

            break;
          case sort_tmp && filters_tmp && !page_tmp:
            queryString = `${slug_path}?filteri=${filters_tmp}&sort=${sort_tmp}`;

            break;
          case page_tmp && !sort_tmp && !filters_tmp:
            queryString = `${slug_path}?strana=${page_tmp}`;

            break;
          case page_tmp && sort_tmp && !filters_tmp:
            queryString = `${slug_path}?sort=${sort_tmp}&strana=${page_tmp}`;

            break;
          case filters_tmp && !sort_tmp && !page_tmp:
            queryString = `${slug_path}?filteri=${filters_tmp}`;

            break;
          case page_tmp && sort_tmp && filters_tmp:
            queryString = `${slug_path}?filteri=${filters_tmp}&sort=${sort_tmp}&strana=${page_tmp}`;

            break;
          case !sort_tmp && !page_tmp && !filters_tmp:
            queryString = slug_path;

            break;
          default:
            queryString = slug_path;

            break;
        }
        break;

      default:
        break;
    }
    router.push(queryString, { scroll: false });
  }, [sort, selectedFilters, page]);

  const getPaginationArray = (selectedPage, totalPages) => {
    const start = Math.max(1, selectedPage - 2);
    const end = Math.min(totalPages, start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // const memoizedItems = useMemo(() => {
  //   return productData?.items?.map(({ id }) => {
  //     return (
  //       <Suspense
  //         key={id}
  //         fallback={
  //           <div
  //             className={`col-span-1 aspect-2/3 h-full w-full animate-pulse bg-slate-300`}
  //           />
  //         }
  //       >
  //         <Thumb categoryId={path} id={id} />
  //       </Suspense>
  //     );
  //   });
  // }, [productData, path]);

  return (
    <div>
      <div className="">
        <div className="mt-10 md:mt-12 flex flex-col items-center justify-center">
        <div className="flex flex-row  items-center justify-center">
          <h1 className="text-[22px] font-bold uppercase">
              Novi proizvodi
            <span className="font-light text-black/50"> ({sumOfProducts})</span>
          </h1>
        </div>
        <p
                  className="relative z-[2] max-w-[36.075rem] pl-[1.5rem] text-[18px] leading-[29px] max-md:font-extralight sm:mt-[1rem] md:text-[26px] md:font-thin"
                  dangerouslySetInnerHTML={{
                    __html: singleCategory?.basic_data?.short_description,
                  }}
                ></p>
        </div>
      </div>
      <div className="mt-[37px] max-md:hidden">
        <Filters
          selectedFilters={selectedFilters}
          availableFilters={availableFilters}
          setSelectedFilters={setSelectedFilters}
          sort={sort}
          setPage={setPage}
          setSort={setSort}
          changeFilters={changeFilters}
          pagination={productData?.pagination}
          setProductsPerView={setProductsPerView}
          productsPerView={productsPerView}
          setTempSelectedFilters={setTempSelectedFilters}
          setLastSelectedFilterKey={setLastSelectedFilterKey}
          setChangeFilters={setChangeFilters}
          filter={filter}
        />
      </div>
      <div
        className={`sticky top-[5.8rem] z-[300] mx-auto mt-[60px] flex w-[92%] items-center gap-5 rounded-[22px] bg-black py-2 pl-2 pr-4 text-white md:hidden`}
      >
        <button
          className={`flex w-fit flex-1 items-center justify-center rounded-[18px] border py-2 text-center text-[16px] md:text-[1.2rem]`}
          onClick={() => setFilterOpen(true)}
        >
          Filteri
        </button>
        <div className={`flex items-center gap-3`}>
          {/*a div 40px high and 40px wide*/}
          <div
            className={`h-[30px] w-[30px] border-2 ${productsPerViewMobile === 1 && "border-white"
              }`}
            onClick={() => setProductsPerViewMobile(1)}
          ></div>
          {/*a div 40px high and 40px wide that has 9 smaller squares inside*/}
          <div
            className={`grid h-[30px] w-[30px] grid-cols-2 border ${productsPerViewMobile === 2 && "border-white"
              }`}
            onClick={() => setProductsPerViewMobile(2)}
          >
            {Array.from({ length: 4 }, (_, i) => {
              return (
                <div
                  key={i}
                  className={`col-span-1 border ${productsPerViewMobile === 2 && "border-white"
                    }`}
                ></div>
              );
            })}
          </div>
        </div>
      </div>
      <>
      
    <div className={`px-[9rem]  max-lg:hidden`}>
          <div
            className={`mt-[4rem] ${productsPerView === 2 && "mx-auto w-[50%]"
              } grid grid-cols-${productsPerView} gap-x-[30px] gap-y-10 3xl:gap-x-[80px] `}
          >
            {productData?.items?.map(({ id }) => {
      return (
        <Suspense
          key={id}
          fallback={
            <div
              className={`col-span-1 aspect-2/3 h-full w-full animate-pulse bg-slate-300`}
            />
          }
        >
          <div className="w-[390px]">
          <Thumb slug={id} id={id} />
          </div>
          
        </Suspense>
      );
    })}
          </div>
        </div>
        <div className={`mx-auto w-[95%]  lg:hidden`}>
          <div
            className={`mt-[50px] grid grid-cols-${productsPerViewMobile} gap-x-[20px] gap-y-[36px] max-md:gap-x-[10px] md:grid-cols-3`}
          >
            {productData?.items?.map(({ id }) => {
      return (
        <Suspense
          key={id}
          fallback={
            <div
              className={`col-span-1 aspect-2/3 h-full w-full animate-pulse bg-slate-300`}
            />
          }
        >
          <Thumb slug={id} id={id} />
        </Suspense>
      );
    })}
          </div>
        </div>
        {/* <div className={`px-[7rem] max-lg:hidden`}>
          <div
            className={`mt-[4rem] ${productsPerView === 2 && "mx-auto w-[50%]"
              } grid grid-cols-${productsPerView} gap-x-[30px] gap-y-10 3xl:gap-x-[80px]`}
          >
            {memoizedItems}
          </div>
        </div>
        <div className={`mx-auto w-[95%] lg:hidden`}>
          <div
            className={`mt-[50px] grid grid-cols-${productsPerViewMobile} gap-x-[20px] gap-y-[36px] max-md:gap-x-[10px] md:grid-cols-3`}
          >
            {memoizedItems}
          </div>
        </div> */}
      </>

      {productData?.pagination?.total_pages > 1 && (
        <div
          className={`mt-10 flex items-center justify-center gap-1 px-[3rem] py-2`}
        >
          {getPaginationArray(
            productData.pagination.selected_page,
            productData.pagination.total_pages,
          ).map((num, index, array) => (
            <>
              {index === 0 && num !== 1 && (
                <>
                  <span
                    className={`cursor-pointer select-none rounded-lg border border-white px-3 py-1 hover:border-[#04b400] hover:text-[#04b400]`}
                    onClick={() => {
                      setPage(1);
                      window.scrollTo(0, 0);
                      setLoading(true);
                    }}
                  >
                    1
                  </span>
                  {num - 1 !== 1 && (
                    <span className={`select-none rounded-lg px-3 py-1`}>
                      ...
                    </span>
                  )}
                </>
              )}
              {index > 0 && num - array[index - 1] > 1 && (
                <span className={`select-none rounded-lg px-3 py-1`}>...</span>
              )}
              <span
                className={`${num === productData.pagination.selected_page
                  ? "cursor-pointer select-none rounded-xl bg-black px-5 py-2 text-[20px] text-white"
                  : "cursor-pointer select-none rounded-xl bg-black/20 px-5 py-2 text-[20px] text-white hover:bg-[#00000060]"
                  }`}
                onClick={() => {
                  setPage(num);
                  window.scrollTo(0, 0);
                  setLoading(true);
                }}
              >
                {num}
              </span>
              {index === array.length - 1 &&
                num !== productData.pagination.total_pages && (
                  <>
                    {productData.pagination.total_pages - num !== 1 && (
                      <span className={`select-none rounded-lg px-3 py-1`}>
                        ...
                      </span>
                    )}
                    <span
                      className={`cursor-pointer select-none rounded-xl bg-black/20 px-5 py-2 text-[20px] text-white hover:bg-[#00000060]`}
                      onClick={() => {
                        setPage(productData.pagination.total_pages);
                        window.scrollTo(0, 0);
                        setLoading(true);
                      }}
                    >
                      {productData.pagination.total_pages}
                    </span>
                  </>
                )}
            </>
          ))}
        </div>
      )}
      <div
        className={
          filterOpen
            ? `fixed left-0 top-0 z-[3000] h-[100dvh] w-full translate-x-0 bg-white duration-500`
            : `fixed left-0 top-0 z-[3000] h-[100dvh] w-full -translate-x-full bg-white duration-500`
        }
      >
        <FiltersMobile
          selectedFilters={selectedFilters}
          availableFilters={availableFilters}
          setSelectedFilters={setSelectedFilters}
          sort={sort}
          setPage={setPage}
          setSort={setSort}
          changeFilters={changeFilters}
          pagination={productData?.pagination}
          setProductsPerView={setProductsPerView}
          productsPerView={productsPerView}
          setFilterOpen={setFilterOpen}
          setTempSelectedFilters={setTempSelectedFilters}
          setChangeFilters={setChangeFilters}
          tempSelectedFilters={tempSelectedFilters}
          setLastSelectedFilterKey={setLastSelectedFilterKey}
        />
      </div>
    </div>
  );
};

export default NewProductsPage;
