'use client';

import Link from "next/link";

export default function ContestsTable({ contests, onEdit, onDelete }) {
    return (
        <div className="overflow-x-auto rounded-xl shadow">
            <table className="min-w-full bg-white border border-gray-200 text-sm">
                <thead>
                    <tr className="bg-blue-50 text-gray-700">
                        <th className="p-3 border-b font-semibold text-center">Tên kỳ thi</th>
                        <th className="p-3 border-b font-semibold text-center">Mô tả</th>
                        <th className="p-3 border-b font-semibold text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {contests.map((contest) => (
                        <tr key={contest._id} className="hover:bg-blue-50 transition">
                            <td className="p-3 border-b text-center"><Link className="text-blue-600 hover:underline" href={`/admin/contests/${contest._id}`}>{contest.title}</Link></td>
                            <td className="p-3 border-b text-center">{contest.description}</td>
                            <td className="p-3 border-b text-center space-x-2">
                                <button
                                    className="text-blue-600 hover:bg-blue-100 hover:text-blue-800 px-3 py-1 rounded-full font-semibold transition cursor-pointer"
                                    onClick={() => onEdit(contest)}
                                >
                                    Sửa
                                </button>
                                <button
                                    className="text-red-600 hover:bg-red-100 hover:text-red-800 px-3 py-1 rounded-full font-semibold transition cursor-pointer"
                                    onClick={() => onDelete(contest._id)}
                                >
                                    Xoá
                                </button>
                            </td>
                        </tr>
                    ))}
                    {contests.length === 0 && (
                        <tr>
                            <td colSpan={3} className="p-4 text-center text-gray-500">
                                Không có kỳ thi nào.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
