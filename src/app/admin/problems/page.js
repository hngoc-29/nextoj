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
            toast.error("Lỗi khi tải danh sách bài toán")
        }
    };

    useEffect(() => {
        const fetchContest = async () => {
            try {
                const data = await (await fetch(`/api/contests`)).json();
                if (data.success) {
                    setContests(data.contest);
                } else {
                    console.error('Fetch contest failed:', data.message);
                    toast.error(data.message)
                }
            } catch (err) {
                toast.error("Lỗi khi tải danh sách cuộc thi")
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
        const data = await (await fetch(`/api/problems/`, {
            method: "POST",
            body: newData
        })).json();
        data.success ? toast.success(data.message) : toast.error(data.message);
        setCreateModalOpen(false);
        fetchProblems(page);
    };

    const handleUpdate = async (id, updatedData) => {
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
        if (problems.length === 1 && page > 1) {
            setPage(page - 1);
        } else {
            fetchProblems(page);
        }
    };

    return (
        <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Quản lý bài toán</h1>
                <button
                    onClick={() => setCreateModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-2 rounded-full shadow-md font-semibold cursor-pointer"
                >
                    + Tạo bài toán
                </button>
            </div>

            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white border border-gray-200 text-sm">
                    <thead>
                        <tr className="bg-blue-50 text-gray-700">
                            <th className="p-3 border-b font-semibold text-center">Tiêu đề</th>
                            <th className="p-3 border-b font-semibold text-center">Thời gian</th>
                            <th className="p-3 border-b font-semibold text-center">Bộ nhớ</th>
                            <th className="p-3 border-b font-semibold text-center">Điểm</th>
                            <th className="p-3 border-b font-semibold text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {problems.map((problem) => (
                            <tr key={problem._id} className="hover:bg-blue-50 transition">
                                <td className="p-3 border-b text-center">{problem.title}</td>
                                <td className="p-3 border-b text-center">{problem.timeLimit} ms</td>
                                <td className="p-3 border-b text-center">{problem.memoryLimit} MB</td>
                                <td className="p-3 border-b text-center">{problem.point}</td>
                                <td className="p-3 border-b text-center space-x-2">
                                    <button
                                        onClick={() => { setSelectedProblem(problem); setUpdateModalOpen(true); }}
                                        className="text-blue-600 hover:underline font-semibold transition cursor-pointer"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(problem._id)}
                                        className="text-red-600 hover:underline font-semibold transition cursor-pointer"
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
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
                <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50 font-semibold transition cursor-pointer"
                >
                    Trang trước
                </button>
                <span className="text-gray-700 font-medium">Trang {page} / {totalPages}</span>
                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50 font-semibold transition cursor-pointer"
                >
                    Trang sau
                </button>
            </div>

            <CreateProblemModal
                isOpen={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onCreate={handleCreate}
                selectedContests={selectedContests}
                setSelectedContests={setSelectedContests}
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
