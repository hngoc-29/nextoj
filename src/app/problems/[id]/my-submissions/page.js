import React from 'react'
import MySubmissions from './MySubmissions';
import CheckUserServer from '@/components/CheckUser';

export default async function page({ params }) {
    const { id } = await params;
    return (
        <CheckUserServer>
            <div>
                <MySubmissions id={id} />
            </div>
        </CheckUserServer>
    )
}
