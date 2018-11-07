<!-- 歌单详情--随机播放全部页面数据处理 -->
<!-- 歌单详情--随机播放全部页面数据处理 -->
<!-- 歌单详情--随机播放全部页面数据处理 -->
<template>
  <!-- 增加左边滑出动画效果 -->
  <transition name="slide">
    <!-- 父组件给子组件传值：title、bgUrl、songlist值在detail.vue文件里用props接收 -->
    <music-list :title="title" :bgUrl="bgUrl" :songList="songList"></music-list>
  </transition>
</template>
<script>
  //引用推荐页面的子页面作为公共样式
  import MusicList from "@/components/musiclist";
  //引入数据接口

  import {getCdInfo} from "@/api";
  export default {
    data(){
      return{
        title:"",
        bgUrl:"",
        songList:[]
      }
    },
    created(){
      this.getCdInfoList()
    },
    methods:{
      getCdInfoList(){
        getCdInfo().then(res => {
          console.log(res)
          //title,bgUrl,songList:的值由数据库得到
          this.title = res.data.cdlist[0].dissname
          this.bgUrl = res.data.cdlist[0].logo
          //这里接收下边的editSongs方法处理过的新数据
          this.songList = this.editSongs(res.data.cdlist[0].songlist)
        })
      },
      // 数据库里的songList数组里没有歌曲播放连接，所以这里需要处理一下数据
      // 定义一个editSongs方法来处理，然后在上边调用
      editSongs(list){
        let nSongList = [];
        for(let i=0;i<list.length;i++){
          // 获取数据库里面的歌曲相关信息
          let item = {
            // 下边list[i]点后边的songid等名字都是数据库里的名字(在data下的cdlist下的songlist里)
            //歌曲的ID
            id:list[i].songid, //在musiclist文件夹下的index.vue文件里把songList数据库的值传给了list
            //mid--歌词信息
            mid:list[i].songmid,
            //歌曲名字
            name:list[i].songname,
            //专辑名字
            album:list[i].albumname,
            //歌曲时间长度
            interval:list[i].interval,
            // 专辑封面(老师给拼接的连接)
            img:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${list[i].albummid}.jpg?max_age=2592000`,
            //歌曲链接
            url:`http://dl.stream.qqmusic.qq.com/C400${list[i].songmid}/${list[i].songid}.m4a?guid=983915916&fromtag=66`,
            // 歌手
            singer:list[i].singer
          }
          // 然后再把item里的所有东西添加到nSongList里面
          nSongList.push(item);
        }
        return nSongList;
      }
    },
    components:{
      MusicList
    }
  }
</script>

<style lang="less" scoped>
  .slide-enter-active,.slide-leave-active{
    transition:all 0.5s;
  }
  .slide-enter,.slide-leave-to{
    transform:translate3d(100%,0,0);
  }
</style>