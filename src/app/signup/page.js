export const metadata = {
    title: 'Đăng kí | OJ Platform', // Tiêu đề cho trang kỳ thi
};

export default function SignUpDisabledPage() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-red-600 mb-4">
                Đăng ký đã bị khóa
            </h1>
            <p className="text-gray-700 text-lg mb-6 max-w-xl">
                Hiện tại hệ thống không cho phép người dùng tự đăng ký.
                Vui lòng liên hệ với <span className="font-medium text-black">quản trị viên</span> để được hỗ trợ tạo tài khoản.
            </p>
        </div>
    );
}
