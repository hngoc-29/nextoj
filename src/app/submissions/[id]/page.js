// File: src/app/submissions/[id]/page.js
import Link from 'next/link';
import SubmissionRunClient from './SubmissionRunClient';
import { notFound } from 'next/navigation';

export const revalidate = 0;

async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json();
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    const base = process.env.BASE_URL;
    const subData = await fetchJSON(`${base}/api/submissions/${id}`);
    const submission = subData?.submission;
    if (!submission) {
        return { title: 'Submission not found | OJ Platform' };
    }
    const probData = await fetchJSON(
        `${base}/api/problems/${submission.problemId}`
    );
    const problem = probData?.problems;
    return { title: `Kết quả bài nộp ${problem?.title} | OJ Platform` };
}

export default async function SubmissionResultPage({ params }) {
    const { id } = await params;
    const base = process.env.BASE_URL;
    const subData = await fetchJSON(`${base}/api/submissions/${id}`);
    const submission = subData?.submission;
    if (!submission) notFound();

    const probData = await fetchJSON(
        `${base}/api/problems/${submission.problemId}`
    );
    const problem = probData?.problems;

    // Status color & label
    let statusColor = "bg-gray-200 text-gray-800 border border-gray-300";
    let statusLabel = submission.status.replaceAll('_', ' ');
    if (submission.status === "accepted") {
        statusColor = "bg-green-100 text-green-700 border border-green-300";
        statusLabel = "Accepted";
    } else if (submission.status === "compile_error") {
        statusColor = "bg-red-100 text-red-700 border border-red-300";
        statusLabel = "Compile Error";
    } else if (submission.status === "wrong_answer") {
        statusColor = "bg-yellow-100 text-yellow-700 border border-yellow-300";
        statusLabel = "Wrong Answer";
    } else if (submission.status === "timeout") {
        statusColor = "bg-yellow-100 text-yellow-700 border border-yellow-300";
        statusLabel = "Timeout";
    } else if (submission.status === "partial") {
        statusColor = "bg-blue-100 text-blue-700 border border-blue-300";
        statusLabel = "Partial";
    }

    // Score: accept/total nếu có
    let scoreDisplay = submission.score;
    if (
        typeof submission.acceptedTestcases === "number" &&
        typeof submission.totalTestcases === "number"
    ) {
        scoreDisplay = (
            <span>
                <span className="font-semibold text-green-700">{submission.acceptedTestcases}</span>
                <span className="text-gray-500">/</span>
                <span className="font-semibold text-gray-700">{submission.totalTestcases}</span>
            </span>
        );
    }

    const testCount = Array.isArray(problem?.testcase)
        ? problem.testcase.length
        : 0;

    return (
        <div className="max-w-3xl mx-auto p-3 sm:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-semibold">
                    Bài nộp <span className="text-blue-700">{problem.title}</span>
                </h1>
                <span className="text-xs sm:text-sm text-gray-500">
                    {new Date(submission.submittedAt).toLocaleString()} | {submission.language}
                </span>
            </div>

            {/* Actions and Status */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 relative">
                <div className="flex gap-4 text-blue-600">
                    <Link
                        href={`/submissions/${submission._id}/code`}
                        className="hover:underline"
                    >
                        Xem code
                    </Link>
                    <Link
                        href={`/problems/${problem._id}/submit`}
                        className="hover:underline"
                    >
                        Nộp lại
                    </Link>
                </div>
                <span className={`px-3 py-1 rounded font-semibold text-xs sm:text-sm inline-block ${statusColor}`}>
                    {statusLabel === "not run" ? "Running" : statusLabel}
                </span>
            </div>

            {/* Score */}
            <div className="flex flex-wrap gap-4 items-center">
                <div>
                    <span className="font-semibold">Điểm:</span>{" "}
                    <span className="text-blue-700 text-lg font-bold">{scoreDisplay}</span>
                </div>
                <div>
                    <span className="font-semibold">Điểm tối đa:</span> {problem.point}
                </div>
            </div>

            {/* Compile Error Section */}
            {submission.status === 'compile_error' && submission.msg && (
                <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
                    <h2 className="font-semibold text-red-800 mb-2">Lỗi biên dịch</h2>
                    <pre className="text-sm text-red-900 whitespace-pre-wrap">
                        {submission.msg}
                    </pre>
                </div>
            )}

            {/* Real-time Test Runner (skip if compile_error) */}
            {submission.status !== 'compile_error' && (
                <SubmissionRunClient
                    submissionId={submission._id}
                    initialTestCount={testCount}
                    BACKEND={process.env.NEXT_PUBLIC_BACKEND_URL}
                    timeLimit={problem.timeLimit}
                />
            )}
        </div>
    );
}
