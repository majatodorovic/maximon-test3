"use client";

import {
  useProductDeclaration,
  useProductSpecification,
} from "@/hooks/ecommerce.hooks";
import React, { useState } from "react";
import Image from "next/image";

export const Specifications = ({ id }) => {
  const { data: specification } = useProductSpecification({ slug: id });
  const { data: declaration } = useProductDeclaration({ slug: id });

  const [activeTab, setActiveTab] = useState(2);

  return (
    <div
      className={`specifications-component flex mt-6 ml-0 md:mt-8 flex-col divide-y md:max-w-[100%] overflow-y-auto`}
    >
      {specification?.length > 0 &&
        specification?.map((item) => {
          return (
            <div key={item?.set?.id}>
              <div
                onClick={() =>
                  setActiveTab(
                    activeTab === item?.set?.id ? null : item?.set?.id
                  )
                }
                className={` hover:bg-[#f8f8f8] ${
                  activeTab === item?.set?.id && "bg-[#f8f8f8]"
                } py-3 cursor-pointer flex items-center justify-between`}
              >
                <span className={`uppercase font-light`}>
                  {item?.groups[0]?.group?.name}
                </span>
                <i
                  className={`fa fa-solid pr-2 transition-all duration-500 fa-chevron-${
                    activeTab === item?.set?.id ? "up" : "down"
                  }`}
                />
              </div>
              {activeTab === item?.set?.id && (
                <div
                  className={`py-4 pl-6 pr-3 max-h-[150px] overflow-y-auto customScroll`}
                >
                  <p className={`text-sm`}>
                    {item?.groups[0]?.attributes.map((attribute) =>
                      attribute.values.map((value) => (
                        <p
                          className={`font-medium flex align-middle mb-1`}
                          key={value?.id}
                        >
                          {value?.image ? (
                            <Image
                              src={value.image}
                              width={18}
                              height={18}
                              style={{
                                objectFit: "cover",
                              }}
                              className="mr-2"
                              alt={value.image}
                            />
                          ) : (
                            <span></span>
                          )}{" "}
                          <span>{value?.name}</span>
                        </p>
                      ))
                    )}
                  </p>
                </div>
              )}
            </div>
          );
        })}

      <div>
        <div
          onClick={() =>
            setActiveTab(activeTab === "declaration" ? null : "declaration")
          }
          className={` hover:bg-[#f8f8f8] ${
            activeTab === "declaration" && "bg-[#f8f8f8]"
          } py-3 cursor-pointer flex items-center font-light justify-between`}
        >
          DEKLARACIJA{" "}
          <i
            className={`fa fa-solid pr-2 transition-all duration-500 fa-chevron-${
              activeTab === "declaration" ? "up" : "down"
            }`}
          />
        </div>
        {activeTab === "declaration" && (
          <div
            className={`py-4 pl-6 pr-3 max-h-[150px] overflow-y-auto customScroll`}
          >
            <p className={`text-sm`}>
              {declaration?.manufacture_name && (
                <>
                  {" "}
                  <span className={`font-bold`}>Proizvođač: </span>
                  {declaration?.manufacture_name}
                </>
              )}
            </p>
            <p className={`text-sm`}>
              {declaration?.country_name && (
                <>
                  {" "}
                  <span className={`font-bold`}>Zemlja porekla:</span>{" "}
                  {declaration?.country_name}
                </>
              )}
            </p>
            <p className={`text-sm`}>
              {declaration?.name && (
                <>
                  {" "}
                  <span className={`font-bold`}>Naziv:</span>{" "}
                  {declaration?.name}
                </>
              )}
            </p>
            <p className={`text-sm`}>
              {declaration?.year && (
                <>
                  <span className={`font-bold`}>Godina proizvodnje:</span>{" "}
                  {declaration?.year}
                </>
              )}
            </p>
            <p className={`text-sm`}>
              {declaration?.importer_name && (
                <>
                  <span className={`font-bold`}>Uvoznik:</span>{" "}
                  {declaration?.importer_name}
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
