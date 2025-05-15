// File: app/admin/contests/page.jsx

import ContestsManager from './ContestsManager';

export const metadata = {
    title: 'Quản lý kỳ thi| OJ Platform',
};

// Server Component
export default async function ContestsPage() {
    const data = await (await fetch(`${process.env.BASE_URL}/api/contests`)).json();
    if (!data.success) {
        return {
            notFound: true,
        }
    }
    const contests = data.contest;
    const contestsJSON = JSON.parse(JSON.stringify(contests));

    return (
        <div className="flex-1 min-h-screen bg-gray-50 py-8 px-2 sm:px-6">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">
                    Quản lý kỳ thi
                </h1>
                <ContestsManager initialContests={contestsJSON} />
            </div>
        </div>
    );
}
