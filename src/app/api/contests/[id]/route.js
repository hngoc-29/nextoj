import dbConnect from "@/lib/mongoose";
import Contest from "@/models/Contest";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    const { title, description } = await req.json();
    try {
        await dbConnect();
        const { id } = await params;
        const data = {
            title,
        };
        if (description) {
            data.description = description;
        }

        // Sử dụng id để cập nhật contest
        const contest = await Contest.findByIdAndUpdate(id, data, { new: true }).select("-user");

        if (!contest) throw new Error("Kì thi không tồn tại")

        return NextResponse.json({
            success: true,
            message: "Cập nhật kì thi thành công",
            contest
        }, { status: 200 });
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: err.message
        }, { status: 200 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        const contest = await Contest.findByIdAndDelete(id);

        if (!contest) throw new Error("Kì thi không tồn tại")

        return NextResponse.json({
            success: true,
            message: "Xóa kì thi thành công",
        }, { status: 200 });
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: err.message
        }, { status: 200 });
    }
}

export async function GET(req, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const getUser = searchParams.get('getUser');

        let contest = [];

        if (getUser) {
            const data = await Contest.findById(id);
            contest = data.user;
        } else {
            contest = await Contest.findById(id);
        }

        if (!contest) throw new Error("Kì thi không tồn tại")

        return NextResponse.json({
            success: true,
            contest
        }, { status: 200 });
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: err.message
        }, { status: 200 });
    }
}

export async function POST(req, { params }) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const isJoin = searchParams.get("isJoin");
        const { id } = await params;

        const { userId, username } = await req.json();

        const contest = await Contest.findById(id);
        if (!contest) {
            return NextResponse.json({
                success: false,
                message: `Không tìm thấy kì thi`
            }, { status: 200 });
        }

        let user = null;
        if (isJoin) {
            const exists = contest.user.find(u => u._id === userId);
            if (!exists) {
                contest.user.push({
                    _id: userId,
                    username,
                    score: 0, // mỗi contest có score riêng
                });
            }
            const data = await User.findByIdAndUpdate(userId, {
                contestJoin: id
            }, {
                new: true,
            });
            const { password, ...ot } = data._doc;
            user = ot;
        }

        await contest.save();
        return NextResponse.json({
            success: true,
            user: user && user,
            message: `Tham gia thành công`
        }, { status: 200 });
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: err
        }, { status: 200 });
    }
}
