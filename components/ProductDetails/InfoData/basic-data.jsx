import ProductPrice from "@/components/ProductPrice/ProductPrice";
import React, { useEffect, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { get } from "@/api/api";
import Variants from "@/components/Variants/Variants";
import { notFound, useRouter } from "next/navigation";
import { generateProductSchema } from "@/_functions";
import { currencyFormat } from "@/helpers/functions";

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("sr-RS");
};

export const BasicData = ({
  path,
  id,
  productVariant,
  setProductVariant,
  setProduct,
  canonical,
  setSelectedOptions,
  setTempError,
  setInfoModal,
  color,
  setColor,
  setNotSelected,
}) => {
  const { data: product } = useSuspenseQuery({
    queryKey: ["product", path],
    queryFn: async () => {
      return await get(`/product-details/basic-data/${id}`).then((res) => {
        // setProduct(res?.payload);
        return res?.payload;
      });
    },
    refetchOnWindowFocus: false,
  });

  const { data: product_gallery } = useSuspenseQuery({
    queryKey: ["productGallerySchema", id],
    queryFn: async () => {
      return await get(`/product-details/gallery/${id}`).then((res) => {
        return res?.payload;
      });
    },
    refetchOnWindowFocus: false,
  });

  let schema = generateProductSchema(product, product_gallery, canonical);
  const [setVariant, setVariantOnOff] = useState(true);

  const renderIsInStock = () => {
    switch (product?.product_type) {
      case "single":
        switch (product?.data?.item?.inventory?.inventory_defined) {
          case false:
            return (
              <div className="flex items-center gap-2 mt-2">
                <div className="w-[10px] h-[10px] bg-[#e10000] rounded-full"></div>
                <span className="text-[#e10000] text-[0.75rem] font-bold">
                  Nema na lageru
                </span>
              </div>
            );
          default:
            break;
        }
        break;
      case "variant":
        switch (true) {
          case productVariant?.id:
            switch (productVariant?.inventory?.inventory_defined) {
              case false:
                return (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-[10px] h-[10px] bg-[#e10000] rounded-full"></div>
                    <span className="text-[#e10000] text-[0.75rem] font-bold">
                      Nema na lageru
                    </span>
                  </div>
                );
              default:
                break;
            }
            break;
        }
        break;
    }
  };

  useEffect(() => {
    if (window.scrollY > 0) {
      window.scrollTo(0, 0);
    }
  }, []);
  const [newURL, setNewURL] = useState(null);
  useEffect(() => {
    if (newURL) {
      window?.history?.replaceState(null, null, newURL);
      setTempError(null);
    }
  }, [newURL]);

  const updateProductVariant = (newProduct) => {
    setProductVariant({
      ...newProduct,
      price: {
        ...newProduct?.price,
        min: [],
        max: [],
      },
    });
  };
  const handleURLChange = (newURL) => {
    setNewURL(newURL);
  };

  const router = useRouter();

  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    if (selectedColor !== null && selectedColor !== undefined) {
      // router.push(`?color=${selectedColor.key}`);
      setColor(selectedColor.key);
    }
  }, [selectedColor]);

  useEffect(() => {
    setProduct(product);
  }, [product]);

  const productBasicData = product?.data?.item?.basic_data;
  const price = productVariant?.id
    ? productVariant?.price
    : product?.data?.item?.price;
  const discount_number = price?.min?.price?.original
    ? Math.abs(price?.min?.price?.original - price?.min?.price?.discount)
    : Math.abs(price?.price?.original - price?.price?.discount);

  return product ? (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <h1 className="text-[16px] font-bold mb-1">{productBasicData?.name}</h1>
      {productBasicData?.short_description && (
        <p className="text-[20px] text-[#636363] font-light">
          {productBasicData?.short_description}
        </p>
      )}
      {renderIsInStock()}
      {/* <h2 className="mt-[1.063rem] text-[#636363] text-[0.688rem]">
        Šifra:&nbsp;
        {productVariant?.id
          ? productVariant?.basic_data?.sku
          : product?.data?.item?.basic_data?.sku}
      </h2>
      <h2 className="mt-[1.063rem] text-[#636363] text-[0.688rem]">
        Bar Kod:&nbsp;
        {productVariant?.basic_data?.barcode
          ? productVariant?.basic_data?.barcode
          : product?.data?.item?.basic_data?.barcode}
      </h2> */}
      <div className={`mt-6 flex items-center gap-1`}>
        <ProductPrice
          is_details
          price={
            productVariant?.id
              ? productVariant?.price
              : product?.data?.item?.price
          }
          inventory={
            productVariant?.id
              ? productVariant?.inventory
              : product?.data?.item?.inventory
          }
          className={
            product?.data?.item?.price?.discount?.active
              ? `font-bold text-[21px] py-0.5`
              : `font-bold text-[1.172rem]  py-0.5`
          }
          detailed={true}
        />
      </div>
      {price.discount.active &&
        productVariant?.inventory?.inventory_defined && (
          <div className="flex flex-row justify-between w-full">
            <p> Ušteda: &nbsp;{currencyFormat(discount_number)}</p>
            <p className="font-light">
              Akcijska cena važi od:{" "}
              {formatDate(price?.discount?.campaigns[0]?.duration?.from)} do{" "}
              {formatDate(price?.discount?.campaigns[0]?.duration?.to)}{" "}
            </p>
          </div>
        )}

      {product?.product_type === "variant" && (
        <div className="py-[2rem] max-md:py-[1.5rem]">
          <Variants
            firstVariantOption={!productVariant}
            handleURLChange={handleURLChange}
            updateProductVariant={updateProductVariant}
            setSelectedColor={setSelectedColor}
            selectedColor={selectedColor}
            setVariantOnOff={setVariantOnOff}
            setVariant={setVariant}
            product={product}
            productVariant={productVariant}
            slug={path}
            productSlug={path}
            setSelectedOptions={setSelectedOptions}
            setInfoModal={setInfoModal}
            setNotSelected={setNotSelected}
          />
        </div>
      )}
    </>
  ) : (
    notFound()
  );
};
