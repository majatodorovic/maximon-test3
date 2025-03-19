export const revalidate = 30;
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { list } from "@/api/api";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

const getData = (slug) => {
  return list("/static-pages/content/o-nama").then((res) => {
    return res?.payload;
  });
};

const Onama = async () => {
  const data = await getData();

  const staticData = data?.items?.map((items) => {
    return items;
  });

  const keyGenerator = (prefix) => {
    return `${prefix}-${Math.random().toString(36)}`;
  };

  return (
    <>
      {/* Breadcrumb navigacija */}
      <Breadcrumbs currentPage={"O nama"} marginTop="mt-0 md:mt-8" />

      <div
        style={{
          marginTop: "2.8%",
          width: "94.5%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {staticData?.map((items) => {
          switch (items?.type) {
            case "textarea":
              return (
                <div
                  key={keyGenerator("textarea")}
                  className="w-[90%] mx-auto text-center leading-7 text-gray-800 font-lato mt-5"
                >
                  {/* Razdvajanje naslova i podnaslova */}
                  <div className="flex flex-col gap-7 mt-5">
                    {/* Naslov */}
                    <h1 className="text-base font-bold text-black mt-10  text-[16px]">
                      {items?.content?.split("\n")[0]} {/* Prva linija */}
                    </h1>
                    {/* Podnaslov */}
                    <div className="gap-1">
                      <p className="text-[18px] text-gray-600">
                        {items?.content?.split("\n")[1]} {/* Druga linija */}
                      </p>
                      <p className="text-[18px] text-gray-600">
                        {items?.content?.split("\n")[2]} {/* Trece linija */}
                      </p>
                    </div>
                  </div>
                </div>
              );

              break;
              <br />;

            case "multiple_images":
              return (
                <div
                  key={keyGenerator("multiple_images")}
                  className="w-[90%] !max-w-full mx-auto md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-16"
                >
                  {items?.content?.map((image) => (
                    <div
                      key={keyGenerator("image")}
                      className="flex justify-center col-span-1 relative"
                    >
                      <div>
                        <Image
                          src={image?.file}
                          alt={``}
                          width={1600} // Fixed width of 1600px
                          height={500} // Fixed height of 500px
                          sizes="100vw"
                          priority
                        />
                      </div>
                    </div>
                  ))}
                </div>
              );

              break;

            case "html_editor":
              return (
                <div key={keyGenerator("html")} className="relative">
                  {/* Ovaj div će se prikazivati samo na desktop ekranima */}
                  <div
                    className="hidden sm:block relative bg-white shadow-md p-10 mx-auto font-lato max-w-[50%] md:max-w-[80%]"
                    style={{ marginTop: "-170px", maxWidth: "58%" }}
                    dangerouslySetInnerHTML={{ __html: items?.content }}
                  ></div>
                  {/* Ova verzija se prikazuje samo na mobilnim uređajima */}
                  <div
                    className="block sm:hidden relative bg-white shadow-md p-5 mx-auto font-lato max-w-[80%] "
                    style={{ marginTop: "-30px" }}
                    dangerouslySetInnerHTML={{ __html: items?.content }}
                  ></div>
                </div>
              );

              break;
          }
        })}
        <br />
        <br />
        <br />
      </div>
    </>
  );
};
export default Onama;
