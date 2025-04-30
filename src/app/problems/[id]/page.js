import { Check, ChevronRight, Clock, FileInput, Keyboard, NotebookPen, Server } from "lucide-react";
import Link from "next/link";
import DropdownItem from "../DropdownItem";
import Admin from "./Admin";

const fetchProblem = async (id) => {
    const res = await fetch(`${process.env.BASE_URL}/api/problems/${id}`);
    const data = await res.json();
    if (data.success) return data.problems;
}

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

    const infoItems = [
        { icon: <Check size={20} strokeWidth={3} />, label: 'Điểm:', value: problem.point },
        { icon: <Clock size={20} strokeWidth={3} />, label: 'Giới hạn thời gian:', value: problem.timeLimit / 1000 + " s" },
        { icon: <Server size={20} strokeWidth={3} />, label: 'Giới hạn bộ nhớ:', value: problem.memoryLimit },
        { icon: <Keyboard size={20} strokeWidth={3} />, label: 'Input:', value: 'stdin' },
        { icon: <FileInput size={20} strokeWidth={3} />, label: 'Output:', value: 'stdout' },
    ];

    return (
        <div className="px-4 py-6 max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-semibold">{problem.title}</h1>
            <div className="border-t border-gray-300 my-4" />

            <div className="flex flex-col md:flex-row gap-6">
                {/* Main Content */}
                <div className="flex-1 overflow-auto">
                    <p className="text-sm text-gray-700 mb-2">
                        Trong trường hợp đề bài hiển thị không chính xác, bạn có thể{' '}
                        <Link href={problem.content} target="_blank" className="text-blue-600 hover:underline">
                            tải đề bài tại đây
                        </Link>.
                    </p>
                    <div className="w-full">
                        <iframe
                            src={problem.content}
                            className="w-full h-64 md:h-[80vh] border"
                            title="Problem Statement"
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="w-full md:w-[200px] flex-shrink-0">
                    <Link href={`/problems/${id}/submit`}>
                        <span className="block text-center text-white bg-gradient-to-b from-[#337ab7] to-[#265a88] hover:to-[#1f4470] py-2 rounded">
                            Gửi bài giải
                        </span>
                    </Link>

                    <div className="border-t border-gray-300 my-4" />

                    <Link href={`/problems/${id}/my-submissions`} className="text-blue-600 hover:underline block">
                        Bài nộp của tôi
                    </Link>

                    <Admin id={id} />

                    <div className="border-t border-gray-300 my-4" />

                    <div className="space-y-3 text-sm text-gray-800">
                        {infoItems.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                {item.icon}
                                <span className="font-bold">{item.label}</span>
                                <span>{item.value}</span>
                            </div>
                        ))}

                        <div className="border-t border-gray-300 my-3" />

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <NotebookPen size={20} strokeWidth={3} />
                                <span className="font-medium">Nguồn bài:</span>
                                <span>----</span>
                            </div>
                            <DropdownItem label="Dạng bài">Không xác định</DropdownItem>
                            <DropdownItem label="Ngôn ngữ cho phép">C++</DropdownItem>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
