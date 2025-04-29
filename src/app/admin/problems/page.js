// File: app/admin/problems/page.jsx
'use client';

import { useState, useEffect } from 'react';
import CreateProblemModal from './CreateProblemModal';
import UpdateProblemModal from './UpdateProblemModal';
import { toast } from 'react-toastify';

export default function ProblemsPage() {
    const [problems, setProblems] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedContests, setSelectedContests] = useState([]);
    const limit = 5;

    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [contests, setContests] = useState([]);

    // Fetch problems for current page
    const fetchProblems = async (pageNumber) => {
        try {
            const res = await fetch(`/api/problems?limit=${limit}&page=${pageNumber}`);
            const data = await res.json();
            if (data.success) {
                setProblems(data.problems);
                setTotalPages(data.pagination.totalPages);
            } else {
                console.error('Fetch problems failed:', data.message);
                toast.error(data.message)
            }
        } catch (err) {
            console.error('Error fetching problems:', err);
            toast.error(data.message)
        }
    };

    useEffect(() => {
        const fetchContest = async (pageNumber) => {
            try {
                const data = await (await fetch(`/api/contests`)).json();
                if (data.success) {
                    setContests(data.contest);
                } else {
                    console.error('Fetch contest failed:', data.message);
                    toast.error(data.message)
                }
            } catch (err) {
                toast.error(err.message)
            }
        };
        document.title = `Quản lí bài | OJ Platform`
        fetchContest();
    }, [])

    // Fetch when component mounts or page changes
    useEffect(() => {
        fetchProblems(page);
    }, [page]);

    const handleCreate = async (newData) => {
        // TODO: call API to create problem then refetch or update state
        const data = await (await fetch(`/api/problems/`, {
            method: "POST",
            body: newData
        })).json();
        data.success ? toast.success(data.message) : toast.error(data.message);
        setUpdateModalOpen(false);
        fetchProblems(page);
    };

    const handleUpdate = async (id, updatedData) => {
        // TODO: call API to update problem then refetch or update state
        const data = await (await fetch(`/api/problems/${id}`, {
            method: "PUT",
            body: updatedData
        })).json();
        data.success ? toast.success(data.message) : toast.error(data.message);
        setUpdateModalOpen(false);
        fetchProblems(page);
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xoá bài toán này?')) return;
        const data = await ((await fetch(`/api/problems/${id}`, { method: 'DELETE' })).json());
        data.success ? toast.success(data.message) : toast.error(data.message);
        // If last item on page deleted and page >1, go to previous page
        if (problems.length === 1 && page > 1) {
            setPage(page - 1);
        } else {
            fetchProblems(page);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Quản lý bài toán</h1>
                <button
                    onClick={() => setCreateModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
                >
                    + Tạo bài toán
                </button>
            </div>

            <table className="w-full border border-gray-300 text-sm">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-2 border">Tiêu đề</th>
                        <th className="p-2 border">Thời gian</th>
                        <th className="p-2 border">Bộ nhớ</th>
                        <th className="p-2 border">Điểm</th>
                        <th className="p-2 border">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {problems.map((problem) => (
                        <tr key={problem._id} className="hover:bg-gray-50">
                            <td className="p-2 border">{problem.title}</td>
                            <td className="p-2 border">{problem.timeLimit} ms</td>
                            <td className="p-2 border">{problem.memoryLimit} MB</td>
                            <td className="p-2 border">{problem.point}</td>
                            <td className="p-2 border space-x-2">
                                <button
                                    onClick={() => { setSelectedProblem(problem); setUpdateModalOpen(true); }}
                                    className="text-blue-600 hover:underline cursor-pointer"
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(problem._id)}
                                    className="text-red-600 hover:underline ml-2 cursor-pointer"
                                >
                                    Xoá
                                </button>
                            </td>
                        </tr>
                    ))}
                    {problems.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-4 text-center text-gray-500">
                                Không có bài toán nào.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center space-x-4 mt-4">
                <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
                >
                    Trang trước
                </button>
                <span>Trang {page} / {totalPages}</span>
                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
                >
                    Trang sau
                </button>
            </div>

            <CreateProblemModal
                isOpen={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onCreate={handleCreate}
            />
            <UpdateProblemModal
                isOpen={isUpdateModalOpen}
                selectedContests={selectedContests}
                setSelectedContests={setSelectedContests}
                onClose={() => setUpdateModalOpen(false)}
                onUpdate={handleUpdate}
                problemData={{
                    ...selectedProblem,
                    contests
                }}
            />
        </div>
    );
}
