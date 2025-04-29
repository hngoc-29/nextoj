// app/api/users/route.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function GET(req) {
    await dbConnect();

    const token = req.headers.get('cookie')?.split('; ').find(cookie => cookie.startsWith('token='))?.split('=')[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_USER);
        const id = decoded.id;

        const user = await User.findById(id).select('-password'); // Loại bỏ password khỏi kết quả
        if (!user) {
            return new Response(JSON.stringify({
                message: 'Người dùng không tồn tại',
                success: false,
            }), { status: 200 });
        }

        return new Response(JSON.stringify({
            user,
            success: true
        }), { status: 200 });
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({
            message: 'Token không hợp lệ hoặc hết hạn',
            success: false,
        }), { status: 200 });
    }
}

export async function POST(req) {
    const { username, password, isAdmin } = await req.json();
    await dbConnect();
    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(password, salt);
    try {
        const userTest = await User.findOne({
            username
        });
        if (userTest && userTest._id) {
            return new Response(JSON.stringify({
                message: 'Tên người dùng đã tồn tại',
                success: false,
            }), { status: 200 });
        }
        const user = new User({
            username, password: hashpass, isAdmin, tokens: {
                token: "test",
            }
        });
        await user.save();
        const { password, contestJoin, ...userinfo } = user._doc;
        return new Response(JSON.stringify({
            success: true,
            user: userinfo
        }), { status: 200 });
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({
            message: error.message,
            success: false,
        }), { status: 400 });
    }
}

export async function PUT(req) {
    const { username, isAdmin } = await req.json(); // Use `await req.json()` to parse the request body
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
        return new Response(JSON.stringify({
            message: 'Người dùng không hợp lệ',
            success: false,
        }), { status: 200 });
    }
    await dbConnect();
    try {
        const user = await User.findByIdAndUpdate(id, {
            username,
            isAdmin
        }, {
            new: true
        }).select(`-password`);

        if (!user) {
            return new Response(JSON.stringify({
                message: 'Người dùng không tồn tại',
                success: false,
            }), { status: 200 });
        }

        return new Response(JSON.stringify({
            message: 'Cập nhật người dùng thành công',
            success: true,
            user
        }), { status: 200 });
    } catch (err) {
        console.log(err.message);
        return new Response(JSON.stringify({
            message: err.message,
            success: false,
        }), { status: 400 });
    }
}

export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
        return new Response(JSON.stringify({
            message: 'Người dùng không hợp lệ',
            success: false,
        }), { status: 200 });
    }
    await dbConnect();
    try {
        console.log(id)
        const user = await User.findById(id);
        if (!user || !user._id) {
            return new Response(JSON.stringify({
                message: 'Người dùng không tồn tại',
                success: false,
            }), { status: 200 });
        }
        await User.findByIdAndDelete(id);
        console.log(user)
        return new Response(JSON.stringify({
            message: 'Xóa người dùng thành công',
            success: true,
        }), { status: 200 });
    } catch (err) {
        console.log(err.message);
        return new Response(JSON.stringify({
            message: err.message,
            success: false,
        }), { status: 400 });
    }
}