import { cookies } from "next/headers";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function verifyToken() {
    // Lấy token từ cookie
    const token = (await cookies()).get("token")?.value;

    if (!token) return { valid: false, reason: "Không có token." };

    await dbConnect();

    const user = await User.findOne({ "tokens.token": token });
    if (!user) return { valid: false, reason: "Token không hợp lệ." };

    const now = new Date();

    // Tìm token còn hạn
    const validToken = user.tokens.find(
        (t) => t.token === token && (!t.expiresAt || t.expiresAt > now)
    );

    if (!validToken) {
        // Token đã hết hạn → xoá khỏi DB
        user.tokens = user.tokens.filter((t) => t.token !== token);
        await user.save();

        return { valid: false, reason: "Token đã hết hạn." };
    }

    // Token còn hạn → trả lại thông tin user
    return { valid: true, user };
}

export async function verifyAdmin() {
    const { valid, user, reason } = await verifyToken();
    if (!valid) return { valid: false, reason };

    // Kiểm tra xem user có phải là admin không
    if (!user.isAdmin) {
        return { valid: false, reason: "Bạn không có quyền truy cập." };
    }

    return { valid: true, user };
}
