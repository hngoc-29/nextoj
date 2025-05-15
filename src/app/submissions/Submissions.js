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
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-[700px] w-full bg-white text-xs sm:text-sm md:text-base">
                    <thead>
                        <tr className="bg-black text-white">
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
                                <td colSpan={6} className="p-4 text-center text-gray-500">
                                    Đang tải...
                                </td>
                            </tr>
                        ) : submissions.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-4 text-center text-gray-500">
                                    Không có bản ghi nào
                                </td>
                            </tr>
                        ) : (
                            submissions.map((sub) => {
                                // Status color & label
                                let statusColor = "bg-gray-200 text-gray-800";
                                let statusLabel = sub.status;
                                if (sub.status === "accepted") {
                                    statusColor = "bg-green-100 text-green-700 border border-green-300";
                                    statusLabel = "Accepted";
                                } else if (sub.status === "compile_error") {
                                    statusColor = "bg-red-100 text-red-700 border border-red-300";
                                    statusLabel = "Compile Error";
                                } else if (sub.status === "wrong_answer") {
                                    statusColor = "bg-yellow-100 text-yellow-700 border border-yellow-300";
                                    statusLabel = "Wrong Answer";
                                } else if (sub.status === "timeout") {
                                    statusColor = "bg-yellow-100 text-yellow-700 border border-yellow-300";
                                    statusLabel = "Timeout";
                                } else if (sub.status === "partial") {
                                    statusColor = "bg-blue-100 text-blue-700 border border-blue-300";
                                    statusLabel = "Partial";
                                }

                                // Score: accept/total nếu có
                                let scoreDisplay = sub.score;
                                if (typeof sub.acceptedTestcases === "number" && typeof sub.totalTestcases === "number") {
                                    scoreDisplay = (
                                        <span>
                                            <span className="font-semibold text-green-700">{sub.acceptedTestcases}</span>
                                            <span className="text-gray-500">/</span>
                                            <span className="font-semibold text-gray-700">{sub.totalTestcases}</span>
                                        </span>
                                    );
                                }

                                return (
                                    <tr key={sub._id} className="hover:bg-gray-50 transition">
                                        <td className="p-2 border break-all">{sub.username}</td>
                                        <td className="p-2 border break-all">
                                            <Link className='text-blue-600 hover:underline' href={`/problems/${sub.problemId}`}>
                                                {sub.problemName}
                                            </Link>
                                        </td>
                                        <td className="p-2 border">
                                            <span className={`px-2 py-1 rounded text-xs sm:text-sm font-semibold inline-block ${statusColor}`}>
                                                {statusLabel}
                                            </span>
                                        </td>
                                        <td className="p-2 border text-center">{scoreDisplay}</td>
                                        <td className="p-2 border whitespace-nowrap">{new Date(sub.submittedAt).toLocaleString()}</td>
                                        <td className="p-2 border space-x-2 text-center">
                                            <button
                                                onClick={() => window.open(`/submissions/${sub._id}`, '_blank')}
                                                className="text-blue-600 hover:underline cursor-pointer"
                                            >
                                                Xem
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
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
