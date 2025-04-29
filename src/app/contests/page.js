import Link from 'next/link';
import React from 'react'
import { getAllContest } from '@/lib/contests';

// app/exam/layout.js
export const metadata = {
    title: 'Kỳ Thi | OJ Platform', // Tiêu đề cho trang kỳ thi
    description: 'Tham gia kỳ thi lập trình tại OJ Platform và kiểm tra kỹ năng lập trình của bạn.', // Mô tả cho trang kỳ thi
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
        <div className="px-7 mt-5 w-full">
            <h1 className="text-3xl font-[400px]">Các kỳ thi</h1>
            <div className="bg-gray-400 h-[1px] mt-2" />
            <div className='mt-2'>
                <div>
                    <div className='bg-[#231f20] text-white text-center rounded-tl-md rounded-tr-md'>
                        <span className='text-2xl font-[700]'>
                            Kỳ thi
                        </span>
                    </div>
                    <div className="grid gap-4">
                        {contestData.map(cont => (
                            <div
                                key={cont._id}
                                className="border border-gray-300 rounded-lg shadow-sm transition hover:shadow-md bg-white"
                            >
                                <div className="px-5 py-4">
                                    <Link href={`/contests/${cont._id}`}>
                                        <span className="font-semibold text-[#1958c1] hover:text-[#0645ad] text-xl transition-colors">
                                            {cont.title}
                                        </span>
                                    </Link>
                                    <p className="mt-2 text-gray-700 text-sm">{cont.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    )
}
