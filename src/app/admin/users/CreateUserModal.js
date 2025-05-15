// components/CreateUserModal.js
"use client"
import Modal from "./Modal";
import { useState } from "react";

export default function CreateUserModal({ isOpen, onClose, onCreate }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    const handleCreate = (e) => {
        e.preventDefault();
        const newUser = {
            username,
            password,
            isAdmin,
        };
        onCreate(newUser);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} onSubmit={handleCreate} title="Tạo Người Dùng Mới">
            <div className="space-y-4">
                <div>
                    <label className="block mb-1 font-semibold text-gray-700">Tên đăng nhập</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        name="username"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        required
                        placeholder="Nhập tên đăng nhập"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-semibold text-gray-700">Mật khẩu</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        name="password"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        required
                        placeholder="Nhập mật khẩu"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-semibold text-gray-700">Quyền quản trị viên</label>
                    <select
                        value={isAdmin}
                        onChange={(e) => setIsAdmin(e.target.value === "true")}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition cursor-pointer"
                    >
                        <option value="false" className="cursor-pointer">Không</option>
                        <option value="true" className="cursor-pointer">Có</option>
                    </select>
                </div>
            </div>
        </Modal>
    );
}
