import Link from 'next/link';

export const metadata = {
    title: 'Bài tập | OJ Platform',
    description: 'Tham gia kỳ thi lập trình tại OJ Platform và kiểm tra kỹ năng lập trình của bạn.',
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
        <div className="px-2 sm:px-6 md:px-12 py-8 w-full min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef]">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-[#1958c1] mb-2 text-center">Danh sách bài</h1>
                <div className="mx-auto w-24 h-1 bg-gradient-to-r from-[#1958c1] to-[#64b5f6] rounded-full mb-8" />
                <div className="overflow-x-auto rounded-2xl shadow-lg bg-white">
                    <table className="min-w-[500px] w-full border border-gray-200 text-sm md:text-base rounded-2xl overflow-hidden">
                        <thead>
                            <tr className="bg-gradient-to-r from-[#1958c1] to-[#64b5f6] text-white">
                                <th className="w-1/6 px-4 py-3 border text-center font-semibold rounded-tl-2xl">#</th>
                                <th className="w-4/6 px-4 py-3 border text-left font-semibold">Bài</th>
                                <th className="w-1/6 px-4 py-3 border text-center font-semibold rounded-tr-2xl">Điểm</th>
                            </tr>
                        </thead>
                        <tbody>
                            {problems.map((problem, index) => (
                                <tr
                                    key={problem._id || index}
                                    className="odd:bg-white even:bg-[#f4f8fd] hover:bg-[#e3edfa] transition"
                                >
                                    <td className="px-4 py-3 border border-gray-200 text-center font-medium">
                                        {limit * (page - 1) + index + 1}
                                    </td>
                                    <td className="px-4 py-3 border border-gray-200 break-words">
                                        <Link
                                            href={`/problems/${problem._id}`}
                                            className="text-[#1958c1] hover:underline font-semibold"
                                        >
                                            {problem.title}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3 border border-gray-200 text-center font-bold">
                                        {problem.point || 5}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
                    <Link
                        href={`?page=${page - 1}&limit=${limit}`}
                        className={`px-5 py-2 rounded-lg font-semibold bg-[#e3edfa] text-[#1958c1] shadow hover:bg-[#d0e2fa] transition ${page <= 1 ? 'opacity-50 pointer-events-none' : ''
                            }`}
                    >
                        ← Trước
                    </Link>
                    <span className="text-base text-gray-700">
                        Trang <span className="font-bold">{pagination.currentPage}</span> / {pagination.totalPages}
                    </span>
                    <Link
                        href={`?page=${page + 1}&limit=${limit}`}
                        className={`px-5 py-2 rounded-lg font-semibold bg-[#e3edfa] text-[#1958c1] shadow hover:bg-[#d0e2fa] transition ${page >= pagination.totalPages ? 'opacity-50 pointer-events-none' : ''
                            }`}
                    >
                        Sau →
                    </Link>
                </div>
            </div>
        </div>
    );
}
