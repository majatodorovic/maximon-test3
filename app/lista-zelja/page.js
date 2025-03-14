import WishlistPage from "@/components/Wishlist/Wishlist";
import { headers } from "next/headers";

const Wishlist = async () => {
  return <WishlistPage />;
};

export default Wishlist;

export const generateMetadata = async ({ searchParams: { search } }) => {
  const header_list = headers();
  let canonical = header_list.get("x-pathname");
  return {
    title: `Lista želja | Maximon`,
    description: "Dobrodošli na Maximon Online Shop",
    alternates: {
      canonical: canonical,
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: `Lista želja | Maximon`,
      description: "Dobrodošli na Maximon Online Shop",
      type: "website",
      images: [
        {
          url: "https://api.fashiondemo.croonus.com/croonus-uploads/config/b2c/logo-c36f3b94e6c04cc702b9168481684f19.webp",
          width: 800,
          height: 600,
          alt: "Maximon",
        },
      ],
      locale: "sr_RS",
    },
  };
};
