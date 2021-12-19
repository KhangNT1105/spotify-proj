import React from 'react'
import { HomeIcon, SearchIcon, LibraryIcon, HeartIcon, RssIcon, PlusCircleIcon } from '@heroicons/react/outline'
import { signOut } from 'next-auth/react'
import useSpotify from '../../hooks/useSpotify'
function Sidebar({playlists,handleClickPlaylist}) {
    const spotifyAPI  = useSpotify();
    const items = [{
        Icon: HomeIcon,
        label: "Home"
    }, {
        Icon: SearchIcon,
        label: "Search"
    }, {
        Icon: LibraryIcon,
        label: "Your Library"
    }]
    const items2 = [{
        Icon: PlusCircleIcon,
        label: "Create Playlist"
    }, {
        Icon: HeartIcon,
        label: "Liked Song"
    }, {
        Icon: RssIcon,
        label: "Your Episodes"
    }]
    const renderItems = (items) => items.map(({ Icon, label }, idx) => (
        <button key={`label-${idx}`} className='flex items-center space-x-2 hover:text-white'>
            <Icon className="w-5 h-5" />
            <p className=''>{label}</p>
        </button>
    ))
    const renderPlaylists=(playlists)=>playlists.map(({name,id},idx)=>(
        <div key={`${name}-${idx}`}>
            <button onClick={handleClickPlaylist(id)} className='flex items-center space-x-2 hover:text-white'>
            <p className='pl-2'>{name}</p>
            </button>
        </div>
    ))
    const handleLogOut=()=>{
        spotifyAPI.pause();
        signOut();
    }
    return (
        <div className='fixed hidden md:inline-flex w-[170px]  text-gray-500 p-3 md:p-5 text-sm scrollbar-hide text-[10px] md:text-[14px]'>
            <div className='space-y-4'>
                <button className='flex items-center space-x-2 hover:text-white' onClick={handleLogOut}>
                    <p className=''>Logout</p>
                </button>
                {renderItems(items)}
                <hr className='border-t-[0.1px] border-gray-900' />
                {renderItems(items2)}
                <hr className='border-t-[0.1px] border-gray-900' />
                    {renderPlaylists(playlists)}
            </div>
        </div>
    )
}

export default Sidebar
