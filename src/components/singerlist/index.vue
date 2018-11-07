<!-- 歌手页面主页 -->
<!-- 歌手页面主页 -->
<!-- 歌手页面主页 -->
<template>
<div class="singer" ref="singer">
  <!-- :listenScroll=true :probeType=3是scroll文件夹下的index.vue文件里的值 -->
  <scroll class="list-view" ref="listView" @scroll="scroll" :listenScroll=true :probeType=3>
    <!-- 左侧 -->
    <ul class="container">
      <li class="list-group" ref="listGroup" v-for="a in list" :key="a.key">
        <h2 class="list-group-title">{{a.title}}</h2>
        <ul>
          <li class="list-group-item" v-for="b in a.item" :key="b.key" @click="detail(b.id)">
            <img alt="" class="avatar" :src="b.img">
            <span class="name">{{b.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!--右侧通过字母快速定位列表-->
    <!-- @touchstart="touchStart"添加手指点击事件 -->
    <div class="list-shortcut" @touchstart="touchStart" @touchmove.stop.prevent="touchMove">
      <ul>
        <li class="item" v-for="(c,index) in touchList" :key='c.key' :data-index="index" :class="{current:currentIndex == index}">{{c}}</li>
      </ul>
    </div>
    <!-- 正在加载动画效果 -->
    <div class="loading-container" v-show="isLoading">
        <loading></loading>
    </div>
  </scroll>
  <router-view></router-view>
</div>

</template>

<script>
  import Scroll from '@/components/scroll';
  import Loading from "@/components/loading";
  import {myMixin} from "@/assets/js/mixin.js";
  export default {
    //mixins用来解决小屏播放器遮挡其他内容问题
    mixins:[myMixin],
    // 从views文件夹下的singer文件夹里的index.vue文件接收list值
    props:{
      list:{
        type:Array,
        default:[]
      }
    },
    data(){
      return {
        //建立一个对象存储第一次手指触摸右边字母列的位置及index
        touch:{},
        //记录当前显示的是右边第几个字母
        currentIndex:0,
        listHeight:[],
        //记录需要滚动的页面区域高度，默认为0
        scrollY:0,
        isLoading:true
      }
    },
    components:{
      Scroll,
      Loading
    },
    updated () {
      this.getLiHeight();
      this.isLoading = false;
    },
    computed: {
      touchList(){
      let arr = [];
      for(let i=0; i<this.list.length;i++){
        //截取右边字母list[i].title的首字母
        arr.push(this.list[i].title.substring(0,1));
      }
      return arr;
      }
    },
    methods:{
      //引入assets文件夹下的js文件下的mixin文件里的方法（用来解决小屏播放器遮挡其他内容问题）
      watchPlayList(playList){
        if(playList.length > 0){
          this.$refs.singer.style.bottom = "90px";
          this.$refs.listView.refresh();
        }else{
          this.$refs.singer.style.bottom = "0";
          this.$refs.listView.refresh();
        }
      },
      //手指点击事件函数
      touchStart(ev){
        //获取手指点击的那个li的下标
        let cIndex = ev.target.attributes['data-index'].value;
        //手指触摸时记录右边字母列当前的index还有位置
        this.touch.index = cIndex;
        this.touch.y1 = ev.touches[0].pageY;
        this.scrollTo(cIndex);
      },
      //手指在右边字母列滑动事件函数
      touchMove(ev){
        //手指在滑动时也要记录滑动的位置
        this.touch.y2 = ev.touches[0].pageY;
        //计算滑动的距离经过几个li，向下取整(自行百度Math.floor 和 | 0)
        let aIndex = (this.touch.y2 - this.touch.y1) / 18 | 0;
        let cIndex = aIndex + parseInt(this.touch.index) ;
        this.scrollTo(cIndex);
      },
      scrollTo(index){
        this.scrollY = -this.listHeight[index];
        //左边的scroll也跳转至点击的cIndex
        this.$refs.listView.scrollToElement(this.$refs.listGroup[index],0);
      },
      //获取需要滚动的页面区域高度
      scroll(pos){
        this.scrollY = pos.y;
      },
      //获取所有li单独的高度
      getLiHeight(){
        const list = this.$refs.listGroup;
        let height = 0;
        this.listHeight.push(height)
        for(let i=0;i<list.length;i++){
          height += list[i].clientHeight;
          this.listHeight.push(height);
        }
      },
      //路由跳转到子页面
      detail(id){
        this.$router.push({path:`/singer/${id}`});
      }
    },
    watch:{
      scrollY(v){
        //顶端
        if(v>0){
          this.currentIndex = 0
          return
        }
        //中间
        for(let i=0;i<this.listHeight.length;i++){
          let h1 = this.listHeight[i]
          let h2 = this.listHeight[i+1]
          //v是负数
          if(-v >= h1 && -v < h2){
            this.currentIndex = i
              return
          }
        }
        //底下
        this.currentIndex = this.listHeight.length
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/less/variable.less";
  .singer{
    position: fixed;
    width: 100%;
    top:0.88rem;
    bottom:0;
  .list-view{
    height:100%;
    overflow: hidden;
    background: @color-background;
    .container{
      .list-group{
        padding-bottom: 0.2rem;
        .list-group-title{
          height: 0.3rem;
          line-height: 0.3rem;
          padding-left: 0.2rem;
          font-size:@font-size-small;
          color: @color-text-l;
          background: @color-highlight-background;
        }
        .list-group-item{
          display: flex;
          align-items: center;
          padding: 0.2rem 0 0 0.3rem;
          .avatar{
            width: 0.5rem;
            height: 0.5rem;
            border-radius: 50%;
          }
          .name{
            margin-left: 0.2rem;
            color: @color-text-l;
            font-size: @font-size-medium;
          }
        }
      }
    }
    .list-shortcut{
      position: absolute;
      z-index: 30;
      right: 0;
      top: 45%;
      transform: translateY(-50%);
      width: 0.2rem;
      padding: 0.2rem 0;
      border-radius: 0.1rem;
      text-align: center;
      background: @color-background-d;
      font-family: Helvetica;
      .item{
        padding: 0.03rem;
        line-height: 1;
        color: @color-text-l;
        font-size: @font-size-small;
        //点击到哪个字母，哪个字母变成color: @color-theme;的颜色
        &.current{
          color: @color-theme;
        }
      }
    }
    .list-fixed{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      .fixed-title{
        height: 0.3rem;
        line-height: 0.3rem;
        padding-left: 0.2rem;
        font-size: @font-size-small;
        color: @color-text-l;
        background: @color-highlight-background;
      }
    }
    .loading-container{
      position: absolute;
      width: 100%;
      top: 20%;
      transform: translateY(-50%);
    }
  }
  }
</style>
