import { getSession, useSession } from 'next-auth/react'
import Head from 'next/head'
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import Content from '../components/content/Content';
import Header from '../components/header/Header';
import Sidebar from '../components/sidebar/Sidebar'
import useSpotify from '../hooks/useSpotify'
import { playlistIdState, playlistState } from '../atoms/playlistAtom'
import axios from 'axios';
import Player from '../components/player/Player';
import { currentSongState, isPlaySongState } from '../atoms/songAtom';
import { deviceState, volumeState } from '../atoms/deviceAtom';
import { RoutesString } from '../constants/commons';
export default function Home({ session, song, isPlaying, volume, device }) {
  const { data } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const spotifyAPI = useSpotify();
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)
  const [, setPlaylist] = useRecoilState(playlistState)
  const [, setIsPlaying] = useRecoilState(isPlaySongState)

  const [, setCurrentSong] = useRecoilState(currentSongState);
  const [, setVolume] = useRecoilState(volumeState);
  const [, setDevice] = useRecoilState(deviceState);


  const headerProps = {
    avatar: data?.user?.image,
    name: data?.user?.name
  }
  useEffect(() => {
    if (spotifyAPI.getAccessToken()) {
      (async () => {
        try {
          const response = await spotifyAPI.getUserPlaylists()
          setPlaylists(response.body.items);
        } catch (error) {
        }
      })()
    }
  }, [data, spotifyAPI])

  useEffect(() => {
    (async () => {
      if (playlistId) {
        try {
          const response = await spotifyAPI.getPlaylist(playlistId);
          setPlaylist(response.body);

        } catch (error) {

        }
      } else {

      }
    })()
  }, [spotifyAPI, playlistId, data])
  // useEffect(() => {
  //   (async()=>{
  //     const response = await spotifyAPI.getMyCurrentPlaybackState();
  //     console.log("responseseseseseseseseses",response);
  //   })()
  // }, [spotifyAPI])
  useEffect(() => {
    if (song) {
      setCurrentSong(song);
    }
  }, [song])
  useEffect(() => {
    if (device) {
      setDevice(device);
    }
  }, [device])
  useEffect(() => {
    setIsPlaying(isPlaying);
  }, [isPlaying])
  useEffect(() => {
    setVolume(volume);
  }, [volume])
  const handleClickPlaylist = (id) => () => setPlaylistId(id)
  const sidebarProps = {
    playlists,
    handleClickPlaylist
  }
  const contentProps = {
  }
  return (
    <div className="bg-black overflow-hidden h-screen scrollbar-hide">
      <Head>
        <title>Khang's Spotify</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='flex '>
        <Sidebar {...sidebarProps} />
        <Header {...headerProps} />
        <Content {...contentProps} />
      </main>
      <Player />
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  console.log("session", session);
  if (session) {
    const response = await axios({
      method: "GET",
      url: "https://api.spotify.com/v1/me/player/devices",
      headers: {
        "Authorization": `Bearer ${session?.user?.accessToken}`
      }
    })
    await axios({
      method: "PUT",
      url: "https://api.spotify.com/v1/me/player",
      headers: {
        "Authorization": `Bearer ${session?.user?.accessToken}`
      },
      data: {
        device_ids: response.data.devices.map((item) => item.id)
      }
    })
    const songResponse = await axios({
      method: "GET",
      url: "https://api.spotify.com/v1/me/player",
      headers: {
        "Authorization": `Bearer ${session?.user?.accessToken}`
      },
    })
    return {
      props: {
        session,
        song: songResponse?.data?.item || "",
        isPlaying: songResponse?.data?.is_playing,
        volume: songResponse?.data?.device?.volume_percent,
        device: response?.data?.devices?.[0]
      }
    }
  }
  return {
    redirect: {
      destination: RoutesString.LOGIN,
      permanent: false,
    },
  };
}