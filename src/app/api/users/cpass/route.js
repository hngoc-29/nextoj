import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import dbConnect from '@/lib/mongoose'; // Đường dẫn này tùy cấu trúc dự án của bạn
import User from '@/models/User'; // Đường dẫn này tùy cấu trúc dự án của bạn

export async function POST(request) {
    const { userId, oldPassword, newPassword } = await request.json();

    if (!userId || !oldPassword || !newPassword) {
        return NextResponse.json({ message: 'Thiếu thông tin' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
        return NextResponse.json({ message: 'Không tìm thấy người dùng' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        return NextResponse.json({ message: 'Mật khẩu hiện tại không đúng' }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: 'Đổi mật khẩu thành công' });
}