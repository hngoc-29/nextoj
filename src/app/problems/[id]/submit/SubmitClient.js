'use client';

import React, { useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/ext-language_tools';

import { useUser } from '@/context/user';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useProblemContest } from '@/context/problemContest';

const languages = [
    { value: 'c++', label: 'C++17 (g++ 13)', aceMode: 'c_cpp' },
];

export default function SubmitClient({ problem }) {
    const [code, setCode] = useState('');
    const { user } = useUser();
    const [language, setLanguage] = useState('c++');
    const [fileName, setFileName] = useState('No file chosen');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => setCode(event.target?.result);
        reader.readAsText(file);
    };

    const handleSubmit = async () => {
        toast.warning(`Đang nộp...`);
        setIsLoading(true);
        const data = {
            code,
            userId: user._id,
            username: user.username,
            problemId: problem._id,
            problemName: problem.title,
            language
        };
        const res = await (await fetch(`/api/submissions`, {
            method: `POST`,
            body: JSON.stringify(data)
        })).json();
        if (res.success) {
            router.push(`/submissions/${res.submission._id}`);
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className="mt-5 w-full max-w-5xl mx-auto border border-[#ccc] px-2 py-3 rounded-[5px] bg-white shadow-sm
            sm:px-4 sm:py-5
            md:px-6 md:py-7
            ">
            <div className='flex flex-col sm:flex-row sm:items-center gap-y-2 gap-x-3'>
                <span className="text-[15px] font-[400] mb-2 sm:mb-0 block">
                    Dán bài làm của bạn ở đây hoặc nhập từ file:
                </span>
                {/* File input */}
                <div className='mb-2 sm:mb-0'>
                    <label className="inline-block cursor-pointer bg-gray-100 border border-gray-300 px-2 py-1 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-200 transition">
                        Chọn file
                        <input
                            type="file"
                            accept=".cpp,.py,.txt"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                    </label>
                </div>
                <span className="text-sm text-gray-600 mt-1 italic mb-2.5 sm:mb-0">{fileName}</span>
            </div>

            {/* Code editor */}
            <div className="mt-2">
                <AceEditor
                    mode={languages.find((l) => l.value === language)?.aceMode || 'text'}
                    theme="github"
                    name="code-editor"
                    fontSize={14}
                    showPrintMargin
                    showGutter
                    highlightActiveLine
                    value={code}
                    onChange={setCode}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        showLineNumbers: true,
                    }}
                    className="rounded-md border border-gray-300"
                    style={{
                        width: '100%',
                        height: '250px',
                        maxWidth: '100vw'
                    }}
                />
            </div>

            {/* Language select */}
            <div className="mt-4">
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md text-sm w-full max-w-xs"
                >
                    {languages.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                            {lang.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Submit button */}
            <div className='text-end'>
                <button
                    disabled={isLoading}
                    onClick={handleSubmit}
                    className={`${isLoading ? `cursor-not-allowed` : `cursor-pointer`
                        } mt-4 bg-gradient-to-b from-[#337ab7] to-[#265a88] hover:bg-[#265a88] text-white px-5 py-2 rounded shadow-sm text-sm w-full sm:w-auto`}
                >
                    Nộp bài!
                </button>
            </div>
        </div>
    );
}
