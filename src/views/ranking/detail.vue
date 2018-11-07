<!-- 排行页面子页面巅峰榜详情页面 -->
<!-- 和推荐页面的子页面公用样式，不同的是数据接口getRankInfo(this.$route.params.id) -->
<template>
  <!-- 增加左边滑出动画效果 -->
  <transition name="slide">
    <music-list :title="title" :bgUrl="bgUrl" :songList="songList"></music-list>
  </transition>
</template>
<script>
  import MusicList from "@/components/musiclist";
  import {getRankInfo} from "@/api";
  export default {
    data(){
      return{
        title:"",
        bgUrl:"",
        songList:[]
      }
    },
    created(){
      this.getRankInfoList()
    },
    methods:{
      getRankInfoList(){
        getRankInfo(this.$route.params.id).then(res => {
          console.log(res);
          let nSong = [];
          for(var i in res.songlist){
            nSong.push(res.songlist[i].data)
          }
          //title,bgUrl,songList:的值由数据库得到
          this.title = res.topinfo.ListName;
          this.bgUrl = res.topinfo.pic_album;
          this.songList = this.editSongs(nSong);
        })
      },
      // 定义一个editSongs方法来处理,然后在上边调用
      editSongs(list){
        let nSongList = [];
        for(let i=0;i<list.length;i++){
          // 获取数据库里面的歌曲相关信息
          let item = {
            // 下边list[i]点后边的songid等名字都是数据库里的名字
            //歌曲的ID
            id:list[i].songid,
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