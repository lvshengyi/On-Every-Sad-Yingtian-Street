import _ from 'lodash';
import { setFavoriteMusics } from '../helper/LocalStorageHelper';

export const FAVORITE_MUSIC_LIST_KEY = 'FAVORITE_MUSIC_LIST_KEY';

export const ALL_MUSIC_LIST_KEY = 'ALL_MUSIC_LIST_KEY';

class MusicList {

    key;

    musics;

    getHead = () => _.head(this.musics);
}

export class AllMusicList extends MusicList {

    constructor(musics) {
        super();
        this.key = ALL_MUSIC_LIST_KEY;
        this.musics = musics;
    }
}

export class FavoriteMusicList extends MusicList {

    constructor(musics) {
        super();
        this.key = FAVORITE_MUSIC_LIST_KEY;
        this.musics = musics;
    }

    add(music) {
        if (_.includes(_.map(this.musics, 'id'), music.id)) {
            return;
        }

        this.musics = _.concat(this.musics, music);
        setFavoriteMusics(this.musics);
    }

    remove(music) {
        this.musics = _.filter(this.musics, exist => exist.id !== music.id)
        setFavoriteMusics(this.musics);
    }
}