"use client";

import { useState, useEffect } from "react";

export default function ContestModal({ isOpen, onClose, onSubmit, initialData = null }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || "");
            setDescription(initialData.description || "");
        } else {
            setTitle("");
            setDescription("");
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title, description });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white w-[95vw] max-w-md sm:max-w-lg p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-100 animate-fadeIn">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                    {initialData ? "Cập nhật kỳ thi" : "Tạo kỳ thi"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-1 font-semibold text-gray-700">Tên kỳ thi</label>
                        <input
                            type="text"
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Nhập tên kỳ thi"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold text-gray-700">Mô tả</label>
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition min-h-[80px]"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Nhập mô tả kỳ thi"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-end items-center mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-full font-semibold transition cursor-pointer"
                        >
                            Huỷ
                        </button>
                        <button
                            type="submit"
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold shadow transition cursor-pointer"
                        >
                            {initialData ? "Lưu thay đổi" : "Tạo mới"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
