// File: src/app/submissions/[id]/code/page.jsx
"use client";

import React, { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { useUser } from '@/context/user';
import AceEditor from 'react-ace';
import { toast } from 'react-toastify';

// Ace modes & themes
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-javascript'; // nếu bạn hỗ trợ JS
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/theme-tomorrow';

export default function Code({ id }) {
    const router = useRouter();
    const [code, setCode] = useState('');
    const [mode, setMode] = useState('c_cpp');
    const { user } = useUser();

    useEffect(() => {
        (async () => {
            try {
                // 1) Lấy info submission
                const res1 = await fetch(`/api/submissions/${id}`);
                const { success, submission, message } = await res1.json();
                if (submission.userId !== user._id) {
                    toast.error('Bạn không có quyền xem code này.');
                    notFound();
                }
                if (!success) {
                    toast.error(message);
                    return;
                }
                // 2) Xác định mode
                const lang = submission.language.toLowerCase();
                setMode(lang === 'c++' ? 'c_cpp' : lang);

                // 3) Lấy nội dung code từ URL
                const res2 = await fetch(submission.code);
                const text = await res2.text();
                setCode(text);
            } catch (err) {
                toast.error('Không thể tải code.');
            }
        })();
    }, [id]);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Xem Code</h1>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
                >
                    Quay lại
                </button>
            </div>

            <AceEditor
                mode={mode}
                theme="tomorrow"
                name="submission_code"
                value={code}
                readOnly
                width="100%"
                height="60vh"
                fontSize={14}
                setOptions={{
                    useWorker: false,
                    showLineNumbers: true,
                    tabSize: 2,
                }}
            />
        </div>
    );
}
