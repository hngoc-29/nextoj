import Link from 'next/link';
import React from 'react'
import { getAllContest } from '@/lib/contests';

export const metadata = {
    title: 'Kỳ Thi | OJ Platform',
    description: 'Tham gia kỳ thi lập trình tại OJ Platform và kiểm tra kỹ năng lập trình của bạn.',
    openGraph: {
        title: 'Kỳ Thi | OJ Platform',
        description: 'Cùng nhau luyện tập lập trình tại OJ Platform.',
        images: ['/vnojlogo.png'],
        type: 'website',
        url: process.env.BASE_URL + `/contests`,
    },
};

export default async function page() {
    const data = await getAllContest();
    if (!data.success) {
        return {
            notFound: true,
        }
    }

    const contestData = data.contest;

    return (
        <div className="px-4 sm:px-8 md:px-16 lg:px-32 xl:px-64 py-8">
            <div className="mb-8 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-[#1958c1] drop-shadow-sm">Các kỳ thi</h1>
                <p className="mt-2 text-gray-600 text-base md:text-lg">Khám phá và tham gia các kỳ thi lập trình hấp dẫn!</p>
                <div className="mx-auto mt-4 w-24 h-1 bg-gradient-to-r from-[#1958c1] to-[#64b5f6] rounded-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {contestData.map(cont => (
                    <div
                        key={cont._id}
                        className="group border border-gray-200 rounded-2xl shadow-md bg-white hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
                    >
                        <div className="p-6 flex-1 flex flex-col">
                            <Link href={`/contests/${cont._id}`}>
                                <span className="font-bold text-2xl text-[#1958c1] group-hover:text-[#0d47a1] transition-colors cursor-pointer">
                                    {cont.title}
                                </span>
                            </Link>
                            <p className="mt-3 text-gray-700 text-base flex-1">{cont.description}</p>
                        </div>
                        <div className="px-6 pb-6 flex items-center justify-between">
                            <Link
                                href={`/contests/${cont._id}`}
                                className="inline-block bg-[#1958c1] text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-[#0d47a1] transition-colors text-sm"
                            >
                                Tham gia ngay
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
