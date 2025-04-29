import Link from 'next/link';

export const metadata = {
    title: 'Bài tập | OJ Platform', // Tiêu đề cho trang kỳ thi
    description: 'Tham gia kỳ thi lập trình tại OJ Platform và kiểm tra kỹ năng lập trình của bạn.', // Mô tả cho trang kỳ thi
    openGraph: {
        title: 'Bài tập | OJ Platform',
        description: 'Cùng nhau luyện tập lập trình tại OJ Platform.',
        images: ['/vnojlogo.png'],
        type: 'website',
        url: process.env.BASE_URL + `/problems`,
    },
};

export default async function ProblemListPage({ searchParams }) {
    const page = parseInt((await searchParams).page || '1', 10);
    const limit = parseInt((await searchParams).limit || '10', 10);
    const res = await fetch(
        `${process.env.BASE_URL}/api/problems?page=${page}&limit=${limit}`,
        { cache: 'no-store' }
    );
    const { success, problems, pagination } = await res.json();

    if (!success) {
        return <div className="px-7 mt-5 w-full">Lỗi khi tải danh sách bài.</div>;
    }

    return (
        <div className="px-7 mt-5 w-full">
            <h1 className="text-3xl font-semibold">Danh sách bài</h1>
            <div className="bg-gray-400 h-[1px] mt-2" />
            <div className="mt-7 overflow-x-auto">
                <table className="table-fixed w-full border border-collapse text-sm">
                    {/* THead */}
                    <thead>
                        <tr className="bg-black text-white">
                            <th className="w-1/6 px-4 py-3 border text-center font-semibold rounded-tl-md">#</th>
                            <th className="w-4/6 px-4 py-3 border text-left font-semibold">Bài</th>
                            <th className="w-1/6 px-4 py-3 border text-center font-semibold rounded-tr-md">Điểm</th>
                        </tr>
                    </thead>

                    {/* TBody với zebra striping */}
                    <tbody>
                        {problems.map((problem, index) => (
                            <tr
                                key={problem._id || index}
                                className="odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                            >
                                <td className="px-4 py-[12px] border border-gray-300 text-center">
                                    {limit * (page - 1) + index + 1}
                                </td>
                                <td className="px-4 py-[12px] border border-gray-300 break-words">
                                    <Link
                                        href={`/problems/${problem._id}`}
                                        className="text-[#1958c1] hover:underline"
                                    >
                                        {problem.title}
                                    </Link>
                                </td>
                                <td className="px-4 py-[12px] border border-gray-300 text-center">
                                    {problem.point || 5}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Pagination Controls */}
                <div className="flex items-center justify-between mt-4">
                    <Link
                        href={`?page=${page - 1}&limit=${limit}`}
                        className={`px-3 py-1 bg-gray-200 rounded ${page <= 1 ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        Trước
                    </Link>

                    <span className="text-sm">
                        Trang {pagination.currentPage} / {pagination.totalPages}
                    </span>

                    <Link
                        href={`?page=${page + 1}&limit=${limit}`}
                        className={`px-3 py-1 bg-gray-200 rounded ${page >= pagination.totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        Sau
                    </Link>
                </div>
            </div>
        </div>
    );
}
