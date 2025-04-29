'use client';
import { useTransition } from 'react';

export default function TestcaseList({ testcases, problemId }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async (index) => {
        if (!confirm(`Xoá testcase #${index + 1}?`)) return;
        const res = await fetch(`/api/problems/${problemId}/testcase?index=${index}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        if (data.success) startTransition(() => location.reload());
        else alert(data.message);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">📃 Danh sách Testcase</h2>
            <ul className="divide-y divide-gray-200">
                {testcases.map((tc, i) => (
                    <li key={tc._id} className="flex justify-between items-center py-2">
                        <div className="flex flex-col text-sm">
                            <span>
                                🟦 <a href={tc.input} target="_blank" className="text-blue-500 underline">Input #{i + 1}</a>
                            </span>
                            <span>
                                🟩 <a href={tc.output} target="_blank" className="text-green-500 underline">Output #{i + 1}</a>
                            </span>
                        </div>
                        <button
                            onClick={() => handleDelete(i)}
                            className="text-red-500 hover:underline text-sm cursor-pointer"
                        >
                            🗑 Xoá
                        </button>
                    </li>
                ))}
                {testcases.length === 0 && (
                    <li className="text-gray-400 text-sm italic py-2">Chưa có testcase nào.</li>
                )}
            </ul>
        </div>
    );
}
