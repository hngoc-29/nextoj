"use client"

import { useEffect, useState } from "react";
import CreateUserModal from "./CreateUserModal";
import { toast } from "react-toastify";

export default function UsersPage() {
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [users, setUsers] = useState([]);

    const fetchUser = async () => {
        const data = await (await fetch(`/api/users/get-all`)).json();
        if (data.success) return setUsers(data.users);
        toast.error(data.message);
    }

    useEffect(() => {
        document.title = `Quản lí người dùng | OJ Platform`
        fetchUser();
    }, [])
    const handleCreate = async (dt) => {
        const data = await (await fetch(`/api/users`, {
            method: "POST",
            body: JSON.stringify(dt)
        })).json();
        console.log(data)
        if (data.success) {
            setUsers(prev => [...prev, data.user]);
            toast.success(data.message);
            return;
        }
        toast.error(data.message);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Quản lý người dùng</h1>
                <button
                    onClick={() => setCreateModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
                >
                    + Tạo người dùng
                </button>
            </div>

            <table className="w-full border border-gray-300 text-sm">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-2 border">Tên đăng nhập</th>
                        <th className="p-2 border">Quyền quản trị viên</th>
                        <th className="p-2 border">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                            <td className="p-2 border">{user.username}</td>
                            <td className="p-2 border">{user.isAdmin ? "Có" : "Không"}</td>
                            <td className="p-2 border space-x-2">
                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        if (confirm("Bạn có chắc muốn xoá người dùng này?")) {
                                            const data = await (await fetch(`/api/users/?id=${user._id}`, {
                                                method: "DELETE",
                                            })).json();
                                            if (data.success) {
                                                toast.success(data.message);
                                                fetchUser();
                                                return;
                                            }
                                            toast.error(data.message);
                                        }
                                    }}
                                    className="inline"
                                >
                                    <button type="submit" className="text-red-600 hover:underline cursor-pointer">
                                        Xoá
                                    </button>
                                </form>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <CreateUserModal
                isOpen={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onCreate={handleCreate}
            />
        </div>
    );
}
