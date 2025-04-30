import PathnameDisplay from '@/components/PathnameDisplay'
export const metadata = {
    title: 'lỗi 404 | OJ Platform',
}
export default function page() {
    return (
        <div className="px-7 mt-5">
            <h1 className="text-3xl font-[400px]">lỗi 404</h1>
            <div className="bg-gray-400 h-[1px] mt-2" />
            <div className='mt-2'>
                <PathnameDisplay />
            </div>
        </div>
    )
}
