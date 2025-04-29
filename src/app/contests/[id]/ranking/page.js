import ButtonTg from '@/components/ButtonTg';
import Link from 'next/link';
import React from 'react'


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
        title: `${contest.title} - Xếp hạng | OJ Platform`, // Tiêu đề với tên kỳ thi
        description: contest.description, // Mô tả kỳ thi
        openGraph: {
            title: `${contest.title} - OJ Platform`, // Tiêu đề Open Graph
            description: contest.description, // Mô tả Open Graph
            images: ['/vnojlogo.png'],
            type: 'website',
            url: process.env.BASE_URL + `/contests/${id}/ranking`,
        },
    };
}

export default async function page({ params }) {
    const { id } = await params;
    let problems = await fetchProblem(id);
    let contest = await fetchContest(id);
    // Tính tổng điểm và sắp xếp user giảm dần
    const computedUsers = (contest.user || []).map(user => ({
        ...user,
        totalScore: Array.isArray(user.score)
            ? user.score.reduce((sum, x) => sum + x, 0)
            : 0
    }));
    const userContest = computedUsers.sort((a, b) => b.totalScore - a.totalScore);

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
                        <thead className="bg-black text-white">
                            <tr>
                                <th className="w-[40px] px-2 py-3 border text-center font-semibold">#</th>
                                <th className="w-[160px] px-2 py-3 border text-left font-semibold">Tên</th>
                                <th className="w-[100px] px-2 py-3 border text-center font-semibold">Tổng điểm</th>
                                {problems.map((_, idx) => (
                                    <th key={idx} className="px-2 py-3 border text-center font-semibold">{idx + 1}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {userContest.map((user, index) => (
                                <tr
                                    key={user._id}
                                    className="odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                                >
                                    <td className="border text-center py-2">{index + 1}</td>
                                    <td className="border px-2 py-2">{user.username}</td>
                                    <td className="border text-center py-2 font-semibold">{user.totalScore}</td>
                                    {problems.map((_, pIdx) => (
                                        <td key={pIdx} className="border text-center py-2">
                                            {user.score?.[pIdx] ?? 0}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
