<!-- 搜索v-model="inputWord"双向绑定,当点击(给它绑定点击事件@click="hotName(item.k),然后在methods里面设置hotName(index){this.inputWord = index;}方法)热门搜索列表{{item.k}}里的名字时，input框里自动添加进去此名字 -->
<!-- 搜索页面 -->
<!-- 搜索页面 -->
<!-- 搜索页面 -->
<template>
  <div>
    <div class="container">
      <input type="text" placeholder="搜索歌曲、歌手" v-model="inputWord" @click="show" />
      <i class="iconfont icon-search"></i>
      <i class="iconfont icon-dismiss" @click="dismiss"></i>
    </div>
    <scroll class="search">
      <div>
        <!-- 热门搜索 -->
        <div class="hot-key" ref="hot_key">
          <p class="hot_s">热门搜索</p>
          <ul>
            <li v-for="item in hotkey" @click="hotName(item.k)" :key="item.key">{{item.k}}</li>
          </ul>
        </div>
        <!-- 搜索后显示的子页面 -->
        <div class="hotPage" ref="hotPage">
          <p v-for="(item,index) in songlist" :key="item.key" @click="addPlay(item,index)">{{item.name}} -- {{item.singer[0].name}}<i class="icon-music"></i></p>
        </div>

      </div>
      <!-- 正在加载效果 -->
      <div class="loading-container" v-show="isLoading">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
  import {getHotKey} from "@/api";
  import {search} from "@/api";
  import {mapActions} from "vuex";
  import Scroll from "@/components/scroll";
  import Loading from "@/components/loading";
  export default {
    data:function(){
      return{
        hotkey:[],
        inputWord:"",
        songlist:[],
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
    updated() {
      this.show()
    },
    methods:{
      getSlide:function(){
        getHotKey().then((res) => {
          console.log(res);
          //this.hotkey = res.data.hotkey;
          //选取热门搜索的前十个
          // slice(start,end) 方法可从已有的数组中返回选定的元素。
          this.hotkey = res.data.hotkey.slice(0, 10);
          this.isLoading = false;
        })
      },
      //双向绑定热门搜索的名字
      hotName(index){
        this.inputWord = index;
      },
      //当在input框搜索的时候
      show(){
        if(this.inputWord != ""){
          this.$refs.hot_key.style.display = "none";
          this.$refs.hotPage.style.display = "block";
        }else{
          this.$refs.hot_key.style.display="block";
          this.$refs.hotPage.style.display="none";
        }
      },
      //清空搜索框的内容
      dismiss(){
        this.inputWord = "";
      },
      // 搜索出来的歌曲数据信息
      addPlay(a,index){
        let songs=[]
        var item={
          //id
          id:a.id,
          //专辑id
          mid:a.mid,
          //歌曲名
          name:a.name,
          //专辑名
          album:a.album.name,
          //歌曲时长
          interval:a.interval,
          //专辑封面
          img:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${a.album.mid}.jpg?max_age=2592000`,
          //歌曲链接
          url:`http://dl.stream.qqmusic.qq.com/C400${a.mid}/${a.id}.m4a?guid=983915916&fromtag=66`,
          //歌手
          singername:a.singer[0].name
        }
        songs.push(item)
        this.addPlayer({
          list:songs,
          index:index
        })
      },
      ...mapActions([
        'addPlayer'
      ])
    },


    watch:{
      //监听搜索热门名字时出来的的数据
      inputWord(){
        this.p=1;   //显示一页
        this.n=20;  //任意搜索一个歌手，显示出来他的歌目录的数量
        //这里的search是数据库的名字
        search(this.inputWord,this.p,this.n).then((res)=>{
          console.log(res);
          //res.data.song.list打印出来的数据就是搜索相应的歌手或者歌曲弹出来对应的歌曲列表
          this.songlist = res.data.song.list;
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import url('~@/assets/less/variable.less');
  .search{
    position: fixed;
    width:100%;
    top:1.45rem;
    bottom: 0;
    overflow:hidden;
   }
  .container{
    width:90%;
    margin:0 auto;
    position: relative;
    input{
      padding:0 0 0 0.3rem;
      height:0.38rem;
      display: block;
      width:90%;
      border:0;
      outline: none;
      margin-top:0.1rem;
      border-radius:0.08rem;
      background:@color-highlight-background;
      font-size: @font-size-medium;
      color:@color-text-ll;
    }
    .icon-search{
      font-size: 0.26rem;
      color:@color-dialog-background;
      position: absolute;
      top: 0.07rem;
      margin-left:0.04rem;
    }
    .icon-dismiss{
      font-size: 0.2rem;
      color:@color-dialog-background;
      position: absolute;
      top: 0.085rem;
      right:0.04rem;
    }
  }
  .singer_list{
    display: flex;
    padding: 0.1rem 0;
    margin: 0 0.3rem;
    img{
      width:0.5rem;
      height:0.5rem;
      border-radius:50%;
    }
    .name{
      color:@color-text-l;
      line-height: 0.5rem;
      margin-left:0.2rem;
      font-size: @font-size-medium;
    }
  }
  .hot-key{
    margin: 0 0 0.2rem 0.2rem;
    .hot_s{
      color:@color-text-l;
      font-size: @font-size-medium;
      margin-top: 0.1rem;
      margin-bottom: 0.2rem;
    }
    ul{
      font-size: @font-size-medium;
      list-style: none;
      li{
        padding: 0.05rem 0.1rem;
        margin: 0 0.2rem 0.2rem 0;
        border-radius:0.06rem;
        display: inline-block;
        color:@color-text-l;
        background:@color-highlight-background;
      }
    }
  }
  // 搜索出来的歌曲目录页面样式
  .hotPage{
    display: none;
    width: 100%;
    height: 100%;
    font-size: @font-size-medium-x;
    p{
      position: relative;
      background: @color-background-d;
      color: @color-text-d;
      display: inline-block;
      width: 80%;
      height: 0.4rem;
      line-height:0.4rem;
      padding: 0 0 0 10%;
      margin: 0.02rem 5%;
      border-radius:0.1rem;
      .icon-music{
        position: absolute;
        left:0.05rem;
        top:0.12rem;
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
