<!-- 这是头部公共文件 -->
<!-- 这是头部公共文件 -->
<!-- 这是头部公共文件 -->
<template>
  <div class="music-header">
    <span class="logo"></span>
    <h2 class="text">嘟唻咪音乐</h2>
    <router-link  to="/" class="mine">
      <i class="iconfont icon-mine"></i>
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

  // 头部样式
  .music-header{
    height:0.44rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size:@font-size-medium-x;
    .logo{
      width:0.32rem;
      height:0.32rem;
      background: url('timg.jpg');
      background-size: 100%;
      margin-right:0.09rem;
      border-radius:50%;
      //margin-bottom: 0.02rem;
    }
    .text{
      color:@color-theme;
    }
    .mine{
      position: absolute;
      right: 0;
      .icon-mine{
        display: block;
        padding: 0.12rem;
        font-size:@font-size-large-x;
        color: @color-theme;
      }
    }
  }
</style>
