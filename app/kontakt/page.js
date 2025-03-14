import Nazaddugme2 from "../../components/nazaddugme2/page";
import Link from "next/link";
import Contact from "@/components/Contact/Contact";
import { headers } from "next/headers";
import { generateOrganizationSchema } from "@/_functions";
import { list } from "@/api/api";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

// Funkcija za dohvat podataka sa servera
const getData = (slug) => {
  return list("/static-pages/content/kontakt").then((res) => {
    return res?.payload;
  });
};

const Kontakt = async () => {
  // Dohvatanje podataka
  const data = await getData();
  const staticData = data?.items?.map((items) => items);


  // Generisanje jedinstvenog ključa
  const keyGenerator = (prefix) => {
    return `${prefix}-${Math.random().toString(36)}`;
  };

  // Dohvatanje zaglavlja i generisanje organizacijskog schema
  let all_headers = headers();
  let base_url = all_headers.get("x-base_url");
  let schema = generateOrganizationSchema(base_url);

  return (
    <>
      {/* Breadcrumb navigacija */}
      <Breadcrumbs currentPage={"Kontakt"} marginTop="mt-0 md:mt-8" />
      {/* JSON-LD schema za SEO optimizaciju */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Prikazivanje sadržaja tipa "textarea" sa admin panela */}
      <div style={{ marginTop: "5.6%" }}>
        {staticData?.map((items) => {
          switch (items?.type) {
            case "html_editor": {
              const content = items?.content || "";
              const splitContent = content.split("\n"); // Razdvajanje po linijama
              const rawTitle = splitContent[0]; // Prva linija kao naslov

              // Uklanjanje HTML tagova i dekodovanje entiteta
              const decodeHtmlEntities = (str) =>
                str
                  .replace(/&nbsp;/g, " ")
                  .replace(/&amp;/g, "&")
                  .replace(/<\/?[^>]+(>|$)/g, ""); // Uklanja HTML tagove

              const title = decodeHtmlEntities(rawTitle);
              const body = splitContent.slice(1).join("\n"); // Ostatak kao telo

              return (
                <div
                  key={keyGenerator("html")}
                  className="w-[90%] 2xl:w-[85%] mx-auto text-center leading-7 text-gray-800"
                >
                  <h1 className="text-base font-bold text-black text-[16px]">{title}</h1>
                  <div className="text-[18px]" dangerouslySetInnerHTML={{ __html: body }}></div>
                </div>
              );
            }
            default:
              return null;
          }
        })}
      </div>
      <Contact staticData={staticData} />
    </>
  );
};

export default Kontakt;

export const generateMetadata = async ({ searchParams: { search } }) => {
  const header_list = headers();
  let canonical = header_list.get("x-pathname");
  return {
    title: `Kontakt | Maximon`,
    description: "Dobrodošli na Maximon Online Shop",
    alternates: {
      canonical: canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `Kontakt | Maximon`,
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
