import TestcaseList from './TestcaseList';
import UploadForm from './UploadForm';
import CheckUserServer from '@/components/CheckUser';

export const metadata = {
    title: 'Quản lí testcase | OJ Platform', // Tiêu đề cho trang kỳ thi
    description: 'Tham gia kỳ thi lập trình tại OJ Platform và kiểm tra kỹ năng lập trình của bạn.', // Mô tả cho trang kỳ thi
};

export default async function TestcasePage({ params }) {
    const { id } = await params;
    const data = await (await fetch(`${process.env.BASE_URL}/api/problems/${id}/testcase`)).json();
    const problem = data.problem;
    const testcases = problem?.testcase || [];

    return (
        <CheckUserServer>
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-semibold mb-4 text-gray-800">
                    🧪 Testcases for <span className="text-blue-600">"{problem?.title}"</span>
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <UploadForm problemId={id} />
                    <TestcaseList testcases={JSON.parse(JSON.stringify(testcases))} problemId={id} />
                </div>
            </div>
        </CheckUserServer>
    );
}
