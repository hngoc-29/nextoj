import { Check, ChevronRight, Clock, FileInput, Keyboard, NotebookPen, Server } from "lucide-react";
import Link from "next/link";
import DropdownItem from "../DropdownItem";
import Admin from "./Admin";
import { notFound } from "next/navigation";

const fetchProblem = async (id) => {
    const res = await fetch(`${process.env.BASE_URL}/api/problems/${id}`);
    const data = await res.json();
    if (data.success) return data.problems;
};

export async function generateMetadata({ params }) {
    const { id } = await params;
    let problem = await fetchProblem(id);
    return {
        title: `${problem.title} | OJ Platform`,
        openGraph: {
            title: `${problem.title} | OJ Platform`,
            description: 'Cùng nhau luyện tập lập trình tại OJ Platform.',
            images: ['/vnojlogo.png'],
            type: 'website',
            url: process.env.BASE_URL + `/problems/${id}`,
        },
    };
}

export default async function ProblemPage({ params }) {
    const { id } = await params;
    let problem = await fetchProblem(id);
    if (!problem) {
        notFound();
    }

    const infoItems = [
        { icon: <Check size={20} strokeWidth={3} />, label: 'Điểm', value: problem.point },
        { icon: <Clock size={20} strokeWidth={3} />, label: 'Giới hạn thời gian', value: problem.timeLimit / 1000 + " s" },
        { icon: <Server size={20} strokeWidth={3} />, label: 'Giới hạn bộ nhớ', value: problem.memoryLimit },
        { icon: <Keyboard size={20} strokeWidth={3} />, label: 'Input', value: 'stdin' },
        { icon: <FileInput size={20} strokeWidth={3} />, label: 'Output', value: 'stdout' },
    ];

    return (
        <div className="px-2 py-4 md:px-6 lg:px-0 max-w-7xl mx-auto">
            <div className="flex flex-col gap-6 md:flex-row md:gap-8">
                {/* Main Content */}
                <div className="flex-1 bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-100">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#1958c1] mb-2">{problem.title}</h1>
                    <div className="h-1 w-16 bg-gradient-to-r from-[#337ab7] to-[#265a88] rounded mb-4" />

                    <p className="text-sm text-gray-700 mb-3">
                        Nếu đề bài hiển thị không chính xác, bạn có thể{' '}
                        <Link href={problem.content} target="_blank" className="text-blue-600 hover:underline font-medium">
                            tải đề bài tại đây
                        </Link>.
                    </p>
                    <div className="w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm mb-4">
                        <iframe
                            src={problem.content}
                            className="w-full h-64 md:h-[100vh] bg-gray-50"
                            title="Problem Statement"
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="w-full md:w-[320px] flex-shrink-0">
                    <div className="sticky top-4 space-y-6">
                        <Link href={`/problems/${id}/submit`}>
                            <span className="block text-center text-white font-semibold bg-gradient-to-b from-[#337ab7] to-[#265a88] hover:to-[#1f4470] py-3 rounded-lg shadow transition">
                                🚀 Gửi bài giải
                            </span>
                        </Link>

                        <Link href={`/problems/${id}/my-submissions`} className="block text-center text-[#1958c1] hover:underline font-medium">
                            📄 Bài nộp của tôi
                        </Link>

                        <Admin id={id} />

                        <div className="bg-white rounded-xl shadow border border-gray-100 p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                {infoItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded px-2 py-1">
                                        <span className="text-[#265a88]">{item.icon}</span>
                                        <span className="font-semibold text-gray-700">{item.label}:</span>
                                        <span className="ml-auto text-gray-900">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 my-2" />
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <NotebookPen size={20} strokeWidth={3} className="text-[#265a88]" />
                                    <span className="font-medium">Nguồn bài:</span>
                                    <span className="ml-auto text-gray-600">----</span>
                                </div>
                                <DropdownItem label="Dạng bài">Không xác định</DropdownItem>
                                <DropdownItem label="Ngôn ngữ cho phép">C++</DropdownItem>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
