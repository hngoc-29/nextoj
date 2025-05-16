import ContestUpdate from "./ContestUpdate";

export const metadata = {
    title: 'Quản lý kỳ thi | OJ Platform',
};

export default async function page({ params }) {
    const { id } = await params;
    // Lấy danh sách bài của contest
    const problemsRes = await fetch(`${process.env.BASE_URL || ""}/api/problems?contestId=${id}`, {
        cache: "no-store",
    });
    const problemsData = await problemsRes.json();
    const problems = problemsData.success ? problemsData.problems : [];

    return (
        <div>
            <ContestUpdate id={id} initialProblems={problems} />
        </div>
    );
}
