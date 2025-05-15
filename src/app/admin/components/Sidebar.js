"use client";
import { useState } from 'react';
import NavLink from './NavLink';

const links = [
    { href: '/admin', label: 'Dashboard', icon: '🏠' },
    { href: '/admin/users', label: 'Người dùng', icon: '👤' },
    { href: '/admin/problems', label: 'Bài', icon: '📝' },
    { href: '/admin/contests', label: 'Kỳ thi', icon: '🏆' },
];

export default function Sidebar() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Mobile: Small fixed tab when closed */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="md:hidden fixed top-4 left-4 z-[100] bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
                    aria-label="Mở menu"
                >
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
                    Menu
                </button>
            )}

            {/* Overlay behind mobile sidebar */}
            {open && (
                <div
                    className="md:hidden fixed inset-0 bg-black/40 z-50 transition-opacity"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Mobile sidebar: slide-in effect */}
            <aside className={`md:hidden fixed inset-y-0 left-0 z-[60] w-64 max-w-full bg-gradient-to-b from-indigo-700 to-black text-white p-5 shadow-2xl transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex justify-between items-center mb-6">
                    <span className="text-2xl font-extrabold tracking-wide">VNOJ Admin</span>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-white bg-indigo-500 hover:bg-indigo-700 rounded-full p-2 transition"
                        aria-label="Đóng menu"
                    >
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <nav className="flex flex-col gap-3">
                    {links.map(link => (
                        <NavLink key={link.href} href={link.href} label={
                            <span className="flex items-center gap-2">
                                <span>{link.icon}</span>
                                <span>{link.label}</span>
                            </span>
                        } />
                    ))}
                </nav>
            </aside>

            {/* Desktop sidebar: always visible */}
            <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-indigo-700 to-black text-white h-screen p-6 shadow-2xl">
                <div className="mb-8 text-2xl font-extrabold tracking-wide">VNOJ Admin</div>
                <nav className="flex flex-col gap-3">
                    {links.map(link => (
                        <NavLink key={link.href} href={link.href} label={
                            <span className="flex items-center gap-2">
                                <span>{link.icon}</span>
                                <span>{link.label}</span>
                            </span>
                        } />
                    ))}
                </nav>
            </aside>
        </>
    );
}