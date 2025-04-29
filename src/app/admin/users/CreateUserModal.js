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
            <div>
                <label className="block">Tên đăng nhập</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    name="username"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div>
                <label className="block">Mật khẩu</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    name="password"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div>
                <label className="block">Quyền quản trị viên</label>
                <select
                    value={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.value === "true")}
                    className="w-full p-2 border border-gray-300 rounded cursor-pointer"
                >
                    <option value="false" className="cursor-pointer">Không</option>
                    <option value="true" className="cursor-pointer">Có</option>
                </select>
            </div>
        </Modal>
    );
}
