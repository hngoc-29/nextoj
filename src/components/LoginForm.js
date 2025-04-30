'use client'
import { toast } from 'react-toastify';
import { useState, useRef, useEffect } from 'react'
import { useIsOpen } from '@/context/modalLogin';
import { useUser } from '@/context/user';

export default function LoginModal() {
    const { user, setUser } = useUser();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { isOpen, setIsOpen } = useIsOpen();
    const [isLoading, setIsLoading] = useState(false);
    const modalRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch("/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (!data.success) {
                toast.error(data.message);
            } else {
                setUser(data.user);
                setIsOpen(false);
                toast.success(data.message);
            }
        } catch (err) {
            toast.error("Lỗi mạng, vui lòng thử lại");
        } finally {
            setIsLoading(false);
        }
    };

    // close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, setIsOpen]);

    useEffect(() => {
        if (isOpen)
            document.title = 'Đăng nhập | OJ Platform'
    }, [isOpen]);

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div
                        ref={modalRef}
                        className="bg-white w-full max-w-md rounded-lg shadow-lg animate-scaleIn"
                    >
                        <div className="flex justify-end p-2 mr-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-2xl font-bold text-gray-700 hover:text-red-500"
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="px-6 pb-6 mt-2">
                            <div className="flex justify-center mb-4">
                                <img
                                    src="/avatarlogin.png"
                                    alt="Avatar"
                                    className="w-24 h-24 rounded-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-1">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder="Enter Username"
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Enter Password"
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="inline-flex items-center">
                                    <input type="checkbox" defaultChecked name="remember" />
                                    <span className="ml-2">Remember me</span>
                                </label>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex items-center justify-center bg-green-500 text-white py-2 rounded transition
                  ${isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-green-600 cursor-pointer'}`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg
                                            className="animate-spin h-5 w-5 mr-2 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"
                                            />
                                        </svg>
                                        Logging in...
                                    </>
                                ) : (
                                    'Login'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
