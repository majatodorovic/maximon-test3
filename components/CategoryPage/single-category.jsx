"use client";
import { useCategory } from "@/hooks/ecommerce.hooks";
import { generateBreadcrumbSchema } from "@/_functions";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

export const SingleCategory = ({
  slug,
  path,
  base_url,
  text = "",
  sumOfProducts,
}) => {
  const { data: singleCategory } = useCategory({ slug });
  const breadcrumbs_schema = generateBreadcrumbSchema(
    singleCategory?.parents,
    singleCategory?.basic_data?.name,
    path,
    base_url
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs_schema) }}
      />

      <Breadcrumbs
        pages={singleCategory?.parents}
        currentPage={singleCategory?.basic_data?.name}
        marginTop="mt-0 md:mt-8"
      />

      <div className="mt-10 md:mt-12 flex flex-col items-center justify-center">
        <div className="flex flex-row  items-center justify-center">
          <h1 className="text-[22px] font-bold uppercase">
            {singleCategory?.basic_data?.name ?? text ?? ""}{" "}
            <span className="font-light text-black/50">({sumOfProducts})</span>
          </h1>
        </div>

        {singleCategory?.basic_data?.short_description && (
          <p
            className="text-center text-[18px] max-w-[50rem] font-light sm:mt-[28px]"
            dangerouslySetInnerHTML={{
              __html: singleCategory?.basic_data?.short_description,
            }}
          ></p>
        )}
        {singleCategory?.basic_data?.description && (
          <p
            className="text-center text-[16px] max-md:mt-[18px] max-w-[50rem] font-light sm:mt-[28px]"
            dangerouslySetInnerHTML={{
              __html: singleCategory?.basic_data?.description,
            }}
          ></p>
        )}
        {singleCategory?.basic_data?.long_description && (
          <p
            className="text-center text-[16px] max-md:mt-[18px] max-w-[50rem] font-light sm:mt-[16px]"
            dangerouslySetInnerHTML={{
              __html: singleCategory?.basic_data?.long_description,
            }}
          ></p>
        )}
      </div>
    </>
  );
};
