"use client";
import Link from "next/link";

const handleBackClick = () => {
    window.history.back(); // Vraća korisnika na prethodnu stranu
};

const Nazaddugme = () => {
    return (
        <div className="w-[90%] gap-3 flex mx-auto text-center leading-7 text-gray-800 font-lato mt-5"> {/* Dodaj wrapper za organizaciju */}
            <button
                onClick={handleBackClick} // Dodaj onClick za funkciju povratka
                className="text-[0.95rem] flex items-center text-gray-700 hover:text-gray-900"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 mr-1" // Dodaj malo razmaka desno od ikone
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5 8.25 12l7.5-7.5"
                    />
                </svg>
                Nazad
            </button>

            <div className="flex items-center gap-3 text-[0.95rem] "> {/* Drži linkove u redu */}
                <Link className="text-gray-700 hover:text-gray-900" href={`/`}>
                    Početna
                </Link>
                <span>/</span>
                <span>O nama</span>
            </div>
        </div>
    );
};

export default Nazaddugme;
