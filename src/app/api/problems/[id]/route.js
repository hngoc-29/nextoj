import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongoose';
import cloudinary from '@/lib/cloudinary';
import Problem from '@/models/Problem';
import Contest from '@/models/Contest';

export async function GET(req, { params }) {
    try {
        await dbConnect();

        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const getSubmission = searchParams.get('getSub');

        let problems = {};

        if (getSubmission) {
            const data = await Problem.findById(id);
            problems = data.submissions;
        } else {
            problems = await Problem.findById(id).select('-submissions -testcase');
        }

        return NextResponse.json({
            success: true,
            problems
        }, { status: 200 });

    } catch (err) {
        console.error(err);
        return NextResponse.json({
            success: false,
            message: err.message
        }, { status: 200 });
    }
}

const removeFile = async (id) => {
    try {
        const problem = await Problem.findById(id);
        if (!problem || !problem.content) {
            throw new Error('Problem not found or no file URL.');
        }

        const url = problem.content;

        // Giữ nguyên .pdf trong public_id
        const matches = url.match(/\/upload\/(?:v\d+\/)?(.+\.(pdf|zip|txt|docx|csv))/);
        if (!matches || matches.length < 2) {
            throw new Error('Could not extract public_id from URL.');
        }

        const publicId = matches[1]; // ví dụ: problems/problem_xxx.pdf

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: 'raw', // hoặc 'auto' nếu cần
        });

        console.log('Cloudinary delete result:', result);
        return result;
    } catch (error) {
        console.error('Error removing file from Cloudinary:', error);
        throw error;
    }
};



// PUT: Cập nhật problem, content có thể bỏ qua nếu không re-upload file
export async function PUT(request, { params }) {
    try {
        await dbConnect();

        const { id } = await params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "Problem id không hợp lệ" },
                { status: 200 }
            );
        }

        const formData = await request.formData();
        // 1) Các field để $set vào Problem
        const setFields = {};
        if (formData.get("title")) {
            setFields.title = formData.get("title").toString();
        }
        if (formData.get("content") instanceof File) {
            // nếu có file mới, upload và set URL
            await removeFile(id);
            const buf = Buffer.from(await formData.get("content").arrayBuffer());
            const publicId = `problem_${Date.now()}_${formData.get("content").name}`;
            const uploadResult = await new Promise((res, rej) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: "raw", folder: "problems", public_id: publicId },
                    (err, result) => (err ? rej(err) : res(result))
                );
                stream.end(buf);
            });
            setFields.content = uploadResult.secure_url;
        }
        if (formData.get("timeLimit")) {
            setFields.timeLimit = Number(formData.get("timeLimit"));
        }
        if (formData.get("memoryLimit")) {
            setFields.memoryLimit = Number(formData.get("memoryLimit"));
        }
        if (formData.get("point")) {
            setFields.point = Number(formData.get("point"));
        }
        if (formData.get("submissions")) {
            setFields.submissions = JSON.parse(formData.get("submissions").toString());
        }

        // 2) Parse contestId(s) ra array of ObjectId strings
        let contestIds = [];
        const raw = formData.get("contestId")?.toString();
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    contestIds = parsed;
                } else if (typeof parsed === "string") {
                    contestIds = [parsed];
                }
            } catch {
                // nếu không phải JSON array, coi raw là single ID
                contestIds = [raw];
            }
            // filter chỉ lấy các ID hợp lệ
            contestIds = contestIds.filter(cid => mongoose.Types.ObjectId.isValid(cid));
        }

        // 3) Build update operation
        const updateOp = { $set: { ...setFields, contestId: contestIds } };

        // 4) Update Problem
        const updatedProblem = await Problem.findByIdAndUpdate(
            id,
            updateOp,
            { new: true, runValidators: true }
        );
        if (!updatedProblem) {
            return NextResponse.json(
                { success: false, message: "Problem không tồn tại" },
                { status: 200 }
            );
        }

        // 5) Với mỗi contestId, thêm problem vào Contest.problems
        for (const cId of contestIds) {
            await Contest.findByIdAndUpdate(
                cId,
                { $addToSet: { problems: updatedProblem._id } }
            );
        }

        // 6) Trả về kết quả (với Problem đã có contestId array)
        return NextResponse.json(
            {
                success: true,
                message: "Cập nhật problem & liên kết contest thành công",
                problem: updatedProblem
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("PUT /api/problems/[id] error:", err);
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 200 }
        );
    }
}

export async function DELETE(req, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        await removeFile(id);

        const problem = await Problem.findByIdAndDelete(id);

        if (!problem) throw new Error("Bài không tồn tại")

        return NextResponse.json({
            success: true,
            message: "Xóa bài thành công",
        }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({
            success: false,
            message: err.message
        }, { status: 200 });
    }
}