<!-- 推荐页面主页 -->
<!-- 推荐页面主页 -->
<!-- 推荐页面主页 -->

<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" ref="scroll">
      <div>
        <!-- 图片轮播 -->
        <div class="swiper-container swiper_con">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="item in slider" :key=item.key>
              <img :src="item.picUrl" width="100%">
            </div>
          </div>
          <div class="swiper-pagination"></div>
        </div>
        <!-- 热门歌单推荐 -->
        <div class="hot_song">
          <p class="hot">热门歌单推荐</p>
          <div class="song_list" v-for="item in list" :key=item.key @click="detail(item.id)">
            <img :src="item.picUrl">
            <div class="song_txt">
              <p class="name">{{item.songListAuthor}}</p>
              <p class="title">{{item.songListDesc}}</p>
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
  import {getRecommend} from "@/api";
  import Scroll from "@/components/scroll";
  import Swiper from "swiper";
  import "swiper/dist/css/swiper.min.css";
  import Loading from "@/components/loading";
  import {myMixin} from "@/assets/js/mixin.js";
  export default {
    //mixins用来解决小屏播放器遮挡其他内容问题
    mixins:[myMixin],
    data:function(){
      return{
        slider:[],
        list:[],
        isLoading:true,
      }
    },
    created(){
      this.getSlide();
    },
    mounted(){
      var mySwiper = new Swiper ('.swiper_con', {
        pagination: {
          el: '.swiper-pagination',
          clickable :true,
        },
        autoplay: {
          // disableOnInteraction默认是true，如果设置为false，用户操作swiper之后自动切换不会停止，会重新自动播放
          disableOnInteraction: false,
          delay: 2000,
        },
        loop:true,
        observer:true,
        observeParents:true
      })
    },
    methods:{
      //引入assets文件夹下的js文件下的mixin文件里的方法（用来解决小屏播放器遮挡其他内容问题）
      watchPlayList(playList){
        if(playList.length > 0){
          this.$refs.recommend.style.bottom = "70px";
          this.$refs.scroll.refresh();
        }else{
          this.$refs.recommend.style.bottom = "0";
          this.$refs.scroll.refresh();
        }
      },
      getSlide:function(){
        getRecommend().then((res) => {
          console.log(res);
          this.slider = res.data.slider;
          this.list = res.data.songList;
          this.isLoading = false;
        })
      },
      //路由跳转到子页面
      detail(id){
        this.$router.push({path:`/recommend/${id}`});
      }
    },
    //创建scroll和loading组件
    components:{
      Scroll,
      Loading
    }
  }
</script>

<style lang="less" scoped>
  @import '~@/assets/less/variable.less';
  .recommend{
    position: fixed;
    width:100%;
    top:0.88rem;
    bottom: 0;
    .recommend-content{
      overflow:hidden;
      height:100%;
      .slide-wrapper{
        position: relative;
        overflow:hidden;
        width:100%;
      }
      .hot_song{
        font-size:@font-size-medium;
        color:@color-theme;
        .hot{
          height:0.24rem;
          width:100%;
          text-align:center;
          margin-top:0.1rem;
        }
        .song_list{
          display: flex;
          padding: 0.1rem 0;
          margin:0 0.2rem;
          img{
            width:0.6rem;
            height:0.6rem;
          }
          .song_txt{
            display: flex;
            flex-direction:column;
            justify-content:space-around;
            padding: 0 0.2rem;
            .name{
              color:@color-text;
            }
            .title{
              width:2rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              color:@color-text-d;
              font-size:@font-size-small;
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
      }
    }
  }
</style>
