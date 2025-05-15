"use client";

import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();

    const handleLogout = async (e) => {
        e.preventDefault();
        await fetch(`/api/cookie`, {
            method: "DELETE",
            body: JSON.stringify({ name: "token" })
        });
        setUser({});
        toast.success(`Đăng xuất thành công`);
    };

    return (
        <header className="bg-gray-900 text-white py-3 flex justify-between items-center shadow-md left-0 right-0 sticky top-0 z-40 w-full box-border">
            <div className="flex items-center gap-3">
                <span className="bg-indigo-600 rounded-full w-9 h-9 flex items-center justify-center text-lg font-bold shadow">VJ</span>
                <h1 className="text-xl font-semibold tracking-wide">VNOJ Admin</h1>
            </div>
            <div>
                <form onSubmit={handleLogout} className="flex">
                    <button
                        className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 transition px-4 py-2 rounded text-white font-medium shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        type="submit"
                    >
                        Đăng xuất
                    </button>
                </form>
            </div>
        </header>
    );
}