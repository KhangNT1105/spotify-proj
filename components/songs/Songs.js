import React from 'react'
import { useRecoilState } from 'recoil'
import { playlistState } from '../../atoms/playlistAtom'
import moment from 'moment'
import { currentSongState, isPlaySongState } from '../../atoms/songAtom';
import useSpotify from '../../hooks/useSpotify';
function Songs() {
    const spotifyAPI = useSpotify();
    const [playlist] = useRecoilState(playlistState);
    const [isPlaySong,setIsPlaySong]=useRecoilState(isPlaySongState);
    const [currentSong,setCurrentSong]=useRecoilState(currentSongState);
    const handleClickSong=(song)=>()=>{
        setCurrentSong(song);
        setIsPlaySong(true);
        spotifyAPI.play({
            uris:[song.uri]
        })
    };
   
    const renderSongs = (songs) => songs?.map(({ added_at,track }, idx) => {
        const temp =moment.duration(track?.duration_ms);
        return <tr key={`${track?.name}-${idx}`} className='cursor-pointer hover:bg-gray-500/50' onClick={handleClickSong(track)}>
        <td className='px-2 text-gray-400'>
            {idx+1}
        </td>
        <td className='flex  items-start py-3'>
            <img className='w-11 h-11' src={track?.album?.images?.[0]?.url} alt={track?.name} />
            <div className='pl-2'>
                <p className='text-[13px]'>{track?.name}</p>
                <p className='text-[12px]'>{track?.artists?.map((art)=>art?.name)?.join(",")}</p>
            </div>
        </td>
        <td className='text-gray-400 hidden md:table-cell text-[13px]'>
            <p>{track?.album?.name}</p>
        </td>
        <td className='text-gray-400 hidden md:table-cell'>
            <p>{moment(added_at).format("LL")}</p>
        </td>
        <td className='text-gray-400 hidden md:table-cell'>
            <p>{temp.minutes() + ":" + temp.seconds()}</p>
        </td>
    </tr>})
    const headers = ["#", "TITLE", "ALBUM", "DATE ADDED", "TIME"];
    const renderHeaders = (headers) => headers.map((header, idx) => <th className={`py-5 text-gray-400 ${[2,3,4].includes(idx)?"hidden md:table-cell":""} text-left text-[13px] font-light`} key={`${header}-${idx}`}>
        {header}
    </th>)
    return (
        <table className='text-white w-full mt-10'>
            <tr className='py-4'>
                {renderHeaders(headers)}
            </tr>
            {renderSongs(playlist?.tracks?.items)}
        </table>
    )
}

export default Songs
