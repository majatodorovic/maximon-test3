import { list, post, get } from "@/api/api";

import { notFound } from "next/navigation";
import NewProductsPage from "./NewProductsPage";

const getProducts = async () => {
  return await list(`/products/new-in/list`).then(
    (res) => res?.payload
  );
};

const getCategoryFilters = async () => {
  return await post(`/products/new-in/filters`).then(
    (res) => res?.payload
  );
};

const NewProducts = async () => {
  const products = await getProducts();
  const filters = await getCategoryFilters();
  return (
    <>
      {products ? (
        <NewProductsPage
          sectionSlug={`novo`}
          products={products}
          filter={filters}
        />
      ) : (
        notFound()
      )}
    </>
  );
};

export default NewProducts;
