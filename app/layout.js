import { CartContextProvider } from "@/api/cartContext";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Footer from "@/components/Footer/Footer";
import NavigationMobile from "@/components/Navigation/NavigationMobile";
import TrackingScripts from "@/components/GTAG/GTAG";
import { UserProvider } from "@/context/userContext";
import CookieAlert from "@/components/CookieAlert/CookieAlert";
import Header from "@/components/Header/Header";
import { get } from "@/api/api";
import { QueryProvider } from "@/components/QueryProvider";
import { ToastContainer } from "react-toastify";
import { AnalyticsGA4 } from "@/_components/shared/analyticsGA4";
import { AnalyticsGTM } from "@/_components/shared/analyticsGTM";
import { Suspense } from "react";
import Script from "next/script";

const getHTMLLang = async () => {
  return process.env.HTML_LANG;
};

export default async function RootLayout({ children }) {
  return (
    <html lang={`${await getHTMLLang()}`}>
      <head>
        <link
          rel={`stylesheet`}
          href={`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css`}
        />
        <Script
          src={`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/js/regular.js`}
        ></Script>
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap&subset=latin-ext"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
        />
        <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
      </head>
      <body className="relative">
        <QueryProvider>
          <UserProvider>
            <CartContextProvider>
              {/*<TrackingScripts />*/}
              <Header />
              <div className="fixed-header-helper"></div>
              <NavigationMobile />
              {children}
              <Footer />
              <ToastContainer />
            </CartContextProvider>
          </UserProvider>
          <Suspense>
            <AnalyticsGA4 />
            <AnalyticsGTM />
          </Suspense>
        </QueryProvider>
        <CookieAlert />
      </body>
    </html>
  );
}

export const metadata = {
  icons: {
    icon: "/favicon.ico",
  },
  title: "Početna | Maximon",
  description: "Dobrodošli na Maximon Online Shop",
  alternates: {
    canonical: "https://croonus.com",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Maximon",
    description: "Dobrodošli na Maximon Online Shop",
    type: "website",
    url: "https://croonus.com",
    image: "https://croonus.com/images/logo.png",
    site_name: "croonus.com",
    locale: "sr_RS",
  },
};
