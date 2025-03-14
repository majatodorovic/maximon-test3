"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { list } from "@/api/api";
import Link from "next/link";
import { currencyFormat } from "@/helpers/functions";
import useDebounce from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import noImage from "../../public/images/no-image-maximon.webp";

const SearchProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: searchData, isFetching } = useQuery({
    queryKey: ["searchData", debouncedSearch],
    queryFn: async () => {
      if (debouncedSearch?.length >= 3) {
        return await list(`/products/search/list`, {
          search: debouncedSearch,
        }).then((res) => {
          setLoading(false);
          return res?.payload;
        });
      }
      return [];
    },
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm?.length >= 3) {
      router.push(`/search?search=${searchTerm}`);
      setSearchTerm("");
      setShowSearch(false); // Hide after search
    }
  };

  return (
    <div className="relative">
      {/* Search icon - shows container when clicked */}
      {!showSearch && (
        <div className="cursor-pointer" onClick={() => setShowSearch(true)}>
          <Image
            src={"/icons/search.png"}
            width={22}
            height={22}
            className="object-cover"
            alt="search"
          />
        </div>
      )}

      {/* Container with the input field and dropdown */}
      {showSearch && (
        <div
          className="py-0 w-[200px] bg-topHeader relative"
          style={{ right: "-8px" }}
        >
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="PRETRAGA"
              autoFocus
              className="w-full h-[32px] py-0 px-5 bg-transparent text-sm font-normal border-0 text-black focus:outline-none focus:ring-0"
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setLoading(true);
              }}
              value={searchTerm}
              onBlur={() => {
                if (!searchTerm) setShowSearch(false); // Hide if input is empty on blur
              }}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Image
                src={"/icons/search.png"}
                width={22}
                height={22}
                className="object-cover"
                alt="search"
              />
            </div>

            {/* Search Results */}
            {debouncedSearch?.length >= 3 && (
              <div className="absolute flex flex-col h-[420px] overflow-y-auto bg-white top-[30px] right-0 w-full border rounded-b-lg z-[200]">
                {searchData?.items?.length > 0 ? (
                  <div className="w-[95%] mx-auto mt-5 ">
                    <p className="text-[1rem] font-normal ">
                      Rezultati pretrage
                    </p>
                    <div className="flex flex-col gap-5 mt-3 pb-5">
                      {searchData?.items?.slice(0, 6)?.map((item) => (
                        <Link
                          key={item?.link?.link_path}
                          href={`/${item?.link?.link_path}`}
                          onClick={() => setSearchTerm("")}
                        >
                          <div className="flex flex-row items-center gap-5">
                            <div className="w-[60px] h-[60px] relative">
                              <Image
                                src={item.image[0] || noImage}
                                alt=""
                                fill
                                sizes="100vw"
                                className="object-cover rounded-full"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <p className="text-[0.9rem] font-normal">
                                {item?.basic_data?.name}
                              </p>
                              <p className="text-[0.9rem] w-fit px-2 font-bold text-center">
                                {currencyFormat(
                                  item?.price?.price?.discount ??
                                    item?.price?.price?.original
                                )}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  !isFetching && (
                    <div className="w-[95%] mx-auto mt-5">
                      <span className="text-[0.9rem] font-normal">
                        Nema rezultata pretrage
                      </span>
                    </div>
                  )
                )}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default SearchProducts;

// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { list } from "@/api/api";
// import Link from "next/link";
// import { currencyFormat } from "@/helpers/functions";
// import useDebounce from "@/hooks/useDebounce";
// import { useQuery } from "@tanstack/react-query";

// const SearchProducts = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showSearch, setShowSearch] = useState(false)
//   const router = useRouter();
//   // const [searchData, setSearchData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const debouncedSearch = useDebounce(searchTerm, 500);

//   const { data: searchData, isFetching } = useQuery({
//     queryKey: ["searchData", debouncedSearch],
//     queryFn: async () => {
//       if (debouncedSearch?.length >= 3) {
//         return await list(`/products/search/list`, {
//           search: debouncedSearch,
//         }).then((res) => {
//           setLoading(false);
//           return res?.payload;
//         });
//       }
//       return [];
//     },
//     refetchOnWindowFocus: false,
//     enabled: true,
//   });

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchTerm?.length >= 3) {
//       router.push(`/search?search=${searchTerm}`);
//       setSearchTerm("");
//       setShowSearch(false);
//     }
//   };

//   const handleToggleSearch = () => {
//     setShowSearch(!showSearch)
//   }

//   return (
//     <div className="py-4 w-1/5 rounded-[10px] bg-topHeader relative">
//       <form onSubmit={(e) => handleSearch(e)}>
//         <input
//           type="text"
//           placeholder="PRETRAGA"
//           className="w-full h-full rounded-[10px] px-5 absolute top-0 left-0 bg-transparent text-sm font-normal border-0 text-black focus:outline-none focus:border-0  focus:ring-0"
//           onChange={(event) => {
//             setSearchTerm(event.target.value);
//             setLoading(true);
//           }}
//           value={searchTerm}
//         />
//         {searchTerm?.length >= 1 && searchTerm?.length < 3 ? (
//           <div className="absolute right-2 top-1/2 -translate-y-1/2 py-2">
//             <span className={`text-[0.8rem] font-normal text-red-500`}>
//               Unesite najmanje 3 karaktera.
//             </span>
//           </div>
//         ) : (
//           <div className="absolute right-2 top-1/2 -translate-y-1/2 py-2">
//             <Image
//               src={"/icons/search.png"}
//               width={20}
//               height={20}
//               className="object-cover"
//               alt="search"
//             />
//           </div>
//         )}
//         <div
//           className={`${
//             debouncedSearch?.length >= 3
//               ? `absolute flex flex-col h-[420px] hidescrollbar overflow-y-auto bg-white top-[30px] right-0 w-full border rounded-b-lg`
//               : `hidden`
//           } `}
//         >
//           {searchData?.items?.length > 0 && debouncedSearch?.length >= 3 ? (
//             <div className="w-[95%] mx-auto mt-5">
//               <p className="text-[1rem] font-normal">Rezultati pretrage</p>
//               <div className="flex flex-col gap-5 mt-3 pb-5">
//                 {searchData?.items?.slice(0, 6)?.map((item) => {
//                   return (
//                     <Link
//                       href={`/${item?.link?.link_path}`}
//                       onClick={(e) => {
//                         setSearchTerm("");
//                       }}
//                     >
//                       <div className="flex flex-row items-center gap-5">
//                         <div className="w-[60px] h-[60px] relative">
//                           <Image
//                             src={item.image[0]}
//                             alt={``}
//                             fill
//                             sizes="100vw"
//                             className={`object-cover rounded-full`}
//                           />
//                         </div>
//                         <div className="flex flex-col gap-1">
//                           <p className="text-[0.9rem] font-normal">
//                             {item?.basic_data?.name}
//                           </p>
//                           <p className="text-[0.9rem] w-fit bg-[#f8ce5d] px-2 font-bold text-center">
//                             {currencyFormat(
//                               item?.price?.price?.discount ??
//                                 item?.price?.price?.original
//                             )}
//                           </p>
//                         </div>
//                       </div>
//                     </Link>
//                   );
//                 })}
//               </div>
//             </div>
//           ) : (
//             !isFetching && (
//               <div className={`w-[95%] mx-auto mt-5`}>
//                 <span className={`text-[0.9rem] font-normal`}>
//                   Nema rezultata pretrage
//                 </span>
//               </div>
//             )
//           )}
//           {loading && (
//             <div className={`w-[95%] mx-auto text-center mt-5`}>
//               <i className={`fas fa-spinner fa-spin text-xl text-black`}></i>
//             </div>
//           )}
//           {!loading && searchData?.items?.length > 0 && (
//             <div
//               className={`sticky bottom-0 w-full bg-croonus-2 py-2 mt-auto text-center hover:bg-opacity-80`}
//             >
//               <button
//                 onClick={(e) => {
//                   handleSearch(e);
//                 }}
//                 className={`text-white w-full h-full font-light text-center`}
//               >
//                 Prikaži sve rezultate (
//                 {searchData?.pagination?.total_items > 10
//                   ? `još ${searchData?.pagination?.total_items - 10}`
//                   : `Pretraži`}
//                 )
//               </button>
//             </div>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// };

// export default SearchProducts;
