<!-- 排行页面主页 -->
<!-- 排行页面主页 -->
<!-- 排行页面主页 -->
<template>
  <div class="rank" ref="rank">
    <scroll class="content" ref="scroll">
      <div>
        <div class="top_list" v-for="item in topList" @click="detail(item.id)" :key=item.key>
          <img :src="item.picUrl">
          <div class="s_l">
            <div class="song_list" v-for="(_item,index) in item.songList">
              <p>{{index+1}} &nbsp;{{_item.songname}} {{_item.singername}}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- 正在加载效果 -->
      <div class="loading-container" v-show="isLoading">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
  // import axios from "axios";
  import {getRankList} from "@/api";
  import Scroll from "@/components/scroll";
  import Loading from "@/components/loading";
  import {myMixin} from "@/assets/js/mixin.js";
  export default {
    //mixins用来解决小屏播放器遮挡其他内容问题
    mixins:[myMixin],
    data:function(){
      return{
        topList:{},
        isLoading:true,
      }
    },
    created(){
      this.getSlide();
    },
    components:{
      Scroll,
      Loading
    },
    methods:{
      //引入assets文件夹下的js文件下的mixin文件里的方法（用来解决小屏播放器遮挡其他内容问题）
      watchPlayList(playList){
        if(playList.length > 0){
          this.$refs.rank.style.bottom = "60px";
          this.$refs.scroll.refresh();
        }else{
          this.$refs.rank.style.bottom = "0";
          this.$refs.scroll.refresh();
        }
      },
      getSlide:function(){
        getRankList().then((res) => {
          console.log(res);
          this.topList = res.data.topList;
          this.isLoading = false;
        })
      },
      //路由跳转到子页面
      detail(id){
        this.$router.push({path:`/ranking/${id}`});
      }
    },
  }
</script>
<style lang="less" scoped>
  @import url('~@/assets/less/variable.less');
  .rank{
    position: fixed;
    width:100%;
    top:0.88rem;
    bottom: 0;
    .content{
      overflow:hidden;
      height:100%;
      .top_list{
        display: flex;
        padding: 0.1rem 0;
        margin: 0 0.2rem ;
        img{
          width:1rem;
          height:1rem;
        }
        .s_l{
          display: flex;
          flex-direction:column;
          justify-content:space-around;
          background:@color-highlight-background;
          .song_list{
            width:1.8rem;
            p{
              overflow:hidden;
              text-overflow:ellipsis;
              white-space:nowrap;
              color:@color-text-l;
              margin-left:0.2rem;
              font-size: @font-size-medium;
            }
          }
        }
      }
    }
  }
  .loading-container{
    position: absolute;
    width:100%;
    top:50%;
    transform: translateY(-50%);
    height:100%;
    background: #222;
  }
</style>
