// File: src/app/api/problems/[id]/testcase/route.js
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Problem from '@/models/Problem';
import cloudinary from '@/lib/cloudinary';

function uploadBuffer(buffer, folder, publicId) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: 'raw', public_id: publicId },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(buffer);
    });
}

// utils/cloudinaryHelpers.js
export const removeCloudinaryFile = async (url) => {
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+\.(pdf|zip|txt|docx|csv))/);
    if (!matches || matches.length < 2) {
        throw new Error('Không trích xuất được public_id từ URL.');
    }

    const publicId = matches[1]; // ví dụ: testcase/input_123456.in
    console.log(publicId)
    const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'raw'
    });
    console.log(result)
    return result;
};

export async function GET(req, { params }) {
    try {
        // Kết nối với MongoDB
        await dbConnect();

        // Lấy id từ params (URL)
        const { id } = await params;

        // Tìm problem theo id và lấy testcase
        const problem = await Problem.findById(id).select(`-submissions`);
        if (!problem) {
            return NextResponse.json({
                success: false,
                message: 'Bài không tồn tại',
            }, { status: 200 });
        }

        // Trả về testcase của problem
        return NextResponse.json({
            success: true,
            problem: problem,
        }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: 'Có lỗi xảy ra',
        }, { status: 200 });
    }
}


export async function POST(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        const formData = await request.formData();
        const inputFile = formData.get('input');
        const outputFile = formData.get('output');

        if (
            !inputFile || !(inputFile instanceof File) ||
            !outputFile || !(outputFile instanceof File)
        ) {
            return NextResponse.json(
                { success: false, message: 'Thiếu file input hoặc output' },
                { status: 400 }
            );
        }

        // Đọc buffer trực tiếp từ File
        const inputBuffer = Buffer.from(await inputFile.arrayBuffer());
        const outputBuffer = Buffer.from(await outputFile.arrayBuffer());

        // Upload trực tiếp từ buffer, không dùng tmp
        const [inputRes, outputRes] = await Promise.all([
            uploadBuffer(inputBuffer, 'testcase', `${Date.now()}_${inputFile.name}`),
            uploadBuffer(outputBuffer, 'testcase', `${Date.now()}_${outputFile.name}`),
        ]);

        const problem = await Problem.findById(id);
        if (!problem) {
            return NextResponse.json(
                { success: false, message: 'Problem không tồn tại' },
                { status: 200 }
            );
        }

        problem.testcase.push({
            input: inputRes.secure_url,
            output: outputRes.secure_url,
        });
        await problem.save();

        return NextResponse.json(
            {
                success: true, message: 'Thêm testcase thành công', input: inputRes.secure_url,
                output: outputRes.secure_url,
            },
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 200 }
        );
    }
}

export async function PUT(req, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        const formData = await req.formData();
        const index = parseInt(formData.get('index'));
        const inputFile = formData.get('input');
        const outputFile = formData.get('output');

        if (isNaN(index)) {
            return NextResponse.json({ success: false, message: 'Thiếu chỉ số index' }, { status: 400 });
        }

        const problem = await Problem.findById(id);
        if (!problem || !problem.testcase[index]) {
            return NextResponse.json({ success: false, message: 'Testcase không tồn tại' }, { status: 404 });
        }

        // Xoá file cũ
        console.log(problem.testcase[index].input)
        await Promise.all([
            removeCloudinaryFile(problem.testcase[index].input),
            removeCloudinaryFile(problem.testcase[index].output)
        ]);

        // Upload file mới
        const inputBuffer = Buffer.from(await inputFile.arrayBuffer());
        const outputBuffer = Buffer.from(await outputFile.arrayBuffer());

        const [inputRes, outputRes] = await Promise.all([
            uploadBuffer(inputBuffer, 'testcase', `${Date.now()}_${inputFile.name}`),
            uploadBuffer(outputBuffer, 'testcase', `${Date.now()}_${outputFile.name}`),
        ]);

        // Gán mới
        problem.testcase[index] = {
            input: inputRes.secure_url,
            output: outputRes.secure_url
        };

        await problem.save();

        return NextResponse.json({
            success: true, message: 'Cập nhật testcase thành công', input: inputRes.secure_url,
            output: outputRes.secure_url,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const index = parseInt(searchParams.get('index'));

        if (isNaN(index)) {
            return NextResponse.json({ success: false, message: 'Thiếu chỉ số index' }, { status: 400 });
        }

        const problem = await Problem.findById(id);
        if (!problem || !problem.testcase[index]) {
            return NextResponse.json({ success: false, message: 'Testcase không tồn tại' }, { status: 404 });
        }

        const { input, output } = problem.testcase[index];

        // Xóa file khỏi Cloudinary
        await Promise.all([
            removeCloudinaryFile(input),
            removeCloudinaryFile(output)
        ]);

        // Xóa testcase khỏi mảng
        problem.testcase.splice(index, 1);
        await problem.save();

        return NextResponse.json({ success: true, message: 'Xóa testcase thành công', testcase: problem.testcase });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}
