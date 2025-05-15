"use client";

import { useUser } from '@/context/user';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function MySubmissions({ id }) {
    const { user } = useUser();
    const [submissions, setSubmissions] = useState([]);
    const [problemTitle, setProblemTitle] = useState('');

    useEffect(() => {
        if (!user?._id) return;
        (async () => {
            try {
                const res = await fetch(`/api/submissions?userId=${user._id}&problemId=${id}`);
                const data = await res.json();
                if (data.success) {
                    setSubmissions(data.submissions);
                    setProblemTitle(data.submissions?.[0]?.title || 'bài toán');
                    document.title = `Danh sách bài nộp của ${user.username} cho ${data.submissions?.[0]?.title || ''} | OJ Platform`
                } else {
                    toast.error(data.message);
                }
            } catch (err) {
                toast.error('Lỗi khi tải danh sách submissions');
            }
        })();
    }, [user?._id, id]);

    return (
        <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-8 py-4">
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 text-center sm:text-left">
                Danh sách bài nộp {problemTitle && <>cho <span className="text-blue-700">{problemTitle}</span></>}
            </h1>
            <div className="bg-gray-200 h-[1px] mb-4" />
            {submissions.length === 0 ? (
                <div className="w-full flex justify-center items-center py-8">
                    <p className="text-gray-500 text-base md:text-lg">Chưa có submission nào.</p>
                </div>
            ) : (
                <div className="overflow-x-auto w-full">
                    <table className="min-w-[500px] w-full bg-white rounded-lg shadow text-xs sm:text-sm md:text-base">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="px-2 py-2 md:px-4">#</th>
                                <th className="px-2 py-2 md:px-4">Kết quả</th>
                                <th className="px-2 py-2 md:px-4 hidden sm:table-cell">Ngôn ngữ</th>
                                <th className="px-2 py-2 md:px-4">Thời gian</th>
                                <th className="px-2 py-2 md:px-4">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map((sub, idx) => {
                                const status = sub.status;
                                const statusLabel = status.replaceAll('_', ' ');
                                const statusColor =
                                    status === 'accepted' ? 'text-green-600' :
                                        status === 'compile_error' ? 'text-red-600' :
                                            status === 'timeout' ? 'text-yellow-600' :
                                                'text-red-600';

                                return (
                                    <tr key={sub._id} className="border-b hover:bg-gray-50 transition">
                                        <td className="px-2 py-2 md:px-4">{idx + 1}</td>
                                        <td className={`px-2 py-2 md:px-4 font-medium ${statusColor}`}>
                                            {statusLabel.toUpperCase()}
                                        </td>
                                        <td className="px-2 py-2 md:px-4 hidden sm:table-cell">{sub.language.toUpperCase()}</td>
                                        <td className="px-2 py-2 md:px-4 whitespace-nowrap">
                                            {new Date(sub.submittedAt).toLocaleString()}
                                        </td>
                                        <td className="px-2 py-2 md:px-4">
                                            <Link href={`/submissions/${sub._id}`} className="text-blue-600 hover:underline">
                                                Xem
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
