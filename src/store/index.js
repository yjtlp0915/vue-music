import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // state相当于一个仓库，用来存数据
  // state是关键字，不能改
  state:{
    //记录播放列表
    playList:[],
    //记录播放器是否全屏
    fullScreen:false,
    //记录播放状态
    playing:false,
    //当前播放的列表索引
    currentIndex:-1,
    //定义播放模式（顺序播放定义为0，随机播放为1，单曲循环为2）
    mode:0
  },
  //用getters代替state库存储数据,因为它可以计算返回当前播放歌曲的信息
  getters:{
    playList:state => state.playList,
    fullScreen:state => state.fullScreen,
    playing:state => state.playing,
    currentIndex:state => state.currentIndex,
    //计算返回当前播放歌曲的索引信息
    currentSong:(state) => {
      return state.playList[state.currentIndex] || {}
    },
    //计算返回当前歌曲的播放模式
    mode:state => state.mode,
  },
  //改变state库里的各种东西的状态（在player文件夹下的index.vue里调用）
  mutations:{
    changePlayList(state,playList){
      state.playList = playList
    },
    changeFullScreen(state,fullScreen){
      state.fullScreen = fullScreen
    },
    changePlaying(state,playing){
      state.playing = playing
    },
    changeCurrentIndex(state,currentIndex){
      state.currentIndex = currentIndex
    },
    changeMode(state,mode){
      state.mode = mode
    }
  },
  actions:{
    //定义一个addPlayer方法，来触发mutations里面的所有方法
    addPlayer({commit},{list,index}){
      commit('changePlayList',list); //list是值
      commit('changeFullScreen',true);
      commit('changePlaying',true);
      commit('changeCurrentIndex',index);
    },
    //删除播放列表中的歌的方法
    delOne({commit,state},item){
      let index = 0;
      let playlist = state.playList;
      let currentIndex = state.currentIndex;
      for(let j=0;j<playlist.length;j++){
        if(playlist[j].id == item.id){
          index = j;
        }
      }
      playlist.splice(index,1);
      if(currentIndex == playlist.length){
        currentIndex--;
      }
      commit('changePlayList',playlist);
      commit('changePlaying',true);
      commit('changeCurrentIndex',currentIndex);
    },
    //清空播放列表中所有歌曲
    clear({commit}){
      commit('changePlayList',[]);
      commit('changePlaying',false);
      commit('changeCurrentIndex',-1);
    }
  }
})