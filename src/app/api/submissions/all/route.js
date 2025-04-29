// File: src/app/api/submissions/route.js
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongoose';
import Submission from '@/models/Submission';

export async function GET(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const skip = (page - 1) * limit;

        // Lọc tùy chọn
        const filter = {};
        const userId = searchParams.get('userId');
        const problemId = searchParams.get('problemId');
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            filter.userId = new mongoose.Types.ObjectId(userId);
        }
        if (problemId && mongoose.Types.ObjectId.isValid(problemId)) {
            filter.problemId = new mongoose.Types.ObjectId(problemId);
        }

        // Tổng số bản ghi
        const totalCount = await Submission.countDocuments(filter);

        // Lấy dữ liệu phân trang
        const submissions = await Submission.find(filter)
            .sort({ submittedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const totalPages = Math.ceil(totalCount / limit) || 1;

        return NextResponse.json(
            {
                success: true,
                submissions,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCount
                }
            },
            { status: 200 }
        );
    } catch (err) {
        console.error('Lỗi khi lấy submissions:', err);
        return NextResponse.json(
            { success: false, message: 'Lỗi máy chủ: ' + err.message },
            { status: 500 }
        );
    }
}
