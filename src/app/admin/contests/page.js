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
        <div className="flex-1 overflow-auto">
            <ContestsManager initialContests={contestsJSON} />
        </div>
    );
}
