'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import io from 'socket.io-client';

export default function SubmissionRunClient({ submissionId, initialTestCount, BACKEND }) {
    const [testResults, setTestResults] = useState(
        Array(initialTestCount).fill({ status: 'pending', time: null, memory: null })
    );
    const [done, setDone] = useState(false);
    const [score, setScore] = useState(null);
    const [compileError, setCompileError] = useState(null);

    useEffect(() => {
        const socket = io(BACKEND, { withCredentials: true });

        socket.on(`submission_${submissionId}`, data => {
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
            } else if (typeof data.index === 'number') {
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
        });

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

        return () => socket.disconnect();
    }, [submissionId]);

    return (
        <div className="space-y-4">
            <ul className="divide-y border rounded overflow-hidden">
                {testResults.map((tc, i) => (
                    <li key={i} className="flex justify-between items-center p-2">
                        <div className="flex items-center space-x-2">
                            <span
                                className={
                                    tc.status === 'accepted'
                                        ? 'text-green-600'
                                        : tc.status === 'pending'
                                            ? 'text-gray-400'
                                            : tc.status === 'timeout'
                                                ? 'text-yellow-600'
                                                : 'text-red-600'
                                }
                            >
                                {tc.status === 'accepted'
                                    ? '✓'
                                    : tc.status === 'pending'
                                        ? '⏳'
                                        : tc.status === 'timeout'
                                            ? '⏱'
                                            : '✗'}
                            </span>
                            <span>Test case #{i + 1}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                            [{tc.time != null ? `${tc.time}s` : '-'} ,{' '}
                            {tc.memory != null ? `${tc.memory}MB` : '-'}]
                        </div>
                    </li>
                ))}
            </ul>

            {compileError && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
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
