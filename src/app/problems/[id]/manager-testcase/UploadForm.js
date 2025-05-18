'use client';
import { useState } from 'react';
import JSZip from 'jszip';
import DragDropWrapper from '@/components/DragDropWrapper';

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

    // Hàm lấy token từ cookie theo tên
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

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

        // Lấy token từ cookie
        const token = getCookie('token');

        try {
            const res = await fetch(`${process.env.BACKEND_URL_UP_TEST}/problems/${problemId}/testcase`, {
                method: 'POST',
                body: form,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (res.status === 413) {
                setLoading(false);
                alert('File upload quá lớn. Vui lòng chọn ít testcase hơn hoặc giảm kích thước file ZIP.');
                return;
            }

            const data = await res.json();
            setLoading(false);
            if (data.success) location.reload();
            else alert(data.message);
        } catch (err) {
            setLoading(false);
            alert('Có lỗi xảy ra khi upload. Vui lòng thử lại.');
        }
    };

    // Hàm tự động fill các cặp input/output
    const handleFill = () => {
        // Lọc các file input và output đúng định dạng
        const inputFiles = zipFiles.filter(f => /^input\d{2}\.txt$/.test(f)).sort();
        const outputFiles = zipFiles.filter(f => /^output\d{2}\.txt$/.test(f)).sort();

        // Kiểm tra số lượng và tên file có khớp không
        if (
            inputFiles.length === 0 ||
            outputFiles.length === 0 ||
            inputFiles.length !== outputFiles.length
        ) {
            alert('Không tìm thấy đủ file input/output đúng định dạng (input01.txt, output01.txt, ...) hoặc số lượng không khớp.');
            return;
        }

        // Kiểm tra từng cặp có cùng số thứ tự không
        for (let i = 0; i < inputFiles.length; i++) {
            const inNum = inputFiles[i].match(/\d{2}/)[0];
            const outNum = outputFiles[i].match(/\d{2}/)[0];
            if (inNum !== outNum) {
                alert('Các file input/output không khớp số thứ tự.');
                return;
            }
        }

        // Tạo pairs
        const newPairs = inputFiles.map((input, i) => ({
            input,
            output: outputFiles[i],
        }));
        setPairs(newPairs);
    };

    // Xử lý khi kéo-thả file zip
    const handleZipDrop = async (file) => {
        if (!file) return;
        const zip = new JSZip();
        const content = await file.arrayBuffer();
        const loaded = await zip.loadAsync(content);
        const files = [];
        loaded.forEach((relativePath, fileObj) => {
            if (!fileObj.dir) files.push(fileObj.name);
        });
        setZipFiles(files);
        setPairs([{ input: null, output: null }]);
        // Gán file vào input để có thể upload lên server
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        document.getElementById('zip-input').files = dataTransfer.files;
    };

    return (
        <DragDropWrapper onFileDrop={handleZipDrop}>
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
                        <div className="flex justify-end mb-2">
                            <button
                                type="button"
                                onClick={handleFill}
                                className="bg-green-500 cursor-pointer hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
                            >
                                Tự động điền
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setPairs([{ input: null, output: null }]);
                                    setZipFiles([]);
                                    // Xóa file khỏi input
                                    const input = document.getElementById('zip-input');
                                    if (input) input.value = '';
                                }}
                                className="ml-2 bg-red-500 cursor-pointer hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
                            >
                                Xóa tất cả
                            </button>
                        </div>
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
                                    {/* Nút xóa cặp này */}
                                    {pairs.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPairs(pairs.filter((_, i) => i !== idx));
                                            }}
                                            className="ml-2 mt-2 sm:mt-0 bg-red-100 hover:bg-red-200 text-red-600 font-bold rounded px-3 py-1 transition"
                                            title="Xóa cặp này"
                                        >
                                            Xóa
                                        </button>
                                    )}
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
        </DragDropWrapper>
    );
}
