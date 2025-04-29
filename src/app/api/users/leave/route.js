import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req) {
    await dbConnect();
    const { id } = await req.json(); // FIXED

    try {
        const user = await User.findByIdAndUpdate(
            id,
            { contestJoin: null }, // FIXED
            { new: true }
        ).select('-password');

        return new Response(
            JSON.stringify({
                success: true,
                message: "Rời kì thi thành công",
                user
            }),
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return new Response(
            JSON.stringify({ success: false, message: "Lỗi máy chủ." }),
            { status: 500 }
        );
    }
}
