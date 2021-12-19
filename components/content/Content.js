import { useSession } from 'next-auth/react'
import React from 'react'
import Banner from '../banner/Banner';
import Header from '../header/Header'
import Songs from '../songs/Songs';

function Content() {
    
    return (
        <div className='w-screen h-screen scrollbar-hide overflow-y-scroll md:pl-[170px] pb-[88px]'>
            <Banner/>
            <Songs />
        </div>
    )
}

export default Content
