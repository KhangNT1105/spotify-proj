import { atom } from "recoil";
import { ATOM_KEY } from "../constants/commons";

export const playlistIdState = atom({
    key: ATOM_KEY.PLAYLIST_ID,
    default: "6SKgy9rVirgh01NtTPkw7l"
})
export const playlistState = atom({
    key: ATOM_KEY.PLAYLIST,
    default: ""
})