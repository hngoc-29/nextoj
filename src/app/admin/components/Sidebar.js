import NavLink from './NavLink';

const links = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/users', label: 'Người dùng' },
    { href: '/admin/problems', label: 'Bài' },
    { href: '/admin/contests', label: 'Kỳ thi' },
];

export default function Sidebar() {
    return (
        <aside className="w-64 bg-black text-white h-full p-4">
            <div className="mb-4 text-xl font-bold">VNOJ: Admin</div>
            <nav className="flex flex-col gap-2">
                {links.map(link => (
                    <NavLink key={link.href} href={link.href} label={link.label} />
                ))}
            </nav>
        </aside>
    );
}
