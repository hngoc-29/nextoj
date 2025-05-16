import dbConnect from '@/lib/mongoose';
import Contest from '@/models/Contest';
import Problem from '@/models/Problem';
import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
    try {
        await dbConnect();
        const { id } = params;
        const { problemIds } = await req.json();

        if (!Array.isArray(problemIds) || problemIds.length === 0) {
            return NextResponse.json({ success: false, message: "Thiếu id bài" }, { status: 400 });
        }

        // Lấy contest hiện tại để kiểm tra problems đã có
        const contest = await Contest.findById(id).select('problems');
        if (!contest) {
            return NextResponse.json({ success: false, message: "Kì thi không tồn tại" }, { status: 404 });
        }

        // Lọc ra những problemId chưa có trong contest
        const existingIds = contest.problems.map(pid => pid.toString());
        const newIds = problemIds.filter(pid => !existingIds.includes(pid));

        if (newIds.length === 0) {
            return NextResponse.json({ success: false, message: "Tất cả bài đã có trong contest" }, { status: 200 });
        }

        // Kiểm tra problemId nào thực sự tồn tại
        const validProblems = await Problem.find({ _id: { $in: newIds } }).select('_id');
        const validIds = validProblems.map(p => p._id.toString());

        if (validIds.length === 0) {
            return NextResponse.json({ success: false, message: "Không có bài nào hợp lệ" }, { status: 200 });
        }

        await Contest.findByIdAndUpdate(
            id,
            { $addToSet: { problems: { $each: validIds } } }
        );

        // Cập nhật trường contestId trong các problem vừa thêm
        await Problem.updateMany(
            { _id: { $in: validIds } },
            { $addToSet: { contestId: id } }
        );

        return NextResponse.json({
            success: true,
            message: `Đã thêm ${validIds.length} problem(s) mới vào contest`,
            addedIds: validIds
        }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}