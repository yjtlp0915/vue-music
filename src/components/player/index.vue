<!-- 音乐播放器 -->
<!-- 音乐播放器 -->
<template>
  <div class="player" v-show="playList.length > 0">
    <!-- transition用来增加大小屏页面切换时的动画效果 -->
    <transition name="normal">
      <!--播放页面全屏-->
      <div class="normal-player" v-show="fullScreen">
        <!--背景 模糊-->
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.img">
        </div>

        <!--顶部-->
        <div class="top">
          <!-- 绑定控制播放器大小屏的事件 -->
          <div class="back" @click="toggleFullScreen">
            <i class="icon-back"></i>
          </div>
          <!-- 播放歌曲的名字和歌手名字 -->
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle"><span v-for="a in currentSong.singer" :key="a.key">{{a.name}}</span></h2>
        </div>

        <!--中间cd部分-->
        <div class="middle swiper-container">
          <div class="swiper-wrapper">
            <div class="middle-l swiper-slide" ref="middleL">
              <div class="cd-wrapper" ref="cdWrapper">
                <!-- :class="cdState"绑定cd旋转的样式 -->
                <div class="cd" :class="cdState">
                  <img class="image" :src="currentSong.img">
                </div>
              </div>
              <!-- 一条歌词滚动 -->
              <div class="playing-lyric-wrapper">
                <div class="playing-lyric">{{currentLyc}}</div>
              </div>
            </div>

            <!--歌词滚动-->
            <scroll class="middle-r swiper-slide" ref="lyriclist">
              <div class="lyric-wrapper">
                <div ref="lyricLine" v-for="(item,index) in lyric.lines" :key="item.key">
                  <!-- lyric下面的lines是数据库中歌词数组的名字 -->
                  <p class="text" :class="{current:index==currentLine}">
                    {{item.txt}}
                  </p>
                </div>
              </div>
            </scroll>
          </div>
        </div>

        <!--底部按钮控制部分-->
        <div class="bottom">
          <!-- 自定义分页器样式和颜色 -->
          <div class="dot-wrapper">
            <span class="dot"></span>
          </div>

          <div class="progress-wrapper">
            <!-- 播放的开始时间 -->
            <span class="time time-l">{{playTime}}</span>
            <!-- 引入歌曲进度条组件-->
            <div class="progress-bar-wrapper">
              <!-- :percent="percent"绑定一个计算已播放时间和总时间的百分比的方法，传给这个进度条组件，再在components文件夹下的index.vue文件里接收 -->
              <!-- @percentChange="changeCurrentTime"是子组件（components文件夹下的index.vue文件）传给父组件的方法 -->
              <progressBar :percent="percent" @percentChange="changeProgressBar"></progressBar>
            </div>
            <!-- 播放的总时间 -->
            <span class="time time-r">{{songTime}}</span>
          </div>

          <div class="operators">
            <div class="icon i-left">
              <i :class="getMode" @click="onChangeMode"></i>
            </div>
            <!-- 点击播放上一曲 -->
            <div class="icon i-left">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <!-- 暂停/播放按钮 -->
            <div class="icon i-center">
              <i :class="btnState" @click="togglePlaying"></i>
            </div>
            <!-- 点击播放上一曲 -->
            <div class="icon i-right">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!--小屏幕状态-->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="toggleFullScreen">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.img" :class="cdState">
        </div>
        <div class="text">
          <h2 class="name">{{currentSong.name}}</h2> <!-- 这里的name是数据库里的歌名的数组名 -->
          <p class="desc"><span v-for="a in currentSong.singer" :key="a.key">{{a.name}}</span></p>
        </div>
        <div class="control">
          <!-- @click.stop禁止冒泡方法,禁止点击这里的暂停播放按钮时变成大屏 -->
          <i :class="btnState" @click.stop="togglePlaying"></i>
        </div>
        <div class="control">
          <!-- openList定义打开播放列表的事件 -->
          <i class="icon-playlist" @click.stop="openList"></i>
        </div>
      </div>
    </transition>
    <!-- 引入h5的原生播放器 -->
    <!-- @canplay和@error和@timeupdate都是audio固有的属性和事件 -->
    <audio :src="currentSong.url" ref="audio" @canplay="changeIsReady" @error="changeIsReady" @timeupdate="updateTime" @ended="ended"></audio>
    <!-- 引入播放列表组件 -->
    <!-- 绑定:isShow，传给子组件playList文件夹下的index.vue播放列表文件里 -->
    <!-- 绑定@changeShow，接收子组件传过来的changeShow方法 -->
    <play-list v-show="isOpenList" :isShow="isOpenList" @changeShow="closeList"></play-list>
  </div>
</template>

<script>
  import {mapGetters,mapMutations} from 'vuex';
  import {getLyric} from '@/api';
  import {Base64} from 'js-base64';
  import Lyric from 'lyric-parser';
  import progressBar from '@/components/progressBar/index.vue';
  import playList from '@/components/playList/index.vue';
  import Scroll from "@/components/scroll";
  import Swiper from "swiper";
  import "swiper/dist/css/swiper.min.css";
  export default {
    data(){
      return {
        // 播放连接加载状态
        isReady:false,
        // 当前播放时间
        currentTime:0,
        //歌词
        lyric:{},
        //当前播放的歌词
        currentLyc:"",
        //当前播放的是第几句歌词
        currentLine:0,
        //是否打开播放列表
        isOpenList:false,
      }
    },
    computed:{
      //根据播放状态判断cd是否旋转
      cdState(){
        // 如果是正在播放的状态，就加上class=play对应的旋转样式
        return this.playing ? 'play' : 'pause';
      },
      //根据播放状态来判断大屏幕播放的时候显示的是播放的按钮图标还是暂停的按钮图标
      btnState(){
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      //根据播放状态来判断小屏幕播放的时候显示的是播放的按钮图标还是暂停的按钮图标
      btnState(){
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      //开始播放时间转换
      playTime(){
        let t = this.currentTime / 60 | 0;
        let s = this.currentTime % 60 | 0;
        if(s.toString().length < 2){
          s = '0' + s
        }
        return `${t} : ${s}`;
      },
      //把歌曲时长秒转为分钟(因为数据库中的歌曲时长是秒)
      songTime(){
        // currentSong是index.js里面设置的，interval是数据库里的歌曲总时长的名字
        let t = this.currentSong.interval / 60 | 0; //或0是向下取整
        let s = this.currentSong.interval % 60 | 0;
        if(s.toString().length < 2){
          s = '0' + s
        }
        return `${t} : ${s}`;
      },
      //计算已播放时间和总时间的百分比（设置时间进度条）
      percent(){
        return this.currentTime / this.currentSong.interval
      },
      // 计算播放模式(通过判断，来显示这几种播放模式对应的图标,顺序播放定义为0，随机播放为1，单曲循环为2）)
      getMode(){
        switch(this.mode){
          case 0:
            return 'icon-sequence'
          break;
          case 1:
            return 'icon-random'
          break;
          case 2:
            return 'icon-loop'
          break;
        }
      },
      //获取播放状态(在store文件夹下index.js文件里设置的,通过mapGetters引入)
      //这里的...扩展运算符作用是将mapGetters里的多个对象合并为一个，以使我们可以将最终对象传给 computed属性（意思就是把mapGetters对象混入到computed对象中）
      ...mapGetters([
        'playing',
        'fullScreen',
        'playList',
        'currentSong',
        'currentIndex',
        'mode'
      ])
    },
    mounted(){
      this.$nextTick(() =>{
        var mySwiper = new Swiper ('.swiper-container', {
          // 自定义分页器样式和颜色,需要把下边style标签里的scoped去掉才能生效
          pagination: {
            el: '.dot-wrapper',
            bulletClass:"dot",
            bulletActiveClass:"active",
          },
          observer:true,
          observeParents:true
        })
      })
    },
    methods:{
      // 点击控制音乐的播放或暂停
      togglePlaying(){
        this.changePlaying(!this.playing);
        //歌词随着音乐的暂停、播放而暂停或播放（togglePlay()是固有的方法）
        this.lyric.togglePlay()
      },
      //更改大小屏状态
      toggleFullScreen(){
        this.changeFullScreen(!this.fullScreen)
      },
      //更改播放器是否加载完成,防止快速点击引起的报错
      changeIsReady(){
        this.isReady = true;
      },
      //点击播放上一首
      prev(){
        //判断isReady是true还是false
        if(!this.isReady){
          return
        }
        let index = this.currentIndex - 1;
        if(index == -1){
          index = this.playList.length - 1;
        }
        this.changeCurrentIndex(index);
        this.isReady = false;
        //判断点击上一首时，正在播放的按钮状态，如果是暂停的，就改为播放的按钮图片
        if(!this.playing){
          this.togglePlaying()
        }
      },
      //点击播放下一首
      next(){
        if(!this.isReady){
          return
        }
        let index = this.currentIndex + 1;
        if(index == this.playList.length){
          index = 0;
        }
        this.changeCurrentIndex(index);
        this.isReady = false;
        if(!this.playing){
          this.togglePlaying()
        }
      },
      // 设置进度条
      // 当播放器播放时获取当前的播放时间
      updateTime(ev){
        //console.log(ev)
        //ev.target.currentTime是数据库里的
        this.currentTime = ev.target.currentTime
      },
      //根据子组件传回来的百分比来计算当前需要播放的歌曲时间(改变进度条)
      changeProgressBar(ev){
        //进度条当前播放的时间=总时间*传回来的百分比值
        let t = this.currentSong.interval * ev;
        //让播放器当前播放时间等于t
        this.$refs.audio.currentTime = t;
        //如果当前播放状态是暂停的，任意拖动进度条到另一位置的时候，自动变为播放状态，
        if(!this.playing){
          this.togglePlaying();
        }
        //点击或滑动歌曲进度条，歌词随之滚动到相应的位置
        if (this.lyric) {
          this.lyric.seek(t * 1000)
        }
      },
      //获取歌词
      getLc(){
        getLyric(this.currentSong.id).then((res) => {
          //用Base64.decode可以转码成汉字,(lyric是数据库里歌词的名字,new Lyric是引用下载的vue的歌词解析器
          // console.log(new Lyric(Base64.decode(res.lyric)));
          this.lyric = new Lyric(Base64.decode(res.lyric),this.hanlder);
          if(this.lyric){
            this.lyric.play();
          }
        })
      },
      // 定义一个回调函数,配合new Lyric歌词下载器使用
      hanlder({lineNum,txt}){
        //console.log(lineNum) console.log(txt)
        //获取歌词
        this.currentLyc = txt;
        // 获取第几句歌词
        this.currentLine = lineNum;
        //通过判断，让歌词向上自动滚动
        if(lineNum > 5){
          let lineE1 = this.$refs.lyricLine[lineNum - 5];
          this.$refs.lyriclist.scrollToElement(lineE1,300);
        }else{
          this.$refs.lyriclist.scrollTo(0,0,300); //scrollTo() 方法可把内容滚动到指定的坐标。
        }
      },
      // 改变播放模式对应的按钮图标的函数(用取余的方法(this.mode + 1) % 3可以循环得到0、1、2三个值)
      onChangeMode(){
        let mode = (this.mode + 1) % 3;
        this.changeMode(mode);
      },
      // 播放完成后判断播放模式(ended()事件是H5中audio标签里固有的)
      ended(){
        if(this.mode == 0){
          this.next();
        }else if(this.mode == 1){
          this.next();
        }else if(this.mode == 2){
          this.loop();
        }
      },
      // 单曲循环函数
      loop(){
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
        this.lyric.seek(0);//seek函数作用是:移动文件的读取指针到指定位置
      },
      // 点击打开播放列表
      openList(){
        this.isOpenList = true;
      },
      //点击关闭播放列表
      closeList(val){
        this.isOpenList = val;
      },
      //调用store文件夹下的index.js文件里的Mutations对象里的changePlaying等各种方法
      ...mapMutations(["changePlaying","changeFullScreen","changeCurrentIndex","changeMode"])
    },
    watch:{
      // 监听播放歌曲的改变，点击上一首或下一首始终是播放状态
      currentSong(val){
        this.$nextTick(() => {
          this.$refs.audio.play();
          //切换歌曲时，让上一首歌词停止，从而可以播放当前的歌词
          if(this.lyric.lines){
            this.lyric.stop()
          }
          this.getLc();
        })
      },
      // 监听playing状态(是否正在播放),控制播放器的播放
      playing(val){
        // $nextTick是vue提供的一个延时方法（作用是等歌曲准备好了才会播放）
        this.$nextTick(() => {
          //如果val是true，就播放，是false，就暂停
          val ? this.$refs.audio.play() : this.$refs.audio.pause()
        })
      }
    },
    components:{
      progressBar,
      Scroll,
      playList
    }
  }

</script>

<style lang="less">
  @import '~@/assets/less/variable.less';
  .player{
    .normal-player{
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 150;
      background: @color-background;
      .background{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);
      }
      .top{
        position: relative;
        margin-bottom: 0.25rem;
        .back{
          position: absolute;
          top: 0;
          left: 0.06rem;
          z-index: 50;
          .icon-back{
            display: block;
            padding: 0.09rem;
            font-size: @font-size-large-x;
            color: @color-theme;
            transform: rotate(-90deg);
          }
        }
        .title{
          width: 70%;
          margin: 0 auto;
          line-height: 0.4rem;
          text-align: center;
          font-size: @font-size-large;
          color: @color-text;
        }
        .subtitle{
          line-height: 0.2rem;
          text-align: center;
          font-size: @font-size-medium;
          color: @color-text;
        }
      }
      .middle{
        position: fixed;
        width: 100%;
        top: 0.8rem;
        bottom: 1.7rem;
        white-space: nowrap;
        font-size: 0;
        .middle-l{
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper{
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            height: 100%;
            .cd{
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border: 0.1rem solid rgba(255, 255, 255, 0.1);
              border-radius: 50%;
              // cd中间的照片旋转样式
              &.play{
                // infinite意思是永久循环，rotate是动画的名称（见本文件最底部）
                animation: rotate 20s linear infinite;
              }
              &.pause{
                animation-play-state: paused;
              }
              .image{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
          }
          .playing-lyric-wrapper{
            width: 80%;
            margin: 0.3rem auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric{
              height: 0.2rem;
              line-height: 0.2rem;
              font-size: @font-size-medium;
              color: @color-theme;
            }
          }
        }
        .middle-r{
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper{
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text{
              line-height: 0.32rem;
              color: @color-text-l;
              font-size: @font-size-medium;
              //歌词滚动显示的颜色
              &.current{
                color:@color-theme;
              }
            }
          }
        }
      }
      .bottom{
        position: absolute;
        bottom: 0.3rem;
        width: 100%;
        //自定义swiper分页器的样式和颜色
        .dot-wrapper{
          text-align: center;
          font-size: 0;
          .dot{
            display: inline-block;
            vertical-align: middle;
            margin: 0 0.04rem;
            width: 0.08rem;
            height: 0.08rem;
            border-radius: 50%;
            background: @color-text-l;
            &.active{
              width: 0.2rem;
              border-radius: 0.05rem;
              background: @color-theme;
            }
          }
        }
        .progress-wrapper{
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0px auto;
          padding: 0.2rem 0 0 0;
          margin-bottom: -0.2rem;
          .time{
            color: @color-text;
            font-size: @font-size-small;
            flex: 0 0.1rem 0.1rem 0;
            width: 0.4rem;
            &.time-l{
              text-align: left;
            }
            &.time-r{
              text-align: right;
            }
          }
          .progress-bar-wrapper{
            flex: 1;
          }
        }
        .operators{
          height: 0.8rem;
          display: flex;
          align-items: center;
          .icon{
            flex: 1;
            color: @color-theme;
            &.disable{
              color: @color-theme-d;
            }
            i{
              font-size: 0.3rem;
            }
          }
          .i-left{
            text-align: right;
          }
          .i-center{
            padding: 0 0.2rem;
            text-align: center;
            i{
              font-size: 0.4rem;
            }
          }
          .i-right{
            text-align: left;
          }
          .icon-favorite{
            color: @color-sub-theme;
          }
        }
      }
      // 播放器大屏切换动画效果
      &.normal-enter-active, &.normal-leave-active{
        transition: all 0.4s;
        .top, .bottom{
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
        }
      }
      &.normal-enter, &.normal-leave-to{
        opacity: 0;
        .top{
          transform: translate3d(0, -1rem, 0);
        }
        .bottom{
          transform: translate3d(0, 1rem, 0);
        }
      }
    }
    .mini-player{
      display: flex;
      align-items: center;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 180;
      width: 100%;
      height: 0.6rem;
      background: @color-highlight-background;
      // 播放器小屏切换动画效果
      &.mini-enter-active, &.mini-leave-active{
        transition: all 0.4s;
      }
      &.mini-enter, &.mini-leave-to{
        opacity: 0;
      }
      .icon{
        display: flex;
        flex: 0 0 0.4rem;
        width: 0.4rem;
        padding: 0 0.1rem 0rem 0.2rem;
        img{
          border-radius: 50%;
          //margin-bottom: 0.15rem;
          &.play{
            animation: rotate 10s linear infinite;
          }
          &.pause{
            animation-play-state: paused;
          }
        }
      }
      .text{
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 0.2rem;
        overflow: hidden;
        .name{
          margin-bottom: 0.02rem;
          font-size: @font-size-medium;
          color: @color-text;
        }
        .desc{
          font-size: @font-size-small;
          color: @color-text-d;
        }
      }
      .control{
        display: flex;
        flex: 0 0 0.3rem;
        width: 0.3rem;
        padding: 0 0.1rem 0rem 0.05rem;
        .icon-play-mini, .icon-pause-mini, .icon-playlist{
          font-size: 0.3rem;
          color: @color-theme-d;
        }
        .icon-mini{
          font-size: 0.32rem;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
  }
  @keyframes rotate{
    0%{
      transform: rotate(0);
    }
    100%{
      transform: rotate(360deg);
    }
  }
</style>
