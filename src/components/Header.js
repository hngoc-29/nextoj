// components/Header.js
import Link from "next/link";
import Image from "next/image";
import AuthButton from "./AuthButton";
import { useState } from "react";

export default function Header(pathnameOb) {
    const pathname = pathnameOb.pathname;
    const [open, setOpen] = useState(false);

    const navigate = [
        { name: "Danh sách bài", path: "/problems" },
        { name: "Các bài nộp", path: "/submissions" },
        { name: "Các kì thi", path: "/contests" },
    ];

    return (
        <header className="sticky top-0 z-50 bg-[#231f20] select-none shadow-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2 relative">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/vnojlogo.png"
                        alt="VNOJ Logo"
                        width={48}
                        height={48}
                        priority
                        className="w-12 h-12 object-contain"
                    />
                    <span className="text-white font-bold text-xl tracking-wide max-[500px]:hidden">OJ Platform</span>
                </Link>

                {/* Desktop menu */}
                <nav className="hidden md:flex items-center gap-2">
                    {navigate.map((item, index) => (
                        <Link
                            key={index}
                            href={item.path}
                            className={`px-4 py-2 rounded-lg transition font-semibold text-[15px] ${pathname.includes(item.path)
                                    ? "bg-[#1ba94c] text-white shadow"
                                    : "text-white hover:bg-[#353334] hover:text-[#1ba94c]"
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* AuthButton desktop */}
                <div className="hidden md:flex items-center ml-4">
                    <AuthButton isAdmin={true} />
                </div>

                {/* Hamburger button */}
                <button
                    className="md:hidden flex items-center justify-center p-2 rounded text-white hover:bg-[#353334] transition"
                    onClick={() => setOpen(!open)}
                    aria-label="Open menu"
                >
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                        <path
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            d={open
                                ? "M6 6l12 12M6 18L18 6"
                                : "M4 6h16M4 12h16M4 18h16"}
                        />
                    </svg>
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden bg-[#231f20] border-t border-[#333] animate-fadeIn">
                    <nav className="flex flex-col gap-1 px-4 py-2">
                        {navigate.map((item, index) => (
                            <Link
                                key={index}
                                href={item.path}
                                className={`py-3 px-3 rounded-lg font-semibold text-base ${pathname.includes(item.path)
                                        ? "bg-[#1ba94c] text-white shadow"
                                        : "text-white hover:bg-[#353334] hover:text-[#1ba94c]"
                                    }`}
                                onClick={() => setOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="mt-2">
                            <AuthButton isAdmin={true} />
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
