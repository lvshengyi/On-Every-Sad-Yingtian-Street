import { SWITCHER_CLASS_HOLDER } from './switchers.js';
import { setCurrentMusicId } from "../helper/LocalStorageHelper.js";
import _ from 'lodash';

export class MusicPlayer {

    musics;

    currentMusic;

    switcher;

    playMode = 'ALL_REPEAT';

    constructor(musics, playMode = 'ALL_REPEAT', currentMusic) {
        this.musics = musics;
        this.playMode = playMode;
        this.switcher = SWITCHER_CLASS_HOLDER[playMode](this);
        this.currentMusic = currentMusic || musics.getHead();
    }

    nextPlayMode() {
        const nextPlayMode = {
            ALL_REPEAT: 'SHUFFLE',
            SHUFFLE: 'REPEAT_ONCE',
            REPEAT_ONCE: 'ALL_REPEAT'
        }[this.playMode];

        this.playMode = nextPlayMode;
        this.switcher = SWITCHER_CLASS_HOLDER[this.playMode](this);
        return this.playMode;
    }

    changeMusicList(musicList) {
        this.musics = musicList;
    }

    onEnded() {
        this.switcher.onEnded();
        setCurrentMusicId(this.currentMusic.id);
    }

    prev() {
        this.switcher.prev();
    }

    next() {
        this.switcher.next();
    }

    play(music) {
        this.currentMusic = music;
    }

    getCurrentMusicField(field) {
        if (!this.currentMusic) {
            return;
        }
        return this.currentMusic[field];
    }

    getCurrentMusicSrc() {
        if (!this.currentMusic) {
            return;
        }

        return `http://halve.gitee.io/assets/musics/${this.currentMusic['name']}.mp3`
    }

    getAllMusic() {
        return this.musics.musics;
    }
}

export class Music {

    id;

    name;

    cover;

    src;

    isFavorite;

    constructor(id, name, cover, src, isFavorite = false) {
        this.id = id;
        this.name = name;
        this.cover = cover;
        this.src = src;
        this.isFavorite = isFavorite;
    };
}