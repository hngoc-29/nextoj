'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import io from 'socket.io-client';

export default function SubmissionRunClient({ submissionId, initialTestCount, BACKEND }) {
    const [testResults, setTestResults] = useState(
        Array(initialTestCount).fill({ status: 'pending', time: null, memory: null })
    );
    const [done, setDone] = useState(false);
    const [score, setScore] = useState(null);
    const [compileError, setCompileError] = useState(null);
    const socketRef = useRef(null);
    const lastItemRef = useRef(null);

    useEffect(() => {
        // Nếu đã có socket cũ, loại bỏ listener và disconnect
        if (socketRef.current) {
            socketRef.current.off(`submission_${submissionId}`);
            socketRef.current.disconnect();
        }

        const socket = io(BACKEND, { withCredentials: true });
        socketRef.current = socket;

        const handler = data => {
            if (data.done) {
                setDone(true);
                setScore(data.score);
            } else if (data.status === 'compile_error' && data.message) {
                setCompileError(data.message);
                setTestResults(prev => {
                    const next = [...prev];
                    next[0] = { status: 'compile_error', time: null, memory: null };
                    return next;
                });
            } else {
                setTestResults(prev => {
                    const next = [...prev];
                    next[data.index] = {
                        status: data.status,
                        time: data.time,
                        memory: data.memory
                    };
                    return next;
                });
            }
        };

        socket.on(`submission_${submissionId}`, handler);

        fetch(`${BACKEND}/submissions/${submissionId}/run`, { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                if (data.success) toast.warn(data.message)
                if (data.testStatuses) {
                    setTestResults(
                        data.testStatuses.map(status => ({ status, time: null, memory: null }))
                    );
                }
                if (data.status === 'compile_error' && data.msg) {
                    setCompileError(data.msg);
                    setDone(true);
                }
                if (data.done) {
                    setScore(data.score);
                    setDone(true);
                }
            })
            .catch(console.error);

        return () => {
            if (socketRef.current) {
                socketRef.current.off(`submission_${submissionId}`, handler);
                socketRef.current.disconnect();
            }
        };
    }, [submissionId, BACKEND]);

    useEffect(() => {
        if (lastItemRef.current) {
            lastItemRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [testResults]);

    // Helper: màu sắc cho status
    const getStatusStyle = (status) => {
        if (status === 'accepted') return 'bg-green-100 text-green-700 border border-green-300';
        if (status === 'pending') return 'bg-gray-100 text-gray-500 border border-gray-200';
        if (status === 'timeout') return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
        if (status === 'compile_error') return 'bg-red-100 text-red-700 border border-red-300';
        return 'bg-red-100 text-red-700 border border-red-300';
    };

    const getStatusIcon = (status) => {
        if (status === 'accepted') return '✓';
        if (status === 'pending') return '⏳';
        if (status === 'timeout') return '⏱';
        if (status === 'compile_error') return '✗';
        return '✗';
    };

    return (
        <div className="space-y-4">
            <ul className="divide-y border rounded-lg overflow-hidden bg-white">
                {testResults.map((tc, i) => (
                    <li
                        key={i}
                        ref={i === testResults.length - 1 ? lastItemRef : null}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 sm:p-3 gap-2"
                    >
                        <div className="flex items-center space-x-2">
                            <span
                                className={`w-7 h-7 flex items-center justify-center rounded-full font-bold text-lg ${getStatusStyle(tc.status)}`}
                            >
                                {getStatusIcon(tc.status)}
                            </span>
                            <span className="font-medium text-sm sm:text-base">Test case #{i + 1}</span>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-0">
                            [{tc.time != null ? `${tc.time}s` : '-'} ,{' '}
                            {tc.memory != null ? `${tc.memory}MB` : '-'}]
                        </div>
                    </li>
                ))}
            </ul>

            {compileError && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                    <h3 className="font-semibold text-red-700">Lỗi biên dịch:</h3>
                    <pre className="text-sm text-red-800 whitespace-pre-wrap">
                        {compileError}
                    </pre>
                </div>
            )}

            {done && !compileError && (
                <div className="text-center text-lg font-semibold">
                    Hoàn thành! Điểm cuối cùng: <span className="text-blue-600">{score}</span>
                </div>
            )}
        </div>
    );
}
