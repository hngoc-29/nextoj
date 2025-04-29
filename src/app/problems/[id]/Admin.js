"use client"
import { useUser } from "@/context/user";
import Link from "next/link";

export default function Admin({ id }) {
    const { user } = useUser();
    return (
        <div>
            {user && user.isAdmin && (
                <Link href={`/problems/${id}/manager-testcase/`} className="text-[#1958c1] hover:text-[#0645ad]">
                    Quản lí testcase
                </Link>)
            }
        </div>
    )
}
