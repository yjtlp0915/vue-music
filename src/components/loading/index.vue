<!-- 正在loading...效果 -->
<template>
  <div class="loading">
    <img src="./loading.gif">
    <p class="desc">{{title}}</p>
  </div>
</template>
<script>
  export default {
    name:"loading",
    props:{
      title:{
        type: String,
        default: "正在努力加载中..."
      }
    }
  }
</script>
<style lang="less" scoped>
  @import url('~@/assets/less/variable.less');
  .loading{
    width:100%;
    text-align: center;
    margin-top:30%;
    img{
      width:0.3rem;
      height:0.3rem;
    }
    .desc{
      line-height: 0.2rem;
      font-size: @font-size-small;
      color:@color-text-l;
    }
  }
</style>
