import dbConnect from '@/lib/mongoose';
import Contest from '@/models/Contest';
import Problem from '@/models/Problem';
import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        const { problemId } = await req.json();

        if (!problemId) {
            return NextResponse.json({ success: false, message: "Thiếu problemId" }, { status: 400 });
        }

        // Xóa problemId khỏi contest
        await Contest.findByIdAndUpdate(
            id,
            { $pull: { problems: problemId } }
        );

        // Xóa contestId khỏi problem
        await Problem.findByIdAndUpdate(
            problemId,
            { $pull: { contestId: id } }
        );

        return NextResponse.json({
            success: true,
            message: "Đã xóa problem khỏi contest"
        }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}