// D:\code\web\nextoj\frontend\src\components\AuthButton.js
"use client";
import React, { useState, useContext, useEffect, useRef } from "react";
import Link from "next/link";
import { useUser } from '@/context/user'
import { toast } from "react-toastify";
import { useIsOpen } from '@/context/modalLogin';
import { loadingLoadContext } from "@/context/loadingLoad";

export default function AuthButton({ }) {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    const { isOpen, setIsOpen } = useIsOpen();
    const { setLoadingLoad } = useContext(loadingLoadContext);
    const { user, setUser } = useUser();

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch("/api/users");
            const data = await res.json();
            if (!data.success) {
                setLoadingLoad(false);
                return;
            }
            setLoadingLoad(false);
            setUser(data.user);
            setIsOpen(false);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;
        fetch(`${BACKEND}/start`);
    }, []);

    // Đóng menu khi click ra ngoài
    useEffect(() => {
        if (!showMenu) return;
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showMenu]);

    const handleLogout = async () => {
        await fetch(`/api/cookie`, {
            method: "DELETE",
            body: JSON.stringify({ name: "token" })
        });
        setUser({});
        toast.success(`Đăng xuất thành công`);
    };

    const menuItems = [
        { href: "/change-password", label: "Mật khẩu", isButton: false },
        { href: "/logout", onClick: handleLogout, label: "Đăng xuất", isButton: true },
    ];
    if (user && user.isAdmin) {
        menuItems.unshift({ href: "/admin", label: "Quản trị" });
    }

    return (
        <div className="relative" ref={menuRef}>
            {user._id ? (
                <button
                    className="flex items-center gap-2 cursor-pointer focus:outline-none"
                    onClick={() => setShowMenu((v) => !v)}
                    aria-haspopup="true"
                    aria-expanded={showMenu}
                >
                    <img
                        src="/avatar.png"
                        alt="avatar"
                        width={32}
                        height={32}
                        className="rounded-full border-2 border-[#1ba94c] shadow-sm bg-white"
                    />
                    <span className="text-white font-medium text-sm max-w-[120px] truncate">
                        {user.name || user.username}
                    </span>
                    <svg
                        className={`w-4 h-4 ml-1 text-white transition-transform ${showMenu ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            ) : (
                <button
                    className="bg-[#1ba94c] cursor-pointer text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-[#14803a] transition"
                    onClick={() => setIsOpen(true)}
                >
                    Đăng nhập
                </button>
            )}
            {showMenu && user._id && (
                <div
                    className={`
                        absolute
                        top-10
                        min-w-[170px]
                        bg-[#231f20]
                        rounded-xl
                        shadow-xl
                        border border-[#1ba94c]
                        z-50
                        animate-fadeIn
                        right-0
                        sm:right-[-16px]
                        left-0
                        sm:left-auto
                        sm:top-12
                    `}
                >
                    <ul className="py-2">
                        {menuItems.map((item, index) => (
                            <li
                                key={index}
                                className="px-5 py-2 hover:bg-[#1ba94c] hover:text-white text-sm text-white rounded-lg transition-all cursor-pointer"
                                onClick={item.onClick ? item.onClick : undefined}
                            >
                                {item.isButton ? (
                                    <span className="block w-full">{item.label}</span>
                                ) : (
                                    <Link href={item.href} className="block w-full">
                                        {item.label}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}