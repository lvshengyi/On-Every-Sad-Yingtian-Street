import _ from 'lodash';
import { FavoriteMusicList } from '../musics/MusicList'
import { ALL_MUSIC_LIST_KEY } from '../musics/MusicList';

const CURRENT_MUSIC_ID = 'CURRENT_MUSIC_ID';

const CURRENT_MUSIC_LIST_KEY = 'CURRENT_MUSIC_LIST_KEY';

const FAVORITE_MUSIC_LIST = 'FAVORITE_MUSIC_LIST';

const get = (key, defaultValue) => window.localStorage[key] || defaultValue;

const set = (key, value) => window.localStorage[key] = value;

export const getCurrentMusicId = defaultValue => {
    const id = get(CURRENT_MUSIC_ID, defaultValue);

    return id ? Number(id) : undefined;
};

export const setCurrentMusicId = id => set(CURRENT_MUSIC_ID, id);

export const getCurrentMusicListKey = () => get(CURRENT_MUSIC_LIST_KEY) || ALL_MUSIC_LIST_KEY;

export const setCurrentMusicListKey = key => set(CURRENT_MUSIC_LIST_KEY, key);

export const getFavoriteMusics = () => {
    const favoriteMusicList = get(FAVORITE_MUSIC_LIST);

    return favoriteMusicList ? JSON.parse(favoriteMusicList) : [];
}

export const setFavoriteMusics = favoriteMusicList => set(FAVORITE_MUSIC_LIST, JSON.stringify(favoriteMusicList));