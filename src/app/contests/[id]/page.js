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
        title: `${contest.title} | OJ Platform`,
        description: contest.description,
        openGraph: {
            title: `${contest.title} - OJ Platform`,
            description: contest.description,
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
        <div className="py-8 px-2 sm:px-6 md:px-12">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-6 md:p-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-[#1958c1] mb-2">{contest.title}</h1>
                        <p className="text-gray-600 text-base md:text-lg">{contest.description}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm mt-2 md:mt-0">
                        <Link href={`/contests/${id}`}>
                            <span className="px-3 py-1 rounded-lg bg-[#e3edfa] text-[#1958c1] font-semibold hover:bg-[#d0e2fa] transition cursor-pointer">
                                Thông tin
                            </span>
                        </Link>
                        <Link href={`/contests/${id}/ranking`}>
                            <span className="px-3 py-1 rounded-lg bg-[#e3edfa] text-[#1958c1] font-semibold hover:bg-[#d0e2fa] transition cursor-pointer">
                                Bảng xếp hạng
                            </span>
                        </Link>
                        <ButtonTg className="cursor-pointer" id={id} problems={problems} />
                    </div>
                </div>
                <div className="h-[2px] bg-gradient-to-r from-[#1958c1] to-[#64b5f6] rounded-full mb-6" />
                <div className="overflow-x-auto">
                    <table className="min-w-[500px] w-full border border-gray-200 rounded-xl overflow-hidden text-sm md:text-base bg-white shadow">
                        <thead>
                            <tr className="bg-gradient-to-r from-[#1958c1] to-[#64b5f6] text-white">
                                <th className="w-1/6 px-4 py-3 border text-center font-semibold">#</th>
                                <th className="w-4/6 px-4 py-3 border text-left font-semibold">Bài</th>
                                <th className="w-1/6 px-4 py-3 border text-center font-semibold">Điểm</th>
                            </tr>
                        </thead>
                        <tbody>
                            {problems.map((problem, index) => (
                                <tr
                                    key={problem._id || index}
                                    className="odd:bg-white even:bg-[#f4f8fd] hover:bg-[#e3edfa] transition"
                                >
                                    <td className="px-4 py-3 border border-gray-200 text-center font-medium">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-3 border border-gray-200 break-words">
                                        <Link className="text-[#1958c1] hover:underline font-semibold" href={`/problems/${problem._id}`}>
                                            {problem.title}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3 border border-gray-200 text-center font-medium">
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
