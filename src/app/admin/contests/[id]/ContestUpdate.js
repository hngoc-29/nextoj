"use client";
import { useState, useEffect } from "react";

export default function ContestUpdate({ id, initialProblems = [] }) {
    const [problemIds, setProblemIds] = useState([""]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [problems, setProblems] = useState(initialProblems);
    const [refresh, setRefresh] = useState(0);
    const [removingId, setRemovingId] = useState(null);

    // Fetch problems of this contest khi refresh
    useEffect(() => {
        if (refresh === 0) return; // Lần đầu đã có initialProblems
        const fetchProblems = async () => {
            try {
                const res = await fetch(`/api/problems?contestId=${id}`);
                const data = await res.json();
                if (data.success) setProblems(data.problems || []);
                else setProblems([]);
            } catch {
                setProblems([]);
            }
        };
        fetchProblems();
    }, [id, refresh]);

    const handleChange = (idx, value) => {
        const arr = [...problemIds];
        arr[idx] = value;
        setProblemIds(arr);
    };

    const handleAddField = () => setProblemIds([...problemIds, ""]);
    const handleRemoveField = idx => {
        if (problemIds.length === 1) return;
        setProblemIds(problemIds.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        const ids = problemIds.map(id => id.trim()).filter(Boolean);
        if (ids.length === 0) {
            setMessage({ type: "error", text: "Vui lòng nhập ít nhất 1 problemId" });
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(`/api/contests/${id}/add-problems`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ problemIds: ids }),
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: "success", text: "Thêm bài thành công!" });
                setProblemIds([""]);
                setRefresh(r => r + 1); // Refresh problems list
            } else {
                setMessage({ type: "error", text: data.message || "Có lỗi xảy ra" });
            }
        } catch {
            setMessage({ type: "error", text: "Không thể kết nối server" });
        }
        setLoading(false);
    };

    // Xử lý xóa problem khỏi contest
    const handleRemoveProblem = async (problemId) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa bài này khỏi contest?")) return;
        setRemovingId(problemId);
        setMessage(null);
        try {
            const res = await fetch(`/api/contests/${id}/remove-problem`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ problemId }),
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: "success", text: "Đã xóa bài khỏi contest!" });
                setRefresh(r => r + 1);
            } else {
                setMessage({ type: "error", text: data.message || "Xóa thất bại" });
            }
        } catch {
            setMessage({ type: "error", text: "Không thể kết nối server" });
        }
        setRemovingId(null);
    };

    return (
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 mb-8">
                <h1 className="text-2xl font-bold mb-6 text-center text-purple-700">Thêm bài vào Contest</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {problemIds.map((id, idx) => (
                        <div key={idx} className="flex gap-2">
                            <input
                                type="text"
                                value={id}
                                onChange={e => handleChange(idx, e.target.value)}
                                placeholder="Nhập Problem ID"
                                className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
                                required
                                disabled={loading}
                            />
                            {problemIds.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveField(idx)}
                                    className={`text-red-500 hover:text-red-700 font-bold px-2 cursor-pointer ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                    aria-label="Xóa"
                                    title="Xóa trường này"
                                    disabled={loading}
                                >×</button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddField}
                        className={`w-full py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition cursor-pointer ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={loading}
                    >
                        + Thêm trường nhập ID
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 bg-purple-600 text-white rounded font-semibold transition flex items-center justify-center ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-700 cursor-pointer"}`}
                    >
                        {loading && (
                            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                        )}
                        {loading ? "Đang thêm..." : "Thêm bài"}
                    </button>
                </form>
                {message && (
                    <div className={`mt-4 text-center ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
                        {message.text}
                    </div>
                )}
            </div>
            <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-purple-700">Danh sách bài trong contest</h2>
                {problems.length === 0 ? (
                    <div className="text-gray-500 text-center">Chưa có bài nào</div>
                ) : (
                    <ul className="divide-y overflow-y-auto">
                        {problems.map((p, idx) => (
                            <li key={p._id} className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between group">
                                <span className="font-medium">{idx + 1}. {p.title}</span>
                                <span className="text-xs text-gray-500 break-all">ID: {p._id}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveProblem(p._id)}
                                    className={`ml-2 text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded cursor-pointer transition ${removingId === p._id ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={removingId === p._id}
                                    title="Xóa bài này khỏi contest"
                                >
                                    {removingId === p._id ? (
                                        <svg className="animate-spin h-4 w-4 inline" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                        </svg>
                                    ) : "Xóa"}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}