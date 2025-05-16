import SubmitClient from './SubmitClient';
import CheckUserServer from '@/components/CheckUser';

const fetchProblem = async (id) => {
    const res = await fetch(`${process.env.BASE_URL}/api/problems/${id}`, {
        cache: 'no-store',
    });
    const data = await res.json();
    if (data.success) return data.problems
    return [];
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    const problem = await fetchProblem(id);
    if (!problem) {
        notFound();
    }
    return {
        title: `Nộp bài ${problem.title} | OJ Platform`, // Tiêu đề với tên kỳ thi
        openGraph: {
            title: `Nộp bài ${problem.title} | OJ Platform`, // Tiêu đề Open Graph
            description: 'Cùng nhau luyện tập lập trình tại OJ Platform.',
            images: ['/vnojlogo.png'],
            type: 'website',
            url: process.env.BASE_URL + `/problems/${id}/submit`,
        },
    };
}

export default async function Page({ params }) {
    const problem = await fetchProblem((await params).id);
    return (
        <CheckUserServer>
            <div className="px-7 mt-5 w-full">
                <h1 className="text-3xl font-[500]">Nộp bài <b>{problem?.title}</b></h1>
                <div className="bg-gray-400 h-[1px] mt-2" />
                <SubmitClient problem={problem} />
            </div>
        </CheckUserServer>
    );
}
