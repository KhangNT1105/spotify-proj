import React from 'react'
import { ChevronDownIcon } from "@heroicons/react/outline"
function Header({ avatar, name }) {
    return (
        <header className='fixed z-10 top-0 right-0 w-[100%] md:w-[calc(100%-170px)] flex justify-end  p-5'>
            <div className='flex items-center rounded-full pl-1 py-1 pr-2 bg-black text-white' >
                <img className='rounded-full w-9 h-9 mr-2' src={avatar} alt="avatar" />
                <p className='text-[13px] pr-2'>{name}</p>
                <ChevronDownIcon  width={20} />
            </div>
        </header>
    )
}

export default Header
