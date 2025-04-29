import Contest from "@/models/Contest";
import dbConnect from "./mongoose";

export const getAllContest = async () => {
    try {
        await dbConnect();
        const contest = await Contest.find().select("-user");
        return {
            success: true,
            contest,
        };
    } catch (err) {
        console.log(err)
        return {
            success: false,
            message: err.message
        };
    }

}