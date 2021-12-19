import SpotifyWebApi from "spotify-web-api-node";

const scopes = ["playlist-read-private", "playlist-read-collaborative", "user-read-email", "streaming", "user-read-private", "user-library-read", "user-top-read", "user-read-playback-state", "user-modify-playback-state", "user-read-currently-playing", "user-read-recently-played", "user-follow-read"].join(",");

const params = {
    scope: scopes
}

const queryParam = new URLSearchParams(params).toString();

export const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParam}`;

export const spotifyAPI = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
})
