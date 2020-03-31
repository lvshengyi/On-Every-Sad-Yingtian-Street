import musicHelper from '../helper/MusicHelper.js';

class BaseSwitcher {

    musicPlayer;

    constructor(musicPlayer) {
        this.musicPlayer = musicPlayer;
    }

    onEnded() {
        throw Error('must implement in subclass');
    }

    next() {
        throw Error('must implement in subclass');
    }

    prev() {
        throw Error('must implement in subclass');
    }
}

//列表循环
class AllRepeatSwitcher extends BaseSwitcher {

    onEnded() {
        this.next();
    }

    next() {
        const musicList = this.musicPlayer.getAllMusic()
        const currentIndex = _.indexOf(_.map(musicList, 'id'), this.musicPlayer.currentMusic.id);
        const maxIndex = _.size(musicList) - 1;
        this.musicPlayer.currentMusic = musicList[currentIndex === maxIndex ? 0 : currentIndex + 1];
    };

    prev() {
        const musicList = this.musicPlayer.getAllMusic()
        const currentIndex = _.indexOf(_.map(musicList, 'id'), this.musicPlayer.currentMusic.id);
        const maxIndex = _.size(musicList) - 1;
        this.musicPlayer.currentMusic = musicList[currentIndex === 0 ? maxIndex : currentIndex - 1];
    }
}

//随机播放
class ShuffleSwitcher extends BaseSwitcher {

    onEnded() {
        this.next();
    }

    next() {
        const musicList = this.musicPlayer.getAllMusic()
        this.musicPlayer.currentMusic = musicList[_.random(_.size(musicList) - 1)]
    };

    prev() {
        this.next()
    }
}

//单曲循环
class RepeatOnceSwitcher extends AllRepeatSwitcher {

    onEnded() {

    }
}

export const SWITCHER_CLASS_HOLDER = {
    ALL_REPEAT: musicPlayer => new AllRepeatSwitcher(musicPlayer),
    SHUFFLE: musicPlayer => new ShuffleSwitcher(musicPlayer),
    REPEAT_ONCE: musicPlayer => new RepeatOnceSwitcher(musicPlayer),
}