'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { useUser } from '@/context/user';

export default function ChangePasswordPage() {
    const { user, setUser } = useUser();
    if (!user) notFound();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg('');
        if (newPassword !== confirmPassword) {
            setMsg('Mật khẩu mới và xác nhận không khớp');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/users/cpass', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user,
                    oldPassword,
                    newPassword,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Đổi mật khẩu thất bại');
            setMsg('Đổi mật khẩu thành công!');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            // router.push('/'); // Nếu muốn chuyển trang sau khi đổi mật khẩu
        } catch (err) {
            setMsg(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded">
            <h2 className="text-xl font-bold mb-4">Đổi mật khẩu</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label>Mật khẩu hiện tại</label>
                    <input
                        type="password"
                        className="w-full border rounded px-2 py-1"
                        value={oldPassword}
                        onChange={e => setOldPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Mật khẩu mới</label>
                    <input
                        type="password"
                        className="w-full border rounded px-2 py-1"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Xác nhận mật khẩu mới</label>
                    <input
                        type="password"
                        className="w-full border rounded px-2 py-1"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded cursor-pointer hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? 'Đang đổi...' : 'Đổi mật khẩu'}
                </button>
                {msg && <div className="text-red-600 mt-2">{msg}</div>}
            </form>
        </div>
    );
}