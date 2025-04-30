"use client";
import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { useUser } from '@/context/user'
import { toast } from "react-toastify";
import { useIsOpen } from '@/context/modalLogin';
import { loadingLoadContext } from "@/context/loadingLoad";

export default function AuthButton({ }) {
    const [showMenu, setShowMenu] = useState(false);
    const { isOpen, setIsOpen } = useIsOpen();
    const { setLoadingLoad } = useContext(loadingLoadContext);
    const { user, setUser } = useUser(); // Lấy thông tin người dùng từ context
    useEffect(() => {
        const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;
        console.log("BACKEND:", BACKEND);

        const fetchUser = async () => {
            const res = await fetch("/api/users");
            const data = await res.json();
            if (!data.success) {
                return;
            }
            fetch(`${BACKEND}/start`);
            setUser(data.user);
            setLoadingLoad(false);
            setIsOpen(false);
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        const res = fetch(`/api/cookie`, {
            method: "DELETE",
            body: JSON.stringify({ name: "token" })
        })
        setUser({})
        toast.success(`Đăng xuất thành công`)
    };

    const menuItems = [
        // { href: "/settings", label: "Cài đặt" },
        { href: "/logout", onClick: handleLogout, label: "Đăng xuất", isButton: true },
    ];

    // Thêm mục "Quản trị" nếu là admin
    if (user && user.isAdmin) {
        menuItems.unshift({ href: "/admin", label: "Quản trị" });
    }

    return (
        <div className="w-full h-full">
            <div
                className="w-full h-full flex space-x-2 items-center"
                onMouseOver={() => setShowMenu(true)}
                onMouseOut={() => setShowMenu(false)}
            >
                {user._id && <div href="/user" className="absolute w-full h-full left-0 top-0 z-50  hover:bg-[rgba(255,255,255,0.2)]" />}
                {user._id ? (
                    <div className="relative h-full flex items-center space-x-2 cursor-pointer w-full">
                        <div className="flex items-center space-x-2 ml-3">
                            <div>
                                <img
                                    src="/avatar.png"
                                    alt="avatar"
                                    width={25}
                                    height={25}
                                    className="rounded-[2px]"
                                />
                            </div>
                            <div>
                                <span className="text-white text-[11px]">Xin chào, {`${user.name || user.username}`}.</span>
                            </div>
                        </div>
                        {showMenu && (
                            <div className="absolute top-full right-0 bg-[#231f20] shadow-lg text-white w-full z-50 text-[11px]">
                                <ul className="border-l-4 border-[#1ba94c]">
                                    {menuItems.map((item, index) => (
                                        <li
                                            key={index}
                                            className="px-4 py-2 hover:bg-[rgba(255,255,255,0.2)] w-full cursor-pointer"
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
                ) : (
                    <div>
                        <span className="text-white cursor-pointer" onClick={() => setIsOpen(true)}>Đăng nhập</span>
                    </div>
                )}
            </div>
        </div>
    );
}