import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CheckUserServer from '@/components/CheckUser';

export const metadata = {
    title: 'Dashboard Admin | OJ Platform', // Tiêu đề cho trang Admin
    description: 'Quản lý và theo dõi các hoạt động của người dùng trên OJ Platform.', // Mô tả cho trang Admin
    openGraph: {
        title: 'OJ Platform - Admin Dashboard', // Tiêu đề Open Graph cho Admin
        description: 'Quản lý và theo dõi các hoạt động của người dùng trên OJ Platform.', // Mô tả Open Graph cho Admin
        images: ['/vnojlogo.png'], // Hình ảnh đại diện cho Open Graph
        type: 'website', // Loại trang
        url: process.env.BASE_URL, // URL trang Admin
    }
};

export default function AdminLayout({ children }) {
    return (
        <CheckUserServer requireAdmin={true}>
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex flex-col flex-1">
                    <Header />
                    <div className="p-4">{children}</div>
                </div>
            </div>
        </CheckUserServer>
    );
}
