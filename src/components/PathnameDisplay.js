'use client'

import { loadingLoadContext } from '@/context/loadingLoad';
import { usePathname } from 'next/navigation'
import { useContext, useEffect } from 'react'

export default function PathnameDisplay() {
    const pathname = usePathname();
    const { setLoadingLoad } = useContext(loadingLoadContext);
    useEffect(() => {
        setLoadingLoad(false);
    }, []);
    return <span className='text-[20px]'>Không thể tìm thấy trang "{pathname}"</span>
}
