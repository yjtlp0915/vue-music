<!-- 播放列表 -->
<!-- 播放列表 -->
<!-- 播放列表 -->
<template>
  <transition name="list-fade">
    <div class="playlist" ref="playlist" v-show="isShow">
      <div class="list-wrapper">
        <div class="list-header">
          <h1 class="title">
            <i class="icon"></i>
            <span class="text">{{modeTxt}}</span>
            <span class="clear" @click='clearALL'>
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll class="list-content" ref='listContent'>
          <transition  name="list">
            <ul>
              <li class="item" ref="listItem" v-for='(item,index) in playList' :key='item.key' @click="changeSong(index)">
                <i class="current" :class="currentClass(item)"></i>
                <span class="text">{{item.name}}</span>
                <span class="like">
                  <i></i>
                </span>
                <span class="delete" @click.stop='del(item)'>
                  <i class="icon-delete"></i>
                </span>
              </li>
            </ul>
          </transition>
        </scroll>
        <div class="list-operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click='close'>
          <span>关闭</span>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import Scroll from "@/components/scroll";
  import {mapGetters,mapMutations,mapActions} from 'vuex'
  import { MessageBox } from 'mint-ui';
  export default {
    // 接收父组件传的值
    props:{
      isShow:{
        type:Boolean,
        default:false
      }
    },
    // 重新刷新加载播放列表
    updated(){
      this.$refs.listContent.refresh();
    },
    computed:{
      modeTxt(){
        switch (this.mode) {
          case 0:
            return '顺序播放';
            break;
          case 1:
            return '随机播放';
            break;
          case 2:
            return '单曲循环';
            break;
        }
      },
      ...mapGetters(['mode','playList','currentSong'])
    },
    methods:{
      // 播放列表中的哪个歌曲正在播放，就给它前边加上播放的小图标
      currentClass(item){
        return item.id == this.currentSong.id ? 'icon-play' : '';
      },
      //切换播放列表中歌曲
      changeSong(index){
        this.changeCurrentIndex(index);
        // if(index > 5){
        //   let line1 = this.$refs.listItem[index - 5];
        //   this.$refs.listContent.scrollToElement(line1,300);
        // }else{
        //   this.$refs.listContent.scrollTo(0,0,300);
        // }
      },
      //关闭播放列表页面
      close(){
        // 把changeShow方法传给父级(player文件夹下的index.vue)
        this.$emit('changeShow',false)
      },
      //删除播放列表中的歌曲
      del(item){
        this.delOne(item);
      },
      //清空播放列表中全部的歌曲
      clearALL(){
        //加上弹窗警告
        MessageBox.confirm('确定清空列表?').then(() => {
          this.clear();
          this.close();
        })
      },
      //调用store文件夹下的index.js文件里的Mutations对象和actions对像里的changeCurrentIndex等各种方法
      ...mapMutations(["changeCurrentIndex"]),
      ...mapActions(["delOne","clear"])
    },
    components:{
      Scroll,
    },
  }
</script>
<style scoped lang='less'>
  @import '~@/assets/less/variable.less';
  @import url("//unpkg.com/mint-ui/lib/style.css");
  .playlist{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: @color-background-d;
    &.list-fade-enter-active, &.list-fade-leave-active{
      transition: opacity 0.3s;
      .list-wrapper{
        transition: all 0.3s;
      }
    }
    &.list-fade-enter, &.list-fade-leave-to{
      opacity: 0;
      .list-wrapper{
        transform: translate3d(0, 100%, 0);
      }
    }
    .list-wrapper{
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      background-color: @color-highlight-background;
      .list-header{
        position: relative;
        padding: 0.1rem 0.3rem 0.1rem 0.2rem;
        .title{
          display: flex;
          align-items: center;
          .icon{
            margin-right: 0.1rem;
            font-size: 0.3rem;
            color: @color-theme-d;
          }
          .text{
            flex: 1;
            font-size: @font-size-medium;
            color: @color-text-l;
          }
          .clear{
            display: flex;
            .icon-clear{
              font-size: @font-size-medium;
              color: @color-text-d;
            }
          }
        }
      }
      .list-content{
        max-height: 2.4rem;
        overflow: hidden;
        .item{
          display: flex;
          align-items: center;
          height: 0.4rem;
          padding: 0 0.3rem 0 0.2rem;
          overflow: hidden;
          &.list-enter-active, &.list-leave-active{
            transition: all 0.1s;
          }
          &.list-enter, &.list-leave-to{
            height: 0;
          }
          .current{
            flex: 0 0 0.2rem;
            width: 0.2rem;
            font-size: @font-size-small;
            color: @color-theme-d;
          }
          .text{
            flex: 1;
            font-size: @font-size-medium;
            color: @color-text-d;
          }
          .like{
            margin-right: 15px;
            font-size: @font-size-small;
            color: @color-theme;
            .icon-favorite{
              color: @color-sub-theme;
            }
          }
          .delete{
            font-size: @font-size-small;
            color: @color-theme;
          }
        }
      }
      .list-operate{
        width: 1.5rem;
        margin: 0.1rem auto 0.1rem auto;
        .add{
          display: flex;
          align-items: center;
          padding: 0.08rem 0.16rem;
          border: 1px solid @color-text-l;
          border-radius: 1rem;
          color: @color-text-l;
          .icon-add{
            margin-right: 0.05rem;
            font-size: @font-size-small-s;
          }
          .text{
            font-size: @font-size-small;
          }
        }
      }
      .list-close{
        text-align: center;
        line-height: 0.4rem;
        background: @color-background;
        font-size: @font-size-medium-x;
        color: @color-text-l;
      }
    }
  }
</style>
