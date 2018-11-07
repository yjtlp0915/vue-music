import {
  mapGetters
} from 'vuex'
export const myMixin = {
  computed: {
    ...mapGetters(["playList"])
  },
  mouted() {
    this.watchPlayList(this.playList);
  },
  activated() {
    this.watchPlayList(this.playList);
  },
  watch: {
    playList(val) {
      this.watchPlayList(val);
    }
  },
  methods: {
    watchPlayList() {
      console.log("请添加watchPlayList方法")
    }
  }
}