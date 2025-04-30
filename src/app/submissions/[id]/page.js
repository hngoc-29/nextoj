// File: src/app/submissions/[id]/page.js
import Link from 'next/link';
import SubmissionRunClient from './SubmissionRunClient';

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
    if (!submission) return <p>Submission not found</p>;

    const probData = await fetchJSON(
        `${base}/api/problems/${submission.problemId}`
    );
    const problem = probData?.problems;

    // Determine status class

    if (submission.status === `not_run`) submission.status = `pendding`
    const statusClass =
        submission.status === 'pendding'
            ? 'border-yellow-500'
            : submission.status === 'accepted'
                ? 'text-green-600'
                : 'text-red-600';

    // Replace underscore in status for display
    const displayStatus = submission.status.replaceAll('_', ' ');

    const testCount = Array.isArray(problem?.testcase)
        ? problem.testcase.length
        : 0;

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">
                    Bài nộp {problem.title}
                </h1>
                <span className="text-sm text-gray-500">
                    {new Date(submission.submittedAt).toLocaleString()} | {submission.language}
                </span>
            </div>

            {/* Actions and Status */}
            <div className="flex space-x-4 text-blue-600 relative">
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
                <span className={`absolute right-0 ${statusClass}`}>
                    {displayStatus}
                </span>
            </div>

            {/* Compile Error Section */}
            {submission.status === 'compile_error' && submission.msg && (
                <div className="bg-red-100 border-l-4 border-red-500 p-4">
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
                />
            )}

            {/* Footer */}
            <div className="flex justify-between text-gray-700">
                <div>Điểm tối đa: {problem.point}</div>
            </div>
        </div>
    );
}
