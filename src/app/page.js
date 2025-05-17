import Link from 'next/link';

export const metadata = {
  title: 'Trang chủ | OJ Platform',
};

async function getContests() {
  const res = await fetch(`${process.env.BASE_URL || ''}/api/contests`, { cache: "no-store" });
  const data = await res.json();
  return data.contest?.slice(0, 3) || [];
}

export default async function HomePage() {
  const contests = await getContests();

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center px-4 md:px-6">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Chinh phục lập trình cùng OJ Platform</h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">Giải bài tập, tham gia cuộc thi, thách thức bản thân mỗi ngày.</p>
          <Link href="/signup" className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-blue-100 transition-all duration-200">
            Bắt đầu ngay
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 md:mb-12">Tính năng nổi bật</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="p-6 md:p-8 border rounded-2xl bg-gradient-to-br from-blue-50 to-white hover:shadow-2xl transition-all duration-200 hover:scale-105">
              <h3 className="text-lg md:text-xl font-semibold mb-2">Kho bài tập đa dạng</h3>
              <p className="text-gray-700">Hàng ngàn bài tập với độ khó tăng dần, phù hợp mọi trình độ.</p>
            </div>
            <div className="p-6 md:p-8 border rounded-2xl bg-gradient-to-br from-indigo-50 to-white hover:shadow-2xl transition-all duration-200 hover:scale-105">
              <h3 className="text-lg md:text-xl font-semibold mb-2">Chấm tự động</h3>
              <p className="text-gray-700">Hệ thống chấm bài tự động, trả kết quả nhanh chóng và chính xác.</p>
            </div>
            <div className="p-6 md:p-8 border rounded-2xl bg-gradient-to-br from-purple-50 to-white hover:shadow-2xl transition-all duration-200 hover:scale-105">
              <h3 className="text-lg md:text-xl font-semibold mb-2">Tham gia cuộc thi</h3>
              <p className="text-gray-700">Thử thách bản thân với các cuộc thi lập trình hấp dẫn.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contest Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 md:mb-12">Cuộc thi nổi bật</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {contests.map((c, i) => (
              <div
                key={c._id}
                className="p-6 md:p-8 border rounded-2xl shadow bg-white animate-fade-up hover:shadow-2xl hover:-translate-y-1 transition-all duration-200"
                style={{ animationDelay: `${i * 0.15 + 0.2}s`, animationFillMode: 'both' }}
              >
                <h3 className="text-lg md:text-xl font-semibold mb-2">
                  <Link className='text-blue-600 hover:text-blue-800 underline' href={`/contests/${c._id}`}>{c.title}</Link>
                </h3>
                <p className="mb-2 text-gray-700">{c.description || "Không có mô tả"}</p>
                <span className="text-sm text-gray-500">Số lượng bài: {c.problems?.length || 0}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-50 py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Bạn đã sẵn sàng nâng cao kỹ năng?</h2>
          <p className="text-base md:text-lg mb-8 text-gray-700">Tham gia cộng đồng lập trình viên và cùng nhau phát triển.</p>
          <Link href="/signup" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition-all duration-200">
            Đăng ký miễn phí
          </Link>
        </div>
      </section>
    </div>
  );
}