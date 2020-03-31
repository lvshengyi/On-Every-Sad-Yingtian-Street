import { ALL_MUSIC_LIST_KEY, FAVORITE_MUSIC_LIST_KEY } from '../musics/MusicList';

let AUDIO_PLAYER_INSTANCE;
let MUSICS;

export const getAudioPlayer = (musics) => {
    if (!AUDIO_PLAYER_INSTANCE) {
        AUDIO_PLAYER_INSTANCE = document.getElementById('player_audio');
        if (!MUSICS) {
            MUSICS = musics;
        }
    }
    if (AUDIO_PLAYER_INSTANCE) {
        AUDIO_PLAYER_INSTANCE.onended = () => {
            MUSICS.onEnded();
            setTimeout(() => AUDIO_PLAYER_INSTANCE.play(), 0)
        }
    }

    return AUDIO_PLAYER_INSTANCE;
};

export const findMuiscList = (musicLists, key) => _.find(musicLists, {key});

export const findAllMusicList = musicLists => findMuiscList(musicLists, ALL_MUSIC_LIST_KEY);

export const findFavoriteMusicList = musicLists => findMuiscList(musicLists, FAVORITE_MUSIC_LIST_KEY);