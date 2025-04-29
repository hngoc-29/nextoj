'use client';
import { useState } from 'react';

export default function UploadForm({ problemId }) {
    const [input, setInput] = useState(null);
    const [output, setOutput] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        if (!input || !output) return alert('Vui lòng chọn file input và output');
        const form = new FormData();
        form.append('input', input);
        form.append('output', output);

        setLoading(true);
        const res = await fetch(`/api/problems/${problemId}/testcase`, {
            method: 'POST',
            body: form,
        });
        const data = await res.json();
        setLoading(false);
        if (data.success) location.reload();
        else alert(data.message);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">➕ Thêm Testcase</h2>
            <div className="space-y-2">
                <input
                    type="file"
                    accept=".txt"
                    onChange={(e) => setInput(e.target.files[0])}
                    className="file-input file-input-bordered cursor-pointer w-full py-2 px-4 border-2 border-gray-300 rounded-lg text-gray-700 bg-white hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                />
                <input
                    type="file"
                    accept=".txt"
                    onChange={(e) => setOutput(e.target.files[0])}
                    className="file-input file-input-bordered cursor-pointer w-full py-2 px-4 border-2 border-gray-300 rounded-lg text-gray-700 bg-white hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                />
                <button
                    onClick={handleAdd}
                    disabled={loading}
                    className={`${loading ? "cursor-not-allowed" : "cursor-pointer"} w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition`}
                >
                    {loading ? 'Đang tải...' : '📤 Upload'}
                </button>
            </div>
        </div>
    );
}
