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
        if (data.success) {
            setUsers(prev => [...prev, data.user]);
            toast.success(data.message);
            return;
        }
        toast.error(data.message);
    };

    return (
        <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Quản lý người dùng</h1>
                <button
                    onClick={() => setCreateModalOpen(true)}
                    className="bg-blue-600 cursor-pointer hover:bg-blue-700 transition-colors text-white px-6 py-2 rounded-full shadow-md font-semibold"
                >
                    + Tạo người dùng
                </button>
            </div>

            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white border border-gray-200 text-sm">
                    <thead>
                        <tr className="bg-blue-50 text-gray-700">
                            <th className="p-3 border-b font-semibold text-center">Tên đăng nhập</th>
                            <th className="p-3 border-b font-semibold text-center">Quyền quản trị viên</th>
                            <th className="p-3 border-b font-semibold text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-blue-50 transition">
                                <td className="p-3 border-b text-center">{user.username}</td>
                                <td className="p-3 border-b text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isAdmin ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                        {user.isAdmin ? "Có" : "Không"}
                                    </span>
                                </td>
                                <td className="p-3 border-b text-center">
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
                                        <button type="submit" className="cursor-pointer text-red-600 hover:underline font-semibold transition">
                                            Xoá
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <CreateUserModal
                isOpen={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onCreate={handleCreate}
            />
        </div>
    );
}
