import React from 'react'
import Code from './Code';

export const metadata = {
    title: 'Xem code | OJ Platform', // Tiêu đề cho trang kỳ thi
};

export default async function page({ params }) {
    const { id } = await params;
    return (
        <div>
            <Code id={id} />
        </div>
    )
}
