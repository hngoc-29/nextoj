import Problem from "@/models/Problem";
import dbConnect from "@/lib/mongoose";

export async function GET(req) {
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);

        const filter = { public: true };
        const total = await Problem.countDocuments(filter);
        const problems = await Problem.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ _id: -1 });

        return Response.json({
            success: true,
            problems,
            pagination: {
                total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                limit,
            },
        });
    } catch (error) {
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}