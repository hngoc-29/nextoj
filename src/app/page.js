
import Link from 'next/link';

export const metadata = {
  title: 'Trang chủ | OJ Platform',
}

export default function HomePage() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-32">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-5xl font-extrabold mb-4">Chinh phục lập trình cùng OJ Platform</h1>
          <p className="text-xl mb-8">Giải bài tập, tham gia cuộc thi, thách thức bản thân mỗi ngày.</p>
          <Link href="/signup" className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition">
            Bắt đầu ngay
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Tính năng nổi bật</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 border rounded-xl hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Kho bài tập đa dạng</h3>
              <p>Hàng ngàn bài tập với độ khó tăng dần, phù hợp mọi trình độ.</p>
            </div>
            <div className="p-6 border rounded-xl hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Chấm tự động</h3>
              <p>Hệ thống chấm bài tự động, trả kết quả nhanh chóng và chính xác.</p>
            </div>
            <div className="p-6 border rounded-xl hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Tham gia cuộc thi</h3>
              <p>Thử thách bản thân với các cuộc thi lập trình hấp dẫn.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-4">Bạn đã sẵn sàng nâng cao kỹ năng?</h2>
          <p className="text-lg mb-8">Tham gia cộng đồng lập trình viên và cùng nhau phát triển.</p>
          <Link href="/signup" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition">
            Đăng ký miễn phí
          </Link>
        </div>
      </section>
    </div>
  );
}