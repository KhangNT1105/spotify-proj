import { signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { ERROR } from '../constants/commons';
import { spotifyAPI } from '../constants/spotify'
function useSpotify() {
    const { data } = useSession();
    console.log("data",data)
    useEffect(() => {
        if (data) {
            if (data.error === ERROR.REFRESH_TOKEN) {
                signIn();
            }
            spotifyAPI.setAccessToken(data.user.accessToken);
        }
    }, [data])
    return spotifyAPI
}

export default useSpotify
