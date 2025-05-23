import Contest from "@/models/Contest";
import dbConnect from "./mongoose";

export const getAllContest = async () => {
    try {
        await dbConnect();
        // Tắt cache hoàn toàn nếu có middleware nào can thiệp
        const contest = await Contest.find().select("-user").lean(); // .lean() tránh caching ngầm của mongoose
        return {
            success: true,
            contest,
        };
    } catch (err) {
        return {
            success: false,
            message: err.message
        };
    }
};
