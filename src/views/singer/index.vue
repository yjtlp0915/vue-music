<!-- 歌手页面数据传送 -->

<template>
  <div class="singer">
    <!-- 父组件给子组件传值：titlle，用props接收 -->
    <singer-list :list="list"></singer-list>
  </div>
</template>
<script>
  import {getSingerList} from "@/api"
  import SingerList from '@/components/singerlist'
  export default {
    data() {
      return {
        list:[] //从数据库获取list的数据,传送给components文件夹下面的singlist文件夹里的index.vue
      }
    },
    created(){
      this.getSlide()
    },
    methods: {
      getSlide:function(){
        getSingerList().then((res) =>{
          console.log(this.newSinger(res.data.list));
          this.list = this.newSinger(res.data.list);
        })
      },
      newSinger(list){
        // 定义热门的数据对象
        let nList={
          hot:{
            title:"热门",
            item:[]
          }
        }
        list.forEach((item,index)=>{
          //取前十条数据作为热门数据
          if(index<10){
            nList.hot.item.push({
              // id:item.Fsinger_mid和name:item.Fsinger_name和img都是数据内容
              id:item.Fsinger_mid,
              name:item.Fsinger_name,
              img:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
            })
          }
          //通过姓名首字母定义数据x(薛之谦是热门第一位，首字母是x)，Findex在数据里对应的值是x
          if(!nList[item.Findex]){
            nList[item.Findex]={
              title:item.Findex,
              item:[]
            }
          }
          nList[item.Findex].item.push({
            id:item.Fsinger_mid,
            name:item.Fsinger_name,
            img:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
          })
        });
        //把对象转成有序数组
        let hot =[];
        let other=[];
        for(var k in nList){
          if(nList[k].title =="热门"){
            hot.push(nList[k])
          }else if(nList[k].title.match(/[a-zA-Z]/)){ //如果不是热门，就按姓名首字母排列
            other.push(nList[k])
          }
        }
        //把热门和非热门按顺序排列
        other.sort((a,b)=>{
          return a.title.charCodeAt(0)-b.title.charCodeAt(0);
        })
        return hot.concat(other);
      }
    },
    components:{
      SingerList
    }
  }
</script>
<style lang="less" scoped>
  .singer{
    position:fixed;
    bottom:0;
    top:0.88rem;
    width:100%;
  }
</style>

