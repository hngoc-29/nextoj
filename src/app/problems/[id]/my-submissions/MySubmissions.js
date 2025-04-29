"use client";

import { useUser } from '@/context/user';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function MySubmissions({ id }) {
    const { user } = useUser();
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        if (!user?._id) return;
        (async () => {
            try {
                const res = await fetch(`/api/submissions?userId=${user._id}&problemId=${id}`);
                const data = await res.json();
                if (data.success) {
                    setSubmissions(data.submissions);
                    document.title = `Danh sách bài nộp của ${user.usernamse} cho ${data.submissions.title} | OJ Platform`
                } else {
                    toast.error(data.message);
                }
            } catch (err) {
                toast.error('Lỗi khi tải danh sách submissions');
            }
        })();
    }, [user?._id, id]);

    if (submissions.length === 0) {
        return <p className="text-gray-500">Chưa có submission nào.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="px-4 py-2">#</th>
                        <th className="px-4 py-2">Kết quả</th>
                        <th className="px-4 py-2">Ngôn ngữ</th>
                        <th className="px-4 py-2">Thời gian</th>
                        <th className="px-4 py-2">Trạng thái</th>
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
                            <tr key={sub._id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-2">{idx + 1}</td>
                                <td className={`px-4 py-2 font-medium ${statusColor}`}>
                                    {statusLabel.toUpperCase()}
                                </td>
                                <td className="px-4 py-2">{sub.language.toUpperCase()}</td>
                                <td className="px-4 py-2">
                                    {new Date(sub.submittedAt).toLocaleString()}
                                </td>
                                <td className="px-4 py-2">
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
    );
}
