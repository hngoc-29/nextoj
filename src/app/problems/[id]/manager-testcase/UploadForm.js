'use client';
import { useState } from 'react';
import JSZip from 'jszip';

export default function UploadForm({ problemId }) {
    const [zipFiles, setZipFiles] = useState([]);
    const [pairs, setPairs] = useState([{ input: null, output: null }]);
    const [loading, setLoading] = useState(false);

    // Xử lý khi chọn file zip
    const handleZipChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const zip = new JSZip();
        const content = await file.arrayBuffer();
        const loaded = await zip.loadAsync(content);
        const files = [];
        loaded.forEach((relativePath, fileObj) => {
            if (!fileObj.dir) files.push(fileObj.name);
        });
        setZipFiles(files);
        // Reset pairs
        setPairs([{ input: null, output: null }]);
    };

    // Thêm testcase pair mới
    const addPair = () => setPairs([...pairs, { input: null, output: null }]);

    // Chọn file input/output cho từng pair
    const handlePairChange = (idx, type, value) => {
        const newPairs = [...pairs];
        newPairs[idx][type] = value;
        setPairs(newPairs);
    };

    // Gửi lên server
    const handleAdd = async () => {
        if (pairs.some(p => !p.input || !p.output)) {
            return alert('Vui lòng chọn đủ input và output cho từng testcase');
        }
        setLoading(true);

        // Đọc lại file zip
        const zipInput = document.getElementById('zip-input').files[0];
        const zip = new JSZip();
        const content = await zipInput.arrayBuffer();
        const loaded = await zip.loadAsync(content);

        const form = new FormData();
        for (let i = 0; i < pairs.length; i++) {
            const inputName = pairs[i].input;
            const outputName = pairs[i].output;
            const inputFile = await loaded.file(inputName).async('blob');
            const outputFile = await loaded.file(outputName).async('blob');
            form.append(`input${i}`, new File([inputFile], inputName));
            form.append(`output${i}`, new File([outputFile], outputName));
        }

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
        <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl shadow-lg border border-gray-100 max-w-xl mx-auto my-4">
            <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
                <span className="text-3xl">➕</span> Thêm Testcase từ ZIP
            </h2>
            <label
                htmlFor="zip-input"
                className="block mb-4 cursor-pointer transition hover:scale-105"
            >
                <input
                    id="zip-input"
                    type="file"
                    accept=".zip"
                    onChange={handleZipChange}
                    className="hidden"
                />
                <div className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded-lg px-4 py-3 text-blue-700 font-medium transition cursor-pointer">
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#2563eb" d="M12 16.5a1 1 0 0 1-1-1V7.41l-2.3 2.3a1 1 0 1 1-1.4-1.42l4-4a1 1 0 0 1 1.4 0l4 4a1 1 0 1 1-1.4 1.42l-2.3-2.3V15.5a1 1 0 0 1-1 1Z" /><path fill="#2563eb" d="M19 20.5H5a1 1 0 0 1-1-1v-6a1 1 0 1 1 2 0v5h12v-5a1 1 0 1 1 2 0v6a1 1 0 0 1-1 1Z" /></svg>
                    <span>Chọn file ZIP testcase</span>
                </div>
            </label>
            {zipFiles.length > 0 && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {pairs.map((pair, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row gap-2 items-center bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                                <div className="flex-1 w-full">
                                    <label className="block text-sm text-gray-600 mb-1 font-medium">Input</label>
                                    <select
                                        value={pair.input || ''}
                                        onChange={e => handlePairChange(idx, 'input', e.target.value)}
                                        className="border border-blue-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                    >
                                        <option value="">Chọn input</option>
                                        {zipFiles.map(f => (
                                            <option key={f} value={f}>{f}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1 w-full">
                                    <label className="block text-sm text-gray-600 mb-1 font-medium">Output</label>
                                    <select
                                        value={pair.output || ''}
                                        onChange={e => handlePairChange(idx, 'output', e.target.value)}
                                        className="border border-blue-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                    >
                                        <option value="">Chọn output</option>
                                        {zipFiles.map(f => (
                                            <option key={f} value={f}>{f}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={addPair}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold transition underline underline-offset-2 cursor-pointer"
                    >
                        <span className="text-lg">+</span> Thêm testcase
                    </button>
                </div>
            )}
            <button
                onClick={handleAdd}
                disabled={loading || zipFiles.length === 0}
                className={`mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow transition 
                ${loading || zipFiles.length === 0 ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        Đang tải...
                    </span>
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M12 16.5a1 1 0 0 1-1-1V7.41l-2.3 2.3a1 1 0 1 1-1.4-1.42l4-4a1 1 0 0 1 1.4 0l4 4a1 1 0 1 1-1.4 1.42l-2.3-2.3V15.5a1 1 0 0 1-1 1Z" /><path fill="#fff" d="M19 20.5H5a1 1 0 0 1-1-1v-6a1 1 0 1 1 2 0v5h12v-5a1 1 0 1 1 2 0v6a1 1 0 0 1-1 1Z" /></svg>
                        Upload
                    </span>
                )}
            </button>
        </div>
    );
}
