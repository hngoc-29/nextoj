// File: src/components/CheckUserServer.jsx
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import jwt from 'jsonwebtoken';

export default async function CheckUserServer({ children, requireAdmin = false }) {
    // Lấy token trực tiếp từ cookie (chạy server)
    const token = (await cookies()).get('token')?.value;

    if (!token) {
        // Nếu không login → render not-found.js mà không redirect
        notFound();
    }

    let payload;
    try {
        payload = jwt.verify(token, process.env.SECRET_USER);
    } catch {
        // Token hết hạn/không hợp lệ
        notFound();
    }

    // Nếu bắt buộc admin mà không phải admin
    if (requireAdmin && !payload.isAdmin) {
        notFound();
    }

    // Mọi thứ OK → render nội dung con
    return children;
}
