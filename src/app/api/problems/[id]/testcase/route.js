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

// Hàm chuyển tên sang slug
function toSlug(str) {
    return str
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // bỏ dấu
        .replace(/[^a-zA-Z0-9\s]/g, '') // bỏ ký tự đặc biệt
        .trim()
        .replace(/\s+/g, '-') // thay dấu cách bằng -
        .toLowerCase();
}

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

        // Lấy problem để lấy tên
        const problem = await Problem.findById(id);
        if (!problem) {
            return NextResponse.json(
                { success: false, message: 'Problem không tồn tại' },
                { status: 200 }
            );
        }
        const slug = toSlug(problem.title || problem.name || `problem-${id}`);

        // Lấy tất cả key bắt đầu bằng input/output
        const inputs = [];
        const outputs = [];
        for (const [key, value] of formData.entries()) {
            if (key.startsWith('input') && value instanceof File) {
                const idx = parseInt(key.replace('input', ''));
                inputs[idx] = value;
            }
            if (key.startsWith('output') && value instanceof File) {
                const idx = parseInt(key.replace('output', ''));
                outputs[idx] = value;
            }
        }

        // Kiểm tra số lượng testcase hợp lệ
        if (!inputs.length || !outputs.length || inputs.length !== outputs.length) {
            return NextResponse.json(
                { success: false, message: 'Thiếu file input hoặc output hoặc số lượng không khớp' },
                { status: 400 }
            );
        }

        // Upload tất cả testcase
        const uploadPromises = inputs.map(async (inputFile, idx) => {
            const outputFile = outputs[idx];
            if (!inputFile || !outputFile) return null;

            const inputBuffer = Buffer.from(await inputFile.arrayBuffer());
            const outputBuffer = Buffer.from(await outputFile.arrayBuffer());

            const timestamp = Date.now();

            const [inputRes, outputRes] = await Promise.all([
                uploadBuffer(inputBuffer, `testcase/${slug}`, `input_${idx}${timestamp}${idx}.txt`),
                uploadBuffer(outputBuffer, `testcase/${slug}`, `output_${idx}${timestamp}${idx}.txt`),
            ]);

            return {
                input: inputRes.secure_url,
                output: outputRes.secure_url,
            };
        });

        const newTestcases = (await Promise.all(uploadPromises)).filter(Boolean);

        problem.testcase.push(...newTestcases);
        await problem.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Thêm testcase thành công',
                testcases: newTestcases,
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

        const slug = toSlug(problem.title || problem.name || `problem-${id}`);

        // Xoá file cũ
        await Promise.all([
            removeCloudinaryFile(problem.testcase[index].input),
            removeCloudinaryFile(problem.testcase[index].output)
        ]);

        // Upload file mới
        const inputBuffer = Buffer.from(await inputFile.arrayBuffer());
        const outputBuffer = Buffer.from(await outputFile.arrayBuffer());
        console.log(inputBuffer, outputBuffer)
        const timestamp = Date.now();

        const [inputRes, outputRes] = await Promise.all([
            uploadBuffer(inputBuffer, `testcase/${slug}`, `input_${timestamp}${index}.txt`),
            uploadBuffer(outputBuffer, `testcase/${slug}`, `output_${timestamp}${index}.txt`),
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
        const body = await req.json();
        const indices = body.indices; // [{index: 1}, {index: 2}] hoặc [1,2]

        if (!Array.isArray(indices) || indices.length === 0) {
            return NextResponse.json({ success: false, message: 'Thiếu danh sách index' }, { status: 400 });
        }

        const problem = await Problem.findById(id);
        if (!problem) {
            return NextResponse.json({ success: false, message: 'Problem không tồn tại' }, { status: 404 });
        }

        // Sắp xếp giảm dần để xóa không bị lệch index
        const sortedIndices = [...indices].sort((a, b) => b - a);

        for (const idx of sortedIndices) {
            if (problem.testcase[idx]) {
                const { input, output } = problem.testcase[idx];
                await Promise.all([
                    removeCloudinaryFile(input),
                    removeCloudinaryFile(output)
                ]);
                problem.testcase.splice(idx, 1);
            }
        }

        await problem.save();

        return NextResponse.json({ success: true, message: 'Xóa testcase thành công', testcase: problem.testcase });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}
