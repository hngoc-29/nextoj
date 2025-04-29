import { Check, ChevronRight, Clock, FileInput, Keyboard, NotebookPen, Server } from "lucide-react";
import Link from "next/link";
import DropdownItem from "../DropdownItem";
import Admin from "./Admin";

const fetchProblem = async (id) => {
    const res = await fetch(`${process.env.BASE_URL}/api/problems/${id}`);
    const data = (await res.json());
    if (data.success) return data.problems
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    let problem = await fetchProblem(id);
    return {
        title: `${problem.title} | OJ Platform`, // Tiêu đề với tên kỳ thi
        openGraph: {
            title: `${problem.title} | OJ Platform`, // Tiêu đề Open Graph
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
        {
            icon: <Check size={20} strokeWidth={3} />,
            label: 'Điểm:',
            value: problem.point,
        },
        {
            icon: <Clock size={20} strokeWidth={3} />,
            label: 'Giới hạn thời gian:',
            value: (problem.timeLimit / 1000) + " s",
        },
        {
            icon: <Server size={20} strokeWidth={3} />,
            label: 'Giới hạn bộ nhớ:',
            value: problem.memoryLimit,
        },
        {
            icon: <Keyboard size={20} strokeWidth={3} />,
            label: 'Input:',
            value: 'stdin',
        },
        {
            icon: <FileInput size={20} strokeWidth={3} />,
            label: 'Output:',
            value: 'stdout',
        },
    ];

    return (
        <div className="px-7 mt-5 w-full">
            <h1 className="text-3xl font-[500]">{problem.title}</h1>
            <div className="bg-gray-400 h-[1px] mt-2" />
            <div className="mt-5">
                <div className="flex">
                    <div className="flex-1 pr-5 overflow-auto">
                        <div>Trong trường hợp đề bài hiển thị không chính xác, bạn có thể tải đề bài tại đây:
                            <Link href={problem.content} className="text-[#1958c1] hover:text-[#0645ad]"
                            > Đề bài
                            </Link>
                            <div className="mt-3">
                                <iframe src={problem.content} className="w-full h-[100vh]" />
                            </div>
                        </div>
                    </div>
                    <div className="w-[200px]">
                        <div>
                            <Link href={`/problems/${id}/submit`}><span
                                className="text-[15px] text-white block bg-gradient-to-b from-[#337ab7] to-[#265a88] hover:bg-[#265a88] w-full py-1.5 text-center rounded-[5px]"
                            >Gửi bài giải</span></Link>
                            <div className="bg-gray-400 h-[1px] my-3" />
                            <div><Link href={`/problems/${id}/my-submissions/`} className="text-[#1958c1] hover:text-[#0645ad]">Bài nộp của tôi</Link></div>
                            <Admin id={id} />
                            <div className="bg-gray-400 h-[1px] my-3" />
                            <div className="flex flex-col gap-y-2 text-sm text-gray-800">
                                <div className="flex gap-y-2 flex-col">
                                    {infoItems.map((item, idx) => (
                                        <span key={idx} className="flex gap-x-1.5">
                                            {item.icon}
                                            <>
                                                <span className="font-bold text-[15px]">{item.label}</span>
                                                <span className="font-normal">{item.value}</span>
                                            </>
                                        </span>
                                    ))}
                                </div>

                                <div className="bg-gray-400 h-[1px] my-3" />

                                <div className="flex flex-col gap-2">
                                    <span className="flex gap-x-1.5">
                                        <NotebookPen size={20} strokeWidth={3} />
                                        <span className="font-bold text-[15px]">Nguồn bài:</span>
                                        <span className="font-normal">----</span>
                                    </span>
                                    <DropdownItem label="Dạng bài">
                                        Không xác định
                                    </DropdownItem>

                                    <DropdownItem label="Ngôn ngữ cho phép">
                                        C++
                                    </DropdownItem>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
