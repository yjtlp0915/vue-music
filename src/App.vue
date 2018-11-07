<template>
  <div id="app">
    <!-- 公共头部组件 -->
    <music-header></music-header>
    <!-- 导航栏选项卡公共组件 -->
    <tabs></tabs>
    <!-- 路由页面,加入了淡入淡出效果
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>-->
    <router-view></router-view>
    <!-- 播放器公共组件 -->
    <player></player>
  </div>
</template>

<script>
  // 引入头部公共组件
  import MusicHeader from "@/components/musicHeader/index.vue"
  // 引入导航栏选项卡公共组件
  import tabs from "@/components/tabs/index.vue"
  // 引入播放器公共组件
  import Player from "@/components/player/index.vue"
  export default {
    components:{
      MusicHeader,
      tabs,
      Player
    }
  }
</script>

<style lang="less">
  // 导入less文件，加~号意思是 直接在当前目录下找
  @import '~@/assets/less/index.less';
  /*.fade-enter{
    opacity:0;
  }
  .fade-leave{
    opacity:1;
  }
  .fade-enter-active{
    transition:0.2s;
  }
  .fade-leave-active{
    opacity:0;
    transition:0.2s;
  }*/
</style>



