// app/api/users/login/route.js
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req) {
    const { username, password } = await req.json();
    await dbConnect();

    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return new Response(
                JSON.stringify({ success: false, message: "Tên người dùng hoặc mật khẩu sai." }),
                { status: 200 }
            );
        }

        const payload = {
            id: user._id,
            isAdmin: user.isAdmin,
        };

        const token = jwt.sign(payload, process.env.SECRET_USER, {
            expiresIn: "7d",
        });

        cookies().set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 60 * 60 * 24 * 7, // 7 ngày
        });

        return new Response(
            JSON.stringify({
                success: true,
                message: "Đăng nhập thành công",
                user: {
                    _id: user._id,
                    username: user.username,
                    isAdmin: user.isAdmin,
                },
            }),
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return new Response(
            JSON.stringify({ success: false, message: "Lỗi máy chủ." }),
            { status: 500 }
        );
    }
}
