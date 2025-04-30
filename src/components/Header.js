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
            <div className="absolute top-0 right-0 h-full flex items-center w-[170px] rounded-[2px]">
                <AuthButton isAdmin={true} />
            </div>
            <nav>
                <ul className="flex items-center bg-[#231f20] p-0 text-white">
                    <li className="hover:text-gray-400 px-2">
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
                    <li className="w-[3px] h-[32px] bg-[#ffffff26] mx-2"></li>
                    {navigate.map((item, index) => (
                        <li key={index} className="h-[48px] box-border">
                            <Link
                                href={item.path}
                                className={`flex py-[12px] px-[8px] items-center w-full h-full ${pathname.includes(item.path)
                                    ? "border-[3px] border-transparent border-b-[#1ba94c]" // Border dưới khi trang được chọn
                                    : "border-[3px] border-transparent hover:border-b-[#1ba94c]" // Border trong suốt cho các mục không được chọn
                                    }`}
                            >
                                <span className="text-[14px] font-[500] w-full h-full">
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
