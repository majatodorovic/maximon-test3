"use client";
import Image from "next/image";
import Link from "next/link";
import { icons } from "@/_lib/icons";
import { useState } from "react";

const Footer = () => {
  const [open, setOpen] = useState({
    id: null,
  });
  return (
    <div className="mt-[80px]">
      <hr />
      <footer className="block mx-0 w-[90%] 2xl:w-[85%] max-md:w-full max-sm:mx-0 md:mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between px-1 md:px-0 border-b border-gray-300">
          <div className="flex flex-col md:flex-row items-center max-md:my-3">
            <Link
              className="flex items-center md:pr-6 md:pl-8 md:h-[64px] md:border-r"
              href="/login"
            >
              <span className="text-sm font-light">
                <Image
                  src="/icons/user.png"
                  width={22}
                  height={22}
                  className="object-cover cursor-pointer mr-4"
                  alt="user"
                  style={{
                    width: "22px",
                    height: "22px",
                  }}
                />
              </span>
              <div>
                <p className="text-sm font-bold text-black">Moj nalog</p>
                <p
                  className="text-gray-500"
                  style={{ fontSize: "13px", lineHeight: "16px" }}
                >
                  PRIJAVITE SE NA
                  <br />
                  VAŠ NALOG
                </p>
              </div>
            </Link>

            <div className="flex flex-col items-start gap-2 md:pl-6 max-md:mt-3">
              <span className="text-sm font-light">Naše društvene mreže</span>

              <Link href="https://www.instagram.com/maximon.official/">
                <Image
                  src="/icons/instagram.png"
                  width={18}
                  height={18}
                  className="object-cover cursor-pointer mr-4"
                  alt="Instagram"
                  style={{
                    width: "18px",
                    height: "18px",
                  }}
                />
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2 md:border-l md:h-[64px] md:pl-6 md:pr-8 max-md:my-3">
            <div>
              <Link href="https://www.mastercard.com/rs/consumer/credit-cards.html">
                <Image
                  src={"/icons/bank/idcheck.webp"}
                  width={50}
                  height={30}
                  alt="Master Card"
                  className="w-28 h-10"
                />
              </Link>
            </div>
            <Link href="https://rs.visa.com/pay-with-visa/security-and-assistance/protected-everywhere.html">
              <div className="relative w-16 h-8">
                <Image
                  src={"/icons/bank/visaSecure.webp"}
                  layout="fill"
                  alt="Master Card"
                />
              </div>
            </Link>
            <div>
              <Link href="https://www.bancaintesa.rs">
                <Image
                  src={"/icons/bank/bancaIntesa.webp"}
                  width={50}
                  height={30}
                  alt="Master Card"
                  className="w-28 h-7"
                />
              </Link>
            </div>
            <div>
              <Image
                src={"/icons/bank/mastercard.webp"}
                width={50}
                height={30}
                alt="Master Card"
                className="object-scale-down w-12 h-auto"
              />
            </div>
            <div>
              <Image
                src={"/icons/bank/maestro.webp"}
                width={50}
                height={30}
                alt="Master Card"
                className="object-scale-down w-12 h-auto"
              />
            </div>
            <div>
              <Image
                src={"/icons/bank/dinacard.webp"}
                width={50}
                height={30}
                alt="Master Card"
                className="object-scale-down w-12 h-auto"
              />
            </div>
            <div>
              <Image
                src={"/icons/bank/visa.webp"}
                width={50}
                height={30}
                alt="Visa"
                className="object-scale-down w-12 h-auto"
              />
            </div>
            <div>
              <Image
                src={"/icons/bank/american.webp"}
                width={50}
                height={30}
                alt="Master Card"
                className="object-scale-down w-12 h-auto"
              />
            </div>
          </div>
        </div>

        <div className="px-1 py-12 grid  grid-cols-1 md:grid-cols-4 gap-2 md:gap-8 max-md:text-center ">
          <div className="flex flex-col items-center md:items-start justify-center max-md:mb-4">
            <Link href="/">
              <Image
                src={"/images/logo/logo-bigger.png"}
                width={144}
                height={83}
                alt="Maximon Logo"
                className="w-40 h-auto"
              />
            </Link>
            <p className="text-xs text-center md:text-left text-gray-500"></p>
          </div>

          <div className="flex flex-col items-center md:items-start mb-2 pl-3 mt-6">
            <div
              className="flex flex-row sm:mb-4"
              onClick={() => setOpen({ id: open?.id === 1 ? null : 1 })}
            >
              <h3 className="text-normal font-light  uppercase">O NAMA</h3>
              <span
                className={`sm:hidden ${
                  open?.id === 1 ? "-rotate-90" : "rotate-90"
                } text-black transition-all duration-500 ml-2`}
              >
                {icons.chevron_right}
              </span>
            </div>
            <ul
              className={`sm:block ${
                open?.id == 1 ? "block" : "hidden"
              } text-sm text-gray-600`}
            >
              <li>
                <Link href="/o-nama">Priča o brendu</Link>
              </li>
              <li>
                <Link href="/kontakt">Kontakt</Link>
              </li>
              <li>
                <Link href="/prodajna-mesta">Prodajna mesta</Link>
              </li>

              <li>
                <Link href="/strana/podaci-o-kompaniji">Podaci o kompaniji</Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start mb-2 pl-3 mt-6">
            <div
              className="flex flex-row sm:mb-4"
              onClick={() => setOpen({ id: open?.id === 2 ? null : 2 })}
            >
              <h3 className="text-normal font-light uppercase">
                Korisnički servis
              </h3>
              <span
                className={`sm:hidden ${
                  open?.id === 2 ? "-rotate-90" : "rotate-90"
                } text-black transition-all duration-500 ml-2`}
              >
                {icons.chevron_right}
              </span>
            </div>

            <ul
              className={`sm:block ${
                open?.id == 2 ? "block" : "hidden"
              }  text-sm text-gray-600`}
            >
              <li>
                <Link href="/strana/kako-kupiti-online">
                  Kako kupiti online
                </Link>
              </li>
              <li>
                <Link href="/strana/reklamacije">Reklamacije</Link>
              </li>
              <li>
                <Link href="/strana/pravo-na-odustajanje">
                  Pravo na odustajanje
                </Link>
              </li>
              <li>
                <Link href="/strana/zamena-artikala">Pravo na zamenu</Link>
              </li>
              <li>
                <Link href="/strana/nacini-i-uslovi-placanja">
                  Načini plaćanja
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start mb-2 pl-4 mt-6">
            <div
              className="flex flex-row sm:mb-4"
              onClick={() => setOpen({ id: open?.id === 3 ? null : 3 })}
            >
              <h3 className="text-normal font-light uppercase">
                <Link href="https://b2c.maximon.croonus.com/strana/opsti-uslovi-kupovine-alti-moda">
                  Uslovi korišćenja
                </Link>
              </h3>
              <span
                className={`sm:hidden ${
                  open?.id === 3 ? "-rotate-90" : "rotate-90"
                } text-black transition-all duration-500 ml-2`}
              >
                {icons.chevron_right}
              </span>
            </div>
            <ul
              className={`sm:block ${
                open?.id == 3 ? "block" : "hidden"
              } text-sm text-gray-600`}
            >
              <li>
                <Link href="https://b2c.maximon.croonus.com/strana/opsti-uslovi-kupovine-alti-moda">
                  Uslovi korišćenja i kupovine
                </Link>
              </li>
              <li>
                <Link href="/strana/politika-privatnosti">
                  Politika privatnosti
                </Link>
              </li>
              <li>
                <Link href="/strana/politika-kolacica">Politika kolačića</Link>
              </li>
              <li>
                <Link href="/strana/autorska-prava">Autorska prava</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 lg:w-[50%] py-4">
          <span className="text-gray-500 text-sm">
            © 2024 Maximon.rs | Sva prava zadržana. Powered by Croonus
            Technologies.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
