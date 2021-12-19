import { atom } from "recoil";
import { ATOM_KEY } from "../constants/commons";

export const isPlaySongState = atom({
    key: ATOM_KEY.IS_PLAY_SONG,
    default: false
})
export const currentSongState = atom({
    key: ATOM_KEY.CURRENT_SONG,
    default: ""
})