'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLink({ href, label }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`block px-2 py-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700 font-semibold' : ''
                }`}
        >
            {label}
        </Link>
    );
}
