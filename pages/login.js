import React from 'react'
import { getProviders, signIn } from 'next-auth/react'
import { RoutesString } from '../constants/commons';

function login({ providers }) {
    const handleLogin = () => {
        try {
            signIn(providers.spotify.id, { callbackUrl: RoutesString.HOME });
            
        } catch (error) {
            console.log(error,"error")
        }
    }
    return (
        <div className='bg-black flex items-center justify-center h-screen'>
            <div className='text-center'>
                <img src="/static/images/spotify.png" layout='fill'
                    className="m-auto" alt="logo" />
                <button className='bg-[#18D870] rounded-full py-3 px-7 text-white my-5' onClick={handleLogin}>
                    Login with Spotify
                </button>
            </div>
        </div>
    )
}

export default login

export async function getServerSideProps() {
    const providers = await getProviders();
    return {
        props: {
            providers,
        }
    }
}