import Link from 'next/link';

import ButtonTg from '@/components/ButtonTg';

const fetchContest = async (id) => {
    const res = await fetch(`${process.env.BASE_URL}/api/contests/${id}`);
    const data = (await res.json());
    if (data.success) return data.contest
}
const fetchProblem = async (id) => {
    const res = await fetch(`${process.env.BASE_URL}/api/problems?contestId=${id}`);
    const data = (await res.json());
    if (data.success) return data.problems
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    let contest = await fetchContest(id);
    return {
        title: `${contest.title} | OJ Platform`, // Tiêu đề với tên kỳ thi
        description: contest.description, // Mô tả kỳ thi
        openGraph: {
            title: `${contest.title} - OJ Platform`, // Tiêu đề Open Graph
            description: contest.description, // Mô tả Open Graph
            images: ['/vnojlogo.png'],
            type: 'website',
            url: process.env.BASE_URL + `/contests/${id}`,
        },
    };
}

export default async function page({ params }) {
    const { id } = await params;
    let problems = await fetchProblem(id);
    let contest = await fetchContest(id);
    return (
        <div className="px-7 mt-5 w-full">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">{contest.title}</h1>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="hover:text-blue-600 cursor-pointer transition">
                        <Link href={`/contests/${id}`}>Thông tin</Link>
                    </span>
                    <span className="hover:text-blue-600 cursor-pointer transition">
                        <Link href={`/contests/${id}/ranking`}>Bảng xếp hạng</Link>
                    </span>
                    <ButtonTg className="cursor-pointer" id={id} problems={problems} />
                </div>
            </div>
            <div className="bg-gray-400 h-[1px]" />
            <div className='mt-2'>
                <div className="overflow-x-auto">
                    <table className="table-fixed w-full border border-gray-300 border-collapse text-sm">
                        {/* THead */}
                        <thead>
                            <tr className="bg-black text-white">
                                <th className="w-1/6 px-4 py-3 border text-center font-semibold rounded-tl-md">#</th>
                                <th className="w-4/6 px-4 py-3 border text-left font-semibold">Bài</th>
                                <th className="w-1/6 px-4 py-3 border text-center font-semibold rounded-tr-md">Điểm</th>
                            </tr>
                        </thead>

                        {/* TBody */}
                        <tbody>
                            {problems.map((problem, index) => (
                                <tr
                                    key={problem._id || index}
                                    className="odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                                >
                                    <td className="px-4 py-[12px] border border-gray-300 text-center">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-[12px] border border-gray-300 break-words">
                                        <Link className="text-[#1958c1] hover:underline" href={`/problems/${problem._id}`}>
                                            {problem.title}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-[12px] border border-gray-300 text-center">
                                        {problem.point}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
