// components/Header.js
import Link from "next/link";
import Image from "next/image";
import AuthButton from "./AuthButton";

export default function Header(pathnameOb) {
    const pathname = pathnameOb.pathname;

    const navigate = [
        { name: "Danh sách bài", path: "/problems" },
        { name: "Các bài nộp", path: "/submissions" },
        { name: "Các kì thi", path: "/contests" },
    ];

    return (
        <div className="relative select-none">
            {/* AuthButton: hidden on mobile <500 */}
            <div className="absolute top-0 right-0 h-full flex items-center w-[170px] rounded-[2px] max-[500px]:hidden">
                <AuthButton isAdmin={true} />
            </div>

            {/* Nav container: add right padding so items don't go under AuthButton */}
            <nav>
                <ul className="flex items-center bg-[#231f20] p-0 text-white pr-[170px] max-[500px]:pr-0">
                    {/* Logo: hidden on mobile <500 */}
                    <li className="hover:text-gray-400 px-2 max-[500px]:hidden">
                        <Link href="/">
                            <Image
                                src="/vnojlogo.png"
                                alt="VNOJ Logo"
                                width={95}
                                height={95}
                                priority
                                className="m-[2px] w-auto h-auto"
                            />
                        </Link>
                    </li>
                    <li className="w-[3px] h-[32px] bg-[#ffffff26] mx-2 max-[500px]:hidden"></li>

                    {/* Menu items */}
                    {navigate.map((item, index) => (
                        <li key={index} className="h-[48px] box-border">
                            <Link
                                href={item.path}
                                className={`flex py-[12px] px-[8px] items-center h-full whitespace-nowrap ${pathname.includes(item.path)
                                    ? "border-[3px] border-transparent border-b-[#1ba94c]"
                                    : "border-[3px] border-transparent hover:border-b-[#1ba94c]"
                                    }`}
                            >
                                <span className="text-[14px] font-[500]">
                                    {item.name.toUpperCase()}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}
