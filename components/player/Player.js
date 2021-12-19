import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useRecoilState } from 'recoil'
import { currentSongState, isPlaySongState } from '../../atoms/songAtom'
import { PlayIcon, RewindIcon, FastForwardIcon, PauseIcon } from '@heroicons/react/solid'
import { VolumeOffIcon, VolumeUpIcon } from '@heroicons/react/outline';
import { throttle } from 'lodash';
import { deviceState, volumeState } from '../../atoms/deviceAtom';
import useSpotify from '../../hooks/useSpotify';
function Player() {
    const spotifyAPI = useSpotify();
    const [currentSong, setCurrentSong] = useRecoilState(currentSongState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlaySongState);
    const [volume, setVolume] = useRecoilState(volumeState);
    const [device] = useRecoilState(deviceState);

    const previousVolume = useRef(0);
    const togglePlay = () => {
        if (isPlaying) {
            spotifyAPI.pause().catch(() => { })
        } else {
            spotifyAPI.play().catch(() => { });
        }
        setIsPlaying(value => !value);

    }
    const handleChangeVolume = (e) => {
        setVolume(e.target.value);
    }
    const toggleMuted = () => {
        if (volume > 0) {
            setVolume(0);
            previousVolume.current = volume;
        } else {
            setVolume(previousVolume.current);
        }
    }
    const getCurrentSong = async () => {
        setTimeout(async() => {
            const response = await spotifyAPI.getMyCurrentPlaybackState();
            setCurrentSong(response?.body?.item);
        }, 500);
    }
    const handleNextPrev = (isNext = true) => () => {
        if (isNext) {
            spotifyAPI.skipToNext({
                device_id: device.id
            }).then(() => {
                getCurrentSong();

            }).catch(() => { });
        } else {
            spotifyAPI.skipToPrevious().then(() => {
                getCurrentSong()
            }).catch(() => { });
        }
        setIsPlaying(true);
    }
    useEffect(() => {
        if (Number(volume) >= 0 && Number(volume) <= 100) {
            throttleAdjustVolume(volume)
        }
    }, [volume])
    const throttleAdjustVolume = useCallback(
        throttle((v) => {
            spotifyAPI.setVolume(v);
        }, 100)
        , [])
    return (
        <div className='p-5 bg-gradient-to-b from-black to-gray-900 fixed bottom-0 left-0 w-full text-white'>
            <div className='grid grid-cols-3'>
                <div className='flex items-center'>
                    <img className='w-12 h-12 hidden md:block' src={currentSong?.album?.images?.[0]?.url} alt={currentSong?.name} />
                    <div className='pl-3'>
                        <p className='text-[13px]'>{currentSong?.name}</p>
                        <p className='text-[12px] text-gray-400'>{currentSong?.artists?.map((art) => art?.name)?.join(",")}</p>
                    </div>
                </div>

                <div className='flex items-center justify-center'>
                    <RewindIcon onClick={handleNextPrev(false)} className='w-5 h-5 cursor-pointer text-gray-400 hover:text-white ' />
                    {isPlaying ?
                        <PauseIcon onClick={togglePlay} className='w-10 h-10 mx-2 md:mx-5  text-gray-200 hover:text-white cursor-pointer' />
                        :
                        <PlayIcon onClick={togglePlay} className='w-10 h-10 mx-2 md:mx-5  text-gray-200 hover:text-white cursor-pointer' />
                    }
                    <FastForwardIcon onClick={handleNextPrev(true)} className='w-5 h-5 text-gray-400 hover:text-white cursor-pointer' />

                </div>

                <div className='flex justify-end items-center'>
                    {volume ?
                        <VolumeUpIcon onClick={toggleMuted} className='w-5 h-5 mr-2 text-gray-400 hover:text-white cursor-pointer' />
                        :
                        <VolumeOffIcon onClick={toggleMuted} className='w-5 h-5 mr-2 text-gray-400 hover:text-white cursor-pointer' />
                    }
                    <input value={volume} min={0} max={100} type="range" className='w-[80px] md:w-fit' onChange={handleChangeVolume} />
                </div>
            </div>
        </div>
    )
}

export default Player
