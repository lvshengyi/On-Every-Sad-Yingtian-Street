<template>
  <div>
    <transition v-if="loading" name="fade">
      <loading v-show="loading"></loading>
    </transition>
    <div v-else>
      <!--标题栏-->
      <div class="titlebar">我 爱 南 京</div>
      <!--唱片机-->
      <div class="player" :class="{on: musicPlaying}">
        <!--拾音器-->
        <div class="player__pickups">
          <div class="player__pickups__axis"></div>
          <div class="player__pickups__pole"></div>
        </div>
        <!--唱片-->
        <div class="player__disc">
          <!--唱片封面-->
          <div class="player__disc__cover">
            <img :src="require('@/assets/imgs/cover_default.jpg')">
          </div>
        </div>
        <!--李志LOGO-->
        <img :src="require('@/assets/imgs/logo_lizhi.png')" class="player__logo" alt="logo">
        <!--音频播放器-->
        <audio id="player_audio" :src="musicPlayer.getCurrentMusicSrc()"></audio>
      </div>
      <div class="mid-block">
        <div class="music-name">{{musicPlayer.getCurrentMusicField('name')}}</div>
        <likeButton
          :active="musicPlayer.currentMusic ? musicPlayer.currentMusic.isFavorite : false"
          @change="handleLikeChange"
        ></likeButton>
      </div>
      <!-- 音频进度条 -->
      <div class="audio-progress">
        <div class="bar">
          <van-slider
            v-model="currentAudioProgress"
            :max="maxAudioProgress"
            step="0.2"
            @change="onAudioProgressChange"
            @drag-start="handleDragStart"
            @drag-end="handleDragEnd"
          />
        </div>
      </div>
      <!-- 播放控制 -->
      <div class="control-bar">
        <div class="control-bar__btn icn_mode" @click="handlePlayModeChange">
          <van-icon class-prefix="iconfont" :name="playModeIcon"/>
        </div>
        <div class="control-bar__btn icn_pre" @click="playBySwitcher('prev')">
          <van-icon class-prefix="iconfont" name="prev"/>
        </div>
        <div class="control-bar__btn icn_play" @click="togglePlay">
          <van-icon class-prefix="iconfont" :name="musicPlaying ? 'pause' : 'play'"/>
        </div>
        <div class="control-bar__btn icn_next" @click="playBySwitcher('next')">
          <van-icon class-prefix="iconfont" name="next"/>
        </div>
        <div class="control-bar__btn icn_list" @click="togglePlayList">
          <van-icon class-prefix="iconfont" name="list"/>
        </div>
      </div>
      <!--播放列表-->
      <transition name="fade">
        <div class="mask" v-show="playListVisible" @click.self="closePlayList">
          <div class="playlist">
            <div class="playlist__head">
              <h4 class="playlist__title">播放列表</h4>
              <div class="playlist__btnclose" @click="closePlayList">
                <van-icon name="cross"/>
              </div>
            </div>
            <div class="playlist__body">
              <van-sidebar v-model="playListTab" @change="handleTabChange">
                <van-sidebar-item title="全部"/>
                <van-sidebar-item title="我喜欢的"/>
              </van-sidebar>
              <div class="playlist__body__list">
                <div
                  class="list__item"
                  v-for="(music, index) in computePlayListMusics"
                  :key="index"
                  :class="{active: music === musicPlayer.currentMusic}"
                  @click="playByPlayList(music)"
                >
                  <van-icon class-prefix="iconfont" name="play"/>
                  <span class="item__name">{{music.name}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { MusicPlayer } from "../musics";
import {
  getCurrentMusicId,
  setCurrentMusicId,
  getCurrentMusicListKey,
  getFavoriteMusics,
  setCurrentMusicListKey
} from "../helper/LocalStorageHelper.js";
import musicHelper from "../helper/MusicHelper.js";
import {
  getAudioPlayer,
  findFavoriteMusicList,
  findMuiscList
} from "../helper/OfomHelper.js";
import loading from "@/components/loading.vue";
import likeButton from "@/components/likeButton.vue";
import {
  AllMusicList,
  FavoriteMusicList,
  FAVORITE_MUSIC_LIST_KEY,
  ALL_MUSIC_LIST_KEY
} from "../musics/MusicList.js";
export default {
  components: {
    loading,
    likeButton
  },
  data() {
    return {
      musicPlayer: undefined,
      musicLists: [],
      audioPlayer: undefined,
      playListVisible: false,
      musicPlaying: false,
      playModeIcon: "playlist",
      loading: true,
      playModeIcon: "loop",
      currentAudioProgress: 0,
      maxAudioProgress: 100,
      playListTab: 0,
      playListKey: undefined,
      stopUpdateProgress: false
    };
  },
  async mounted() {
    const favoriteMusics = getFavoriteMusics();

    const allMusics = await musicHelper.findAll();
    const resolvedAllMusic = _.map(allMusics, music =>
      _.assign({}, music, {
        isFavorite: _.includes(_.map(favoriteMusics, "id"), music.id)
      })
    );

    const allMusicList = new AllMusicList(resolvedAllMusic);
    const favoriteMusicList = new FavoriteMusicList(favoriteMusics);

    const musicLists = [allMusicList, favoriteMusicList];
    const musicListKey = getCurrentMusicListKey();

    const currentMusicList = _.find(musicLists, { key: musicListKey });
    const currentMusicId = getCurrentMusicId();
    const firstMusic = currentMusicId
      ? _.find(currentMusicList.musics, music => music.id === currentMusicId)
      : currentMusicList.getHead();

    this.musicPlayer = new MusicPlayer(
      currentMusicList,
      "ALL_REPEAT",
      firstMusic
    );
    this.musicLists = musicLists;
    this.audioPlayer = getAudioPlayer(this.musicPlayer);
    this.playListTab = {
      [ALL_MUSIC_LIST_KEY]: 0,
      [FAVORITE_MUSIC_LIST_KEY]: 1
    }[musicListKey];
    this.playListKey = musicListKey;

    //故意让加载动画显示的时间更久，避免一闪而过观感不好
    setTimeout(() => {
      this.loading = false;
      /**
       * 之所以有2个setTimeout，因为loading会决定页面的渲染（而之所以会决定页面的渲染，是因为当loading没有完成的时候，musicPlayer无法运行）
       * 而loading没有为true的时候，则页面上的audio_player元素不存在，因此需要等待渲染完成再去获取该元素
       */
      setTimeout(() => {
        this.audioPlayer = getAudioPlayer(this.musicPlayer);
        this.addEventListenerToAudio(this.audioPlayer);
      }, 0);
    }, 800);

    //歌单切换测试代码
    // this.handleAddFavorite(musicHelper.findById(7));
    // this.handleAddFavorite(musicHelper.findById(8));
    // this.handlePlayListChange(FAVORITE_MUSIC_LIST_KEY);
    // this.handleRemoveFavorite(musicHelper.findById(8))
    //歌单切换测试代码
  },
  methods: {
    handleTabChange(tabIndex) {
      this.playListKey = { 0: ALL_MUSIC_LIST_KEY, 1: FAVORITE_MUSIC_LIST_KEY }[
        tabIndex
      ];
      // this.handlePlayListChange(
      //   { 0: ALL_MUSIC_LIST_KEY, 1: FAVORITE_MUSIC_LIST_KEY }[tabIndex]
      // );
    },
    handleLikeChange(lastStatus) {
      if (lastStatus) {
        this.handleRemoveFavorite(this.musicPlayer.currentMusic);
      } else {
        this.handleAddFavorite(this.musicPlayer.currentMusic);
      }
      this.$toast(lastStatus ? "已取消收藏" : "收藏成功");
    },
    addEventListenerToAudio(target) {
      target.ondurationchange = () => {
        this.maxAudioProgress = target.duration;
      };
      target.ontimeupdate = () => {
        if (this.stopUpdateProgress) {
          return;
        }
        this.currentAudioProgress = target.currentTime;
      };
    },
    onAudioProgressChange(value) {
      this.audioPlayer.currentTime = value;
      if (!this.audioPlayer.paused) {
        return;
      }
      this.playMusic(
        () => this.audioPlayer.play(),
        _.identity,
        !this.musicPlaying
      );
    },
    handleDragStart() {
      this.stopUpdateProgress = true;
    },
    handleDragEnd() {
      this.stopUpdateProgress = false;
    },
    togglePlayList() {
      this.playListVisible = !this.playListVisible;
    },
    closePlayList() {
      this.playListVisible = false;
    },
    playMusic(playAction, musicsAction, nextPlayingStatus, delayTime = 300) {
      setTimeout(() => playAction(), delayTime);
      musicsAction();

      this.musicPlaying = nextPlayingStatus;
      this.closePlayList();
      setCurrentMusicId(this.musicPlayer.currentMusic.id);
    },
    togglePlay() {
      if (!this.musicPlayer.currentMusic) {
        return;
      }

      const playerAction = {
        true: () => this.audioPlayer.pause(),
        false: () => this.audioPlayer.play()
      }[this.musicPlaying];

      this.playMusic(() => playerAction(), _.identity, !this.musicPlaying);
    },
    playByPlayList(music) {
      if (music === this.musicPlayer.currentMusic) {
        return;
      }

      if (this.playListKey !== this.musicPlayer.musics.key) {
        this.handlePlayListChange(this.playListKey);
      }

      this.playMusic(
        () => this.audioPlayer.play(),
        () => this.musicPlayer.play(music),
        true
      );
    },
    playBySwitcher(action) {
      if (!this.musicPlayer.currentMusic) {
        return;
      }

      const musicsAction = {
        next: () => this.musicPlayer.next(),
        prev: () => this.musicPlayer.prev()
      }[action];

      this.playMusic(() => this.audioPlayer.play(), () => musicsAction(), true);
    },
    handlePlayModeChange() {
      const nextMode = this.musicPlayer.nextPlayMode();
      this.playModeIcon = {
        ALL_REPEAT: "loop",
        SHUFFLE: "shuffle",
        REPEAT_ONCE: "single"
      }[nextMode];
      const modeName = {
        ALL_REPEAT: "顺序播放",
        SHUFFLE: "随机播放",
        REPEAT_ONCE: "单曲循环"
      };
      this.$toast(modeName[nextMode]);
    },
    handleAddFavorite(music) {
      music.isFavorite = true;
      findFavoriteMusicList(this.musicLists).add(music);
    },
    handleRemoveFavorite(music) {
      music.isFavorite = false;
      const favoriteMusicList = findFavoriteMusicList(this.musicLists);
      favoriteMusicList.remove(music);
      if (_.size(favoriteMusicList.musics) === 0) {
        this.handlePlayListChange(ALL_MUSIC_LIST_KEY);
        this.playListKey = ALL_MUSIC_LIST_KEY;
        this.playListTab = 0;
      }
    },
    handlePlayListChange(key) {
      const musicList = findMuiscList(this.musicLists, key);
      this.musicPlayer.changeMusicList(musicList);
      setCurrentMusicListKey(key);
    }
  },
  computed: {
    computePlayListMusics() {
      return _.find(this.musicLists, { key: this.playListKey }).musics;
    }
  }
};
</script>

<style lang="less" scoped>
</style>