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
        title: `${contest.title} - Xếp hạng | OJ Platform`,
        description: contest.description,
        openGraph: {
            title: `${contest.title} - OJ Platform`,
            description: contest.description,
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
        <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] py-8 px-2 sm:px-6 md:px-12">
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-6 md:p-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-[#1958c1] mb-2">{contest.title}</h1>
                        <p className="text-gray-600 text-base md:text-lg">Bảng xếp hạng kỳ thi</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm mt-2 md:mt-0">
                        <Link href={`/contests/${id}`}>
                            <span className="px-3 py-1 rounded-lg bg-[#e3edfa] text-[#1958c1] font-semibold hover:bg-[#d0e2fa] transition cursor-pointer">
                                Thông tin
                            </span>
                        </Link>
                        <Link href={`/contests/${id}/ranking`}>
                            <span className="px-3 py-1 rounded-lg bg-[#1958c1] text-white font-semibold shadow hover:bg-[#0d47a1] transition cursor-pointer">
                                Bảng xếp hạng
                            </span>
                        </Link>
                        <ButtonTg className="cursor-pointer" id={id} problems={problems} />
                    </div>
                </div>
                <div className="h-[2px] bg-gradient-to-r from-[#1958c1] to-[#64b5f6] rounded-full mb-6" />
                <div className="overflow-x-auto">
                    <table className="min-w-[600px] w-full border border-gray-200 rounded-xl overflow-hidden text-sm md:text-base bg-white shadow">
                        <thead>
                            <tr className="bg-gradient-to-r from-[#1958c1] to-[#64b5f6] text-white">
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
                                    className="odd:bg-white even:bg-[#f4f8fd] hover:bg-[#e3edfa] transition"
                                >
                                    <td className="border text-center py-2 font-semibold">{index + 1}</td>
                                    <td className="border px-2 py-2 font-medium">{user.username}</td>
                                    <td className="border text-center py-2 font-bold text-[#1958c1]">{user.totalScore}</td>
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
