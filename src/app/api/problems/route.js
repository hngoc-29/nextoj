// File: src/app/api/problems/route.js

export const config = {
    api: {
        bodyParser: false, // Next.js sẽ không tự parse JSON – nhưng vẫn cho phép request.formData()
    },
};
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import cloudinary from '@/lib/cloudinary';
import Problem from '@/models/Problem';
import mongoose from 'mongoose';

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const contestId = searchParams.get('contestId');
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const skip = (page - 1) * limit;

        let filter = {};
        if (contestId != null) {
            if (!mongoose.Types.ObjectId.isValid(contestId)) {
                return NextResponse.json(
                    { success: false, message: 'contestId không hợp lệ' },
                    { status: 200 }
                );
            }
            filter.contestId = new mongoose.Types.ObjectId(contestId);
        }

        // Tổng số bài theo filter
        const totalCount = await Problem.countDocuments(filter);
        // Lấy dữ liệu phân trang
        const problems = await Problem.find(filter)
            .select('-submissions -testcase')
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalCount / limit) || 1;

        return NextResponse.json(
            {
                success: true,
                problems,
                pagination: { currentPage: page, totalPages, totalCount }
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



export async function POST(request) {
    try {
        await dbConnect();

        // 1) Đọc FormData từ Request
        const formData = await request.formData();
        const title = formData.get('title')?.toString() || '';
        const timeLimit = Number(formData.get('timeLimit'));
        const memoryLimit = Number(formData.get('memoryLimit'));
        const point = Number(formData.get(`point`));
        const publicValue = formData.get('public'); // Lấy giá trị public
        const isPublic = publicValue === 'true' ? true : false; // Chuyển sang boolean

        const contestIdRaw = formData.get('contestId');
        let contestIdArray = [];
        if (contestIdRaw) {
            try {
                contestIdArray = JSON.parse(contestIdRaw);
            } catch {
                contestIdArray = [];
            }
        }

        const submitionsRaw = formData.get('submitions');
        let submitionsArray = [];
        if (submitionsRaw) {
            try {
                submitionsArray = JSON.parse(submitionsRaw);
            } catch {
                submitionsArray = [];
            }
        }

        // 2) Xử lý file PDF hoặc link
        const fileField = formData.get('content');
        let contentUrl = '';

        if (fileField instanceof File) {
            // Nếu là file, upload lên Cloudinary
            const arrayBuffer = await fileField.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'raw',
                        folder: 'problems',
                        public_id: `problem_${Date.now()}_${fileField.name}`,
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                stream.end(buffer);
            });
            contentUrl = uploadResult.secure_url;
        } else if (typeof fileField === 'string' || fileField instanceof String) {
            // Nếu là link, dùng trực tiếp
            contentUrl = fileField.toString();
        } else {
            throw new Error('Thiếu file PDF hoặc link ở trường "content"');
        }

        // 4) Lưu record vào MongoDB
        const problem = await Problem.create({
            title,
            content: contentUrl,
            timeLimit,
            memoryLimit,
            point,
            public: isPublic, // Đảm bảo đúng kiểu boolean
            submitions: submitionsArray,
            contestId: contestIdArray,
        });

        return NextResponse.json(
            { success: true, problem, message: 'Tạo bài thành công' },
            { status: 201 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 200 }
        );
    }
}

