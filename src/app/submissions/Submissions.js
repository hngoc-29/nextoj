// File: src/app/admin/submissions/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function SubmissionsPage() {
    const [submissions, setSubmissions] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);
    const [loading, setLoading] = useState(false);

    // Optional filters
    const [userIdFilter, setUserIdFilter] = useState('');
    const [problemIdFilter, setProblemIdFilter] = useState('');

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });
            if (userIdFilter) params.append('userId', userIdFilter);
            if (problemIdFilter) params.append('problemId', problemIdFilter);

            const res = await fetch(`/api/submissions/all?${params.toString()}`);
            const data = await res.json();
            if (data.success) {
                setSubmissions(data.submissions);
                setTotalPages(data.pagination.totalPages);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, [page]);

    const handleFilter = () => {
        setPage(1);
        fetchSubmissions();
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Quản lý Nộp bài</h1>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">User</th>
                            <th className="p-2 border">Problem</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border">Score</th>
                            <th className="p-2 border">Thời gian nộp</th>
                            <th className="p-2 border">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="p-4 text-center text-gray-500">
                                    Đang tải...
                                </td>
                            </tr>
                        ) : submissions.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="p-4 text-center text-gray-500">
                                    Không có bản ghi nào
                                </td>
                            </tr>
                        ) : (
                            submissions.map((sub) => (
                                <tr key={sub._id} className="hover:bg-gray-50">
                                    <td className="p-2 border">{sub.username}</td>
                                    <td className="p-2 border"><Link className='text-blue-600' href={`/problems/${sub.problemId}`}>{sub.problemName}</Link></td>
                                    <td className="p-2 border">{sub.status}</td>
                                    <td className="p-2 border">{sub.score}</td>
                                    <td className="p-2 border">
                                        {new Date(sub.submittedAt).toLocaleString()}
                                    </td>
                                    <td className="p-2 border space-x-2">
                                        <button
                                            onClick={() => window.open(`/submissions/${sub._id}`, '_blank')}
                                            className="text-blue-600 hover:underline cursor-pointer"
                                        >
                                            Xem
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-4">
                <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
                >
                    Trang trước
                </button>
                <span>
                    Trang {page} / {totalPages}
                </span>
                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
                >
                    Trang sau
                </button>
            </div>
        </div>
    );
}
