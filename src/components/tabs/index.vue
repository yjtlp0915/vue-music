<!-- 这是选项卡公共文件 -->
<!-- 这是选项卡公共文件 -->
<!-- 这是选项卡公共文件 -->

<template>
  <div class="tabs">
    <router-link to="/recommend">
      <span class="tabs_txt">推荐</span>
    </router-link>
    <router-link to="/singer">
      <span class="tabs_txt">歌手</span>
    </router-link>
    <router-link to="/ranking">
      <span class="tabs_txt">排行</span>
    </router-link>
    <router-link to="/search">
      <span class="tabs_txt">搜索</span>
    </router-link>
  </div>
</template>

<script>
  export default {
    data(){
      return{}
    }
  }
</script>

<style lang="less" scoped>
  /* 引入assert文件夹下面的less文件夹里颜色和字体规范样式文件 */
  @import url('~@/assets/less/variable.less');
  // 导航栏样式
  .tabs{
    height:0.25rem;
    margin-top: 0.1rem;
    display: flex;
    justify-content: space-around;
    font-size:@font-size-medium;
    a{
      color:@color-text-l; //引入variable里规范的颜色
      line-height: 0.26rem;
      &.router-link-active{ //点击哪个路由，就给它加上active的黄色样式
        color:@color-theme;
        border-bottom:2px solid;
      }
    }

  }
</style>
