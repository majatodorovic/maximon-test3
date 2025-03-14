import { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import NewProducts from "@/components/NewProductsPage/NewProducts";

const Novo = () => {
  return (
    <Suspense
      fallback={
        <div className="grid max-md:grid-cols-2 gap-y-[40px] md:grid-cols-3 2xl:grid-cols-4 gap-[11px]">
          <>
            {Array.from({ length: 12 }).map((_, i) => {
              return (
                <div
                  key={i}
                  className="aspect-2/3 w-full col-span-1 bg-slate-300 object-cover animate-pulse"
                />
              );
            })}
          </>
        </div>
      }
    >
      <Breadcrumbs currentPage={"Novo"} marginTop="mt-0 md:mt-8" />
      <NewProducts />
    </Suspense>
  );
};

export default Novo;

export const metadata = {
  title: "Novo | Maximon",
  description: "Dobrodošli na Maximon Online Shop",
  keywords: ["Maximon", "online", "shop"],
};
