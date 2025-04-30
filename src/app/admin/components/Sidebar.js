"use client";
import { useState } from 'react';
import NavLink from './NavLink';

const links = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/users', label: 'Người dùng' },
    { href: '/admin/problems', label: 'Bài' },
    { href: '/admin/contests', label: 'Kỳ thi' },
];

export default function Sidebar() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Mobile: Small fixed tab when closed */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="md:hidden fixed top-2 right-0 z-30 bg-black text-white px-3 py-2 rounded-br-lg shadow-lg"
                >
                    Menu
                </button>
            )}

            {/* Mobile sidebar: fixed full when open */}
            {open && (
                <aside className="md:hidden fixed inset-y-0 left-0 z-30 w-64 bg-black text-white p-4 shadow-lg overflow-auto">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xl font-bold">VNOJ Admin</span>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-sm border border-white px-2 py-1 rounded"
                        >
                            Đóng
                        </button>
                    </div>
                    <nav className="flex flex-col gap-2">
                        {links.map(link => (
                            <NavLink key={link.href} href={link.href} label={link.label} />
                        ))}
                    </nav>
                </aside>
            )}

            {/* Overlay behind mobile sidebar */}
            {open && (
                <div
                    className="md:hidden fixed inset-0 bg-black opacity-50 z-20"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Desktop sidebar: always visible */}
            <aside className="hidden md:block w-64 bg-black text-white h-full p-4">
                <div className="mb-4 text-xl font-bold">VNOJ Admin</div>
                <nav className="flex flex-col gap-2">
                    {links.map(link => (
                        <NavLink key={link.href} href={link.href} label={link.label} />
                    ))}
                </nav>
            </aside>
        </>
    );
}
