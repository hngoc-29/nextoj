'use client';

export default function Error({ error, reset }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text-6xl font-bold text-red-600 mb-4">500</h1>
            <h2 className="text-2xl font-semibold mb-2">Lỗi máy chủ nội bộ</h2>
            <p className="text-gray-700 mb-6">
                Đã có lỗi xảy ra trên máy chủ. Vui lòng thử lại sau hoặc liên hệ quản trị viên.
            </p>
            <button
                onClick={() => reset()}
                className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 transition"
            >
                Thử lại
            </button>
        </div>
    );
}