'use client';
import { useTransition, useState } from 'react';

export default function TestcaseList({ testcases, problemId }) {
    const [isPending, startTransition] = useTransition();
    const [selected, setSelected] = useState([]);

    const handleCheck = (index) => {
        setSelected(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const handleDelete = async (indices) => {
        if (!indices.length) return;
        if (!confirm(`Xoá ${indices.length > 1 ? 'các' : ''} testcase ${indices.map(i => `#${i + 1}`).join(', ')}?`)) return;
        startTransition(async () => {
            const res = await fetch(`/api/problems/${problemId}/testcase`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ indices }),
            });
            const data = await res.json();
            if (data.success) location.reload();
            else alert(data.message);
        });
    };

    const allChecked = selected.length === testcases.length && testcases.length > 0;

    return (
        <div className="relative max-w-3xl mx-auto w-full bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl shadow-lg border border-gray-200">
            {/* Overlay loading */}
            {isPending && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-2xl">
                    <svg className="animate-spin h-10 w-10 text-blue-500" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                    </svg>
                </div>
            )}
            <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-3">
                <span role="img" aria-label="list">📃</span> Danh sách Testcase
            </h2>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={() => {
                            setSelected(allChecked ? [] : testcases.map((_, i) => i));
                        }}
                        className="accent-blue-500 cursor-pointer w-5 h-5 rounded border-gray-300"
                    />
                    <span className="text-base select-none font-medium text-gray-700">Chọn tất cả</span>
                </div>
                <button
                    disabled={selected.length === 0 || isPending}
                    onClick={() => handleDelete(selected)}
                    className={`px-4 py-2 rounded-lg text-white text-base font-semibold shadow transition
                        ${selected.length === 0 || isPending
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-red-500 hover:bg-red-600 active:scale-95 cursor-pointer'}
                        flex items-center gap-2`}
                >
                    🗑 Xoá đã chọn
                </button>
            </div>
            <ul className="divide-y divide-gray-200">
                {testcases.map((tc, i) => (
                    <li
                        key={tc._id}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-3 group hover:bg-blue-50 rounded-xl transition"
                    >
                        <div className="flex items-center gap-3 w-full">
                            <input
                                type="checkbox"
                                checked={selected.includes(i)}
                                onChange={() => handleCheck(i)}
                                className="accent-blue-500 cursor-pointer w-5 h-5 rounded border-gray-300"
                            />
                            <div className="flex flex-col text-base w-full">
                                <span>
                                    🟦 <a href={tc.input} target="_blank" rel="noopener noreferrer"
                                        className="text-blue-600 underline break-all hover:text-blue-800 transition font-semibold">Input #{i + 1}</a>
                                </span>
                                <span>
                                    🟩 <a href={tc.output} target="_blank" rel="noopener noreferrer"
                                        className="text-green-600 underline break-all hover:text-green-800 transition font-semibold">Output #{i + 1}</a>
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete([i])}
                            disabled={isPending}
                            className={`text-red-500 hover:underline text-base font-semibold transition flex items-center gap-1
                                ${isPending ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} group-hover:scale-110`}
                        >
                            🗑 Xoá
                        </button>
                    </li>
                ))}
                {testcases.length === 0 && (
                    <li className="text-gray-400 text-base italic py-4 text-center">Chưa có testcase nào.</li>
                )}
            </ul>
        </div>
    );
}
