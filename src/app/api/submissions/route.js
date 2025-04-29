// File: src/app/api/submissions/route.js
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongoose';
import Submission from '@/models/Submission';
import cloudinary from '@/lib/cloudinary';

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const filter = {};
        const userId = searchParams.get('userId');
        const problemId = searchParams.get('problemId');

        if (userId) {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return NextResponse.json({ success: false, message: 'Người dùng không tồn tại' }, { status: 200 });
            }
            filter.userId = new mongoose.Types.ObjectId(userId);
        }
        if (problemId) {
            if (!mongoose.Types.ObjectId.isValid(problemId)) {
                return NextResponse.json({ success: false, message: 'Bài không tồn tại' }, { status: 200 });
            }
            filter.problemId = new mongoose.Types.ObjectId(problemId);
        }

        const submissions = await Submission.find(filter).sort({ submittedAt: -1 }).lean();
        return NextResponse.json({ success: true, submissions }, { status: 200 });
    } catch (err) {
        console.error('GET /api/submissions error:', err);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 200 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();

        // Parse JSON body containing code text and metadata
        const { code, userId, username, problemId, problemName, language } = await request.json();

        // Validate required fields
        if (!code || !userId || !username || !problemId || !problemName || !language) {
            console.log(code, userId, username, problemId, problemName, language)
            return NextResponse.json({ success: false, message: 'Thiếu thông tin' }, { status: 200 });
        }
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(problemId)) {
            return NextResponse.json({ success: false, message: 'Người dùng hoặc bài không tồn tại' }, { status: 200 });
        }

        // Convert code text to buffer and upload as raw file to Cloudinary
        const buffer = Buffer.from(code, 'utf-8');
        const publicId = `submission_${Date.now()}.txt`;
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'submissions', resource_type: 'raw', public_id: publicId },
                (error, result) => (error ? reject(error) : resolve(result))
            );
            stream.end(buffer);
        });

        const codeUrl = uploadResult.secure_url;

        // Create submission record
        const submission = await Submission.create({
            code: codeUrl,
            status: 'not_run',
            score: 0,
            userId: new mongoose.Types.ObjectId(userId),
            username,
            problemId: new mongoose.Types.ObjectId(problemId),
            problemName,
            language,
            submittedAt: new Date(),
        });

        return NextResponse.json({ success: true, submission, message: 'Tạo thành công' }, { status: 201 });
    } catch (err) {
        console.error('POST /api/submissions error:', err);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 200 });
    }
}
