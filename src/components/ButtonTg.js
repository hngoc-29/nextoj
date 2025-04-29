"use client"
import { useUser } from "@/context/user"
import { useEffect, useState } from "react";
import { useUserContest } from "@/context/userContest";
import { useProblemContest } from "@/context/problemContest";
import { toast } from "react-toastify";

export default function ButtonTg({ id, problems }) {
    const { user, setUser } = useUser();
    const [isMe, setIsMe] = useState(false);
    const { userContest, setUserContest } = useUserContest();

    useEffect(() => {
        const fetchUserTg = async () => {
            const res = await fetch(`/api/contests/${id}?getUser=true`);
            const data = await res.json();
            if (data.success) {
                setUserContest(data.contest);
            } else {
                toast.error(data.message)
            }
        }
        fetchUserTg();
    }, [id]);

    useEffect(() => {
        if (user && user._id && userContest.length > 0) {
            setIsMe(user.contestJoin === id);
        }
    }, [user, userContest]);

    const handleClick = async () => {
        if (!isMe) {
            const res = await fetch(`/api/contests/${id}?isJoin=${!isMe}`, {
                method: "POST",
                body: JSON.stringify({
                    userId: user._id,
                    username: user.username
                })
            });

            const data = await res.json();
            if (data.success) {
                setIsMe(!isMe);
                setUser(data.user);
                toast.success(data.message)
                return;
            }
            toast.error(data.message)
        } else {
            const res = await fetch(`/api/users/leave`, {
                method: "POST",
                body: JSON.stringify({
                    id: user._id
                })
            });

            const data = await res.json();
            if (data.success) {
                setIsMe(!isMe);
                setUser(data.user);
                toast.success(data.message)
                return;
            }
            toast.error(data.message)
        }
    }

    return (
        <button
            onClick={handleClick}
            className="cursor-pointer py-2 px-3 bg-gradient-to-b from-[#337ab7] to-[#265a88] hover:bg-[#265a88] bg-repeat-x text-white font-bold rounded-[5px]"
        >{!isMe ? `Tham gia` : `Rời khỏi`} kì thi
        </button>

    )
}
