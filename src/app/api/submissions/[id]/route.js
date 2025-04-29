import dbConnect from "@/lib/mongoose";
import Submission from "@/models/Submission";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    await dbConnect();
    const { id } = await params;
    try {
        const submission = await Submission.findById(id);
        if (!submission) return NextResponse.json({
            success: false,
            message: `Không tìm thấy bài nộp`
        }, { status: 200 });
        return NextResponse.json({
            success: true, submission
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 200 });
    }
}