import React from 'react'
import Submissions from './Submissions'

export const metadata = {
    title: 'Danh sách bài nộp | OJ Platform', // Tiêu đề cho trang kỳ thi
    description: 'Tham gia kỳ thi lập trình tại OJ Platform và kiểm tra kỹ năng lập trình của bạn.', // Mô tả cho trang kỳ thi
    openGraph: {
        title: 'Danh sách bài nộp | OJ Platform',
        description: 'Cùng nhau luyện tập lập trình tại OJ Platform.',
        images: ['/vnojlogo.png'],
        type: 'website',
        url: process.env.BASE_URL + `/submissions`,
    },
};

export default function page() {
    return (
        <div>
            <Submissions />
        </div>
    )
}
