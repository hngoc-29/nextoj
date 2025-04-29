'use client';
export default function ContestsTable({ contests, onEdit, onDelete }) {
    return (
        <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
                <tr>
                    <th className="border p-2">Tên kỳ thi</th>
                    <th className="border p-2">Mô tả</th>
                    <th className="border p-2">Hành động</th>
                </tr>
            </thead>
            <tbody>
                {contests.map((contest) => (
                    <tr key={contest._id} className="hover:bg-gray-50">
                        <td className="border p-2">{contest.title}</td>
                        <td className="border p-2">{contest.description}</td>
                        <td className="border p-2 space-x-2">
                            <button
                                className="text-blue-600 hover:underline cursor-pointer"
                                onClick={() => onEdit(contest)}
                            >
                                Sửa
                            </button>
                            <button
                                className="text-red-600 hover:underline cursor-pointer"
                                onClick={() => onDelete(contest._id)}
                            >
                                Xoá
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
