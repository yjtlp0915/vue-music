<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <!-- @touchstart,@touchMove,@touchend绑定进度条拖拽、手指移动、手指离开事件，这些都是h5中的属性 -->
      <div class="progress-btn-wrapper" ref="progressBtn" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        touch:{}
      }
    },
    // 接收父级的传值
    props:{
      percent:{
        type:Number,
        default:0
      }
    },
    // 然后监听时间进度条的百分比percent的变化
    watch:{
      percent(val){
        console.log(val)
        //防止拖拽进度条弹回
        if(this.touch.s){
          return;
        }
        //获取进度条的总宽度
        let w = this.$refs.progressBar.clientWidth - 16;  //16是progress-btn的宽度
        //总宽度乘以百分比
        let offset = w * val;
        //this.$refs.progress.style.width = `${offset}px`;
        //this.$refs.progressBtn.style.transform = `translate3d(${offset}px,0,0)`;
        this._offect(offset); //封装调用函数同理
      }
    },
    methods:{
      //给进度条设置点击事件（到这一步，点进度条又会跳回去）
      //获取当前点击进度条的位置距屏幕左边的距离，减去进度条距左边的距离，就等于进度条应该跳到的位置
      progressClick(event){
        let w = event.pageX - this.$refs.progressBar.offsetLeft;
        //this.$refs.progress.style.width = `${w}px`;
        //this.$refs.progressBtn.style.transform = `translate3d(${w}px,0,0)`;
        this._offect(w);
        this._sendPercent();
      },
      //重新计算进度条百分比然后传给父组件（到这一步，点进度条不让它跳回去，而且歌也调到点击的时间播放）
      _sendPercent(){
        let barW = this.$refs.progressBar.clientWidth - 16;
        let p = this.$refs.progress.clientWidth / barW;
        //用$emit()方法把重新计算的进度条百分比传给父组件
        this.$emit("percentChange",p)
      },
      //手指拖拽进度条效果
      touchStart(ev){
        //console.log(ev)
        this.touch.s = true;
        //touches时打印出来的数据里的
        //记录手指拖拽进度条时的初始位置
        this.touch.x1 = ev.touches[0].pageX;
        //记录已播放进度条的宽度
        this.touch.w = this.$refs.progress.clientWidth;
      },
      touchMove(ev){
        //判断拖拽进度条的距离
        this.touch.x2 = ev.touches[0].pageX;
        if(this.touch.x2 > this.$refs.progressBar.clientWidth +  this.$refs.progressBar.offsetLeft){
          this.touch.x2 = this.$refs.progressBar.clientWidth + this.$refs.progressBar.offsetLeft;
        }
        if(this.touch.x2 < this.$refs.progressBar.offsetLeft){
          this.touch.x2 = this.$refs.progressBar.offsetLeft;
        }
        //计算偏移量
        let pianX = this.touch.x2 - this.touch.x1 + this.touch.w;
        this._offect(pianX);
      },
      touchEnd(){
        this.touch.s = false;
        this._sendPercent();
      },
      //封装函数
      _offect(i){
        this.$refs.progress.style.width = `${i}px`;
        this.$refs.progressBtn.style.transform = `translate3d(${i}px,0,0)`;
      },
    }
  }
</script>

<style lang="less" scoped>
  @import '~@/assets/less/variable.less';
  .progress-bar{
    height:0.3rem;
    .bar-inner{
      position: relative;
      top:0.13rem;
      height:0.04rem;
      background: rgba(0,0,0,0.3);
      .progress{
        position: absolute;
        height:100%;
        background:@color-theme
      }
      .progress-btn-wrapper{
        position: absolute;
        left:-0.08rem;
        top:-0.13rem;
        width:0.3rem;
        height:0.3rem;
        .progress-btn{
          position: relative;
          top:0.07rem;
          left:0.07rem;
          box-sizing: border-box;
          width:0.16rem;
          height:0.16rem;
          border-radius:50%;
          border:0.03rem solid @color-text;
          background:@color-theme;
        }
      }
    }
  }
</style>