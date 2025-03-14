import { get, list } from "@/api/api";
import { headers } from "next/headers";
import { generateOrganizationSchema } from "@/_functions";
import RecommendedCategories from "@/components/sections/homepage/RecommendedCategories";
import NewCategoriesSections from "@/components/NewCategoriesSection/NewCategoriesSection";
import RecommendedProducts from "@/components/sections/homepage/RecommendedProducts";
import IndexSlider from "@/components/IndexSlider/IndexSlider";
import NewInProducts from "@/components/NewInProducts/NewInProducts";
import { Suspense } from "react";
import HomepageBanners from "@/components/HomepageBanners/HomepageBanners";

const getBanners = async() => {
  return get("/banners/index_slider").then((res) => res?.payload);
};
const getMobileBanners = () => {
  return get("/banners/index_slider_mobile").then((res) => res?.payload);
};
const getBannersCategories = () => {
  return get("/banners/index-first-banner").then((res) => res?.payload);
};
const getRecommendedProducts = () => {
  return list("/products/section/list/recommendation").then(
    (res) => res?.payload?.items
  );
};
const getNew = () => {
  return list("/categories/section/recommended").then((res) => res?.payload);
};

const Home = async () => {
  const [
    banners,
    recommendedProducts,
    categories,
    mobileBanners,
    recommendedCategories,
  ] = await Promise.all([
    getBanners(),
    getRecommendedProducts(),
    getBannersCategories(),
    getMobileBanners(),
    getNew(),
  ]);

  let all_headers = headers();
  let base_url = all_headers.get("x-base_url");

  let schema = generateOrganizationSchema(base_url);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="block relative overflow-hidden">
      <HomepageBanners banners={banners} mobileBanners={mobileBanners} />
        <div className="overflow-hidden">
          <RecommendedProducts
            recommendedProducts={recommendedProducts}
            action4={`Svaki trenutak je prilika`}
          />
        </div>
        {/* <Suspense>
          <NewInProducts />
        </Suspense> */}

        {categories && categories.length > 0 && (
          <RecommendedCategories categories={categories} />
        )}
        {recommendedCategories && recommendedCategories.length > 0 && (
          <NewCategoriesSections categories={recommendedCategories} />
        )}
        {/* <NewsLetterInstagramSection /> */}
      </div>
    </>
  );
};

export default Home;

export const revalidate = 30;

const getSEO = () => {
  return get("/homepage/seo").then((response) => response?.payload);
};

export const generateMetadata = async () => {
  const data = await getSEO();
  const header_list = headers();
  let canonical = header_list.get("x-pathname");
  return {
    title: data?.meta_title ?? "Početna | Maximon",
    description: data?.meta_description ?? "Dobrodošli na Maximon Online Shop",
    alternates: {
      canonical: data?.meta_canonical_link ?? canonical,
    },
    robots: {
      index: data?.meta_robots?.index ?? true,
      follow: data?.meta_robots?.follow ?? true,
    },
    openGraph: {
      title: data?.social?.share_title ?? "Početna | Maximon",
      description:
        data?.social?.share_description ?? "Dobrodošli na Maximon Online Shop",
      type: "website",
      images: [
        {
          url: data?.social?.share_image ?? "",
          width: 800,
          height: 600,
          alt: "Maximon",
        },
      ],
      locale: "sr_RS",
    },
  };
};
