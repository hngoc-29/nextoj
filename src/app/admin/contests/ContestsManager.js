'use client';
import { useState } from 'react';
import ContestModal from './ContestModal';
import ContestsTable from './ContestsTable';
import { toast } from 'react-toastify';

export default function ContestsManager({ initialContests }) {
    const [contests, setContests] = useState(initialContests);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContest, setEditingContest] = useState(null);

    const handleCreate = () => {
        setEditingContest(null);
        setIsModalOpen(true);
    };

    const handleEdit = (contest) => {
        setEditingContest(contest);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xoá kỳ thi này không?')) return;
        const data = await (await fetch(`/api/contests/${id}`, { method: 'DELETE' })).json();
        setContests(contests.filter(c => c._id !== id));
        toast.success(data.message)
    };

    const handleSubmit = async (data) => {
        if (editingContest) {
            const res = await fetch(`/api/contests/${editingContest._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const dt = await res.json();
            if (dt.success) {
                const updated = dt.contest;
                setContests(contests.map(c => c._id === updated._id ? updated : c));
            }
            const status = dt.success ? toast.success : toast.error;
            status(dt.message);
        } else {
            const res = await fetch(`/api/contests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const dt = await res.json();
            if (dt.success) {
                const newContest = dt.contest;
                setContests([...contests, newContest]);
            }
            const status = dt.success ? toast.success : toast.error;
            status(typeof dt.message === 'string' ? dt.message : dt.message.errorResponse.errmsg);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="p-2 sm:p-6 space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Quản lý kỳ thi</h2>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow font-semibold transition cursor-pointer"
                    onClick={handleCreate}
                >
                    + Tạo kỳ thi
                </button>
            </div>
            <ContestsTable
                contests={contests}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            <ContestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingContest}
            />
        </div>
    );
}
