import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import { ERROR, RoutesString } from "../../../constants/commons";
import { LOGIN_URL, spotifyAPI } from '../../../constants/spotify'

const refreshAccessToken = async (token) => {
    try {
        spotifyAPI.setAccessToken(token.accessToken);
        spotifyAPI.setRefreshToken(token.refreshToken);

        const { body } = await spotifyAPI.refreshAccessToken();

        console.log("refresh token", body);

        return {
            ...token,
            accessToken: body.access_token,
            accessTokenExpires: Date.now() + body.expires_in * 1000,
            refreshToken: body.refresh_token || token.refresh_token
        }

    } catch (error) {
        console.log("error refresh", error);
        return {
            ...token,
            error: ERROR.REFRESH_TOKEN
        }
    }
}
export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            authorization: LOGIN_URL
        }),
        // ...add more providers here
    ],
    secret: process.env.JWT_SECRET,
    pages: {
        signIn: RoutesString.LOGIN,
    },
    callbacks: {
        async jwt({ token, account, user }) {
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    accessTokenExpires: account.expires_at * 1000,

                }
            }
            // if token has not expired
            if (Date.now() < token.accessTokenExpires) {
                console.log("token is valid")
                return token;
            }

            // if token expired
            console.log("token expired");
            return await refreshAccessToken(token)
        },
        async session({ session, token }) {
            session.user.accessToken = token?.accessToken;
            session.user.refreshToken = token?.refreshToken;
            session.user.username = token?.username;
            session.error = token?.error || "";
            return session;
        }
    }
})