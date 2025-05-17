"use client"
import { usePathname } from "next/navigation";
import Header from "@/components/Header";

export default function LayoutWrapper({ children }) {
    const pathname = usePathname()
    const isAdminPage = pathname.startsWith("/admin")

    return (
        <>
            {!isAdminPage && <Header pathname={pathname} />}
            <div className={`${!isAdminPage ? "px-2 sm:px-5 lg:px-10" : ""} relative`}>
                {children}
            </div >
        </>
    )
}
