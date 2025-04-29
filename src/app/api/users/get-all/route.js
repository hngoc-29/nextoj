import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();
        const users = await User.find({}).select(`-password -contestJoin`);
        return NextResponse.json({
            success: true,
            users
        }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Lấy thông tin người dùng thất bại"
        }, { status: 200 })
    }
}