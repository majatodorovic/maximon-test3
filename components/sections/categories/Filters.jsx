"use client";
import Filter from "./Filter";
import { sortKeys } from "@/helpers/const";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import classes from "./Filters.module.css";

const Filters = ({
  availableFilters,
  selectedFilters,
  setSelectedFilters,
  setSort,
  sort,
  pagination,
  products,
  setProductsPerView,
  productsPerView,
  setTempSelectedFilters,
  setLastSelectedFilterKey,
  setChangeFilters,
  filter,
  setPage,
}) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [openSort, setOpenSort] = useState({
    open: false,
    key: {
      field: "",
      direction: "",
    },
  });

  const [activeFilter, setActiveFilter] = useState(null);
  const handleClick = (filter) => {
    setActiveFilter(filter);
  };
  const [activeFilters, setActiveFilters] = useState([]);
  useEffect(() => {
    setActiveFilters(selectedFilters);
  }, [selectedFilters]);

  const [activeSortFilter, setActiveSortFilter] = useState(null);

  const filterRef = useRef(null);

  const handleClickInsideAndOutside = (e) => {
    // Close the filter if the click occurred outside of it or if the user clicked on the filter

    if (
      (!filterRef?.current?.contains(e.target) ||
        e.target?.classList?.contains("filter")) &&
      openIndex !== null
    ) {
      setOpenIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickInsideAndOutside);
    return () => {
      document.removeEventListener("click", handleClickInsideAndOutside);
    };
  }, [openIndex]);

  const sortRef = useRef(null);

  const handleClickInsideAndOutsideSort = (e) => {
    if (
      (!sortRef?.current?.contains(e.target) ||
        e.target?.classList?.contains("sortref")) &&
      openSort !== false
    ) {
      setOpenSort({
        ...openSort,
        open: false,
      });
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickInsideAndOutsideSort);
    return () => {
      document.removeEventListener("click", handleClickInsideAndOutsideSort);
    };
  }, [openSort]);

  const params = useSearchParams();
  const sortParam = params?.get("sort") ?? "_";

  const keys = sortParam?.split("_");

  useEffect(() => {
    if (sortParam) {
      setSort({
        field: keys[0],
        direction: keys[1],
      });
    }
  }, [sortParam]);

  let filterWrapSize = 4;

  if (availableFilters) {
    switch (availableFilters.length) {
      case 1:
      case 2:
        filterWrapSize = 4;
        break;
      case 3:
      case 4:
      case 5:
      case 6:
        filterWrapSize = availableFilters.length;
        break;
      case 9:
      case 10:
        filterWrapSize = 5;
        break;
      case 11:
      case 12:
        filterWrapSize = 6;
        break;
      default:
        filterWrapSize = 5;
        break;
    }
  }

  return (
    <>
      <div className="relative h-[42px] mb-[80px] w-[90%] 2xl:w-[85%] m-auto">
        <div className="flex items-start justify-start absolute max-sm:w-full">
          <div className="flex flex-row gap-2 items-center cursor-pointer mr-8">
            <h1 className=" text-base font-light text-center uppercase leading-[52px]">
              Sortiranje
            </h1>
          </div>

          <div
            ref={sortRef}
            className="sortref z-[2] border border-black/70 flex flex-col items-center justify-end w-[250px] mr-8"
          >
            <p
              className="text-center w-full py-[13px] px-4 uppercase text-black/50 text-[16px] font-normal"
              onClick={() => {
                setOpenSort({
                  open: !openSort.open,
                  key: {
                    field: "",
                    direction: "",
                  },
                });
              }}
            >
              {activeSortFilter ? activeSortFilter.label : "Izaberi"}
            </p>

            {openSort &&
              openSort.open &&
              sortKeys.map((key, index) => {
                const isActive =
                  openSort?.key?.field === key?.field &&
                  openSort?.key?.direction === key?.direction;

                if (activeSortFilter && activeSortFilter?.label === key?.label)
                  return;

                return (
                  <div
                    key={`${index}-sortKey`}
                    className={`uppercase text-black/50 text-center w-full py-2 px-4 cursor-pointer text-[16px] font-normal ${
                      isActive ? "" : "bg-white "
                    }`}
                    onClick={() => {
                      setSort({
                        field: key?.field,
                        direction: key?.direction,
                      });
                      setOpenSort({
                        open: false,
                        key: {
                          field: key?.field,
                          direction: key?.direction,
                        },
                      });
                      setActiveSortFilter(key);
                    }}
                  >
                    <h1
                      className={` sortref ${
                        isActive ? `text-black` : ``
                      } hover:text-black`}
                    >
                      {key?.label}
                    </h1>
                  </div>
                );
              })}
          </div>

          {(activeSortFilter || selectedFilters?.length > 0) && (
            <p
              className="uppercase underline font-light leading-[52px] text-[16px] cursor-pointer"
              onClick={() => {
                setSort({
                  field: "",
                  direction: "",
                });

                setOpenSort({
                  open: false,
                  key: {
                    field: "",
                    direction: "",
                  },
                });

                setActiveSortFilter(null);
                setSelectedFilters([]);
                setChangeFilters(true);
                setOpenIndex(null);
              }}
            >
              Obriši sve filtere
            </p>
          )}
        </div>
      </div>
      <div className=" w-[90%] 2xl:w-[85%] mb-[80px] m-auto flex items-center justify-between">
        <div
          className="grid items-center w-full"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${filterWrapSize}, minmax(0, 1fr))`,
          }}
        >
          {(availableFilters ?? []).map((filter, index) => {
            const isSelectedFilter = selectedFilters.some(
              (selectedFilter) => selectedFilter.column === filter.key
            );
            const isOpen = openIndex === index;

            return (
              <div
                key={`${index}-filters`}
                className="relative max-lg:hidden filter h-[100%] w-full"
              >
                <div
                  className="relative select-none cursor-pointer filter h-[100%] box-content"
                  key={filter?.id}
                  onClick={() => {
                    setOpenIndex(openIndex === index ? null : index);
                  }}
                >
                  <div
                    className={`${classes.filterOverflow} relative py-[0.85rem] flex items-center justify-between filter gap-2 px-2 h-[100%] overflow-auto`}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderTop: `${
                        isSelectedFilter
                          ? "2px solid #b9bcc1"
                          : "1px solid #e5e7eb"
                      }`,
                      borderRight: `${
                        (index + 1) % filterWrapSize === 0 ||
                        index + 1 === availableFilters.length
                          ? "1px solid #e5e7eb"
                          : "0px solid #e5e7eb"
                      }`,
                    }}
                  >
                    <h4 className="text-center filter font-normal uppercase text-black/40 text-[14px]">
                      {filter?.attribute?.name}
                    </h4>
                    <Image
                      className={`w-4 h-auto opacity-70
                        ${
                          isOpen
                            ? `rotate-180 filter transition-all duration-500`
                            : `rotate-0 filter transition-all duration-500`
                        }`}
                      src={`/icons/chevron.png`}
                      alt={`TFY Production`}
                      width={15}
                      height={15}
                    />
                  </div>
                </div>

                {isOpen && (
                  <div
                    ref={filterRef}
                    className={` z-[20] ${
                      filter?.name === "Cena" && "w-full"
                    } w-full bg-white border-l border-r border-b border-[#f2f2f2] border-t left-0 absolute`}
                  >
                    <div
                      className={`${classes.filterOverflowSm} pb-3.5 filter overflow-auto`}
                    >
                      <Filter
                        filter={filter}
                        availableFilters={availableFilters}
                        selectedFilters={selectedFilters}
                        setSelectedFilters={setSelectedFilters}
                        setTempSelectedFilters={setTempSelectedFilters}
                        setLastSelectedFilterKey={setLastSelectedFilterKey}
                        setChangeFilters={setChangeFilters}
                        setPage={setPage}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Filters;
