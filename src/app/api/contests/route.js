import dbConnect from "@/lib/mongoose";
import Contest from "@/models/Contest";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();
        const contest = await Contest.find().select("-user");
        return NextResponse.json({
            success: true,
            contest,
        }, { status: 200 });
    } catch (err) {
        console.log(err)
        return NextResponse.json({
            success: false,
            message: err
        }, { status: 200 });
    }
}

export async function POST(req) {
    const { title, description } = await req.json();
    try {
        await dbConnect();
        const data = { title };
        if (description) {
            data.description = description;
        }
        const contest = new Contest(data);
        await contest.save();
        return NextResponse.json({
            success: true,
            contest,
            message: "Tạo kì thi thành công"
        }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({
            success: false,
            message: err
        }, { status: 200 });
    }
}
