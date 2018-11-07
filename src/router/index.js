import Vue from 'vue'
import Router from 'vue-router'

import Recommend from '@/views/recommend/recommend.vue'
import RecommendDetail from '@/views/recommend/detail.vue'
import Singer from '@/views/singer/index.vue'
import SingerDetail from '@/views/singer/detail.vue'
import Ranking from '@/views/ranking/ranking.vue'
import RankingDetail from '@/views/ranking/detail.vue'
import Search from '@/views/search/search.vue'

//配置路由
Vue.use(Router)
export default new Router({
  routes: [
    {
      path:'/',
      redirect:"/recommend" //重定向到推荐页面
    },
    //推荐页面路由
    {
      path:'/recommend',
      component:Recommend,
      children:[
        {
          path:'/recommend/:id',
          component:RecommendDetail
        }
      ]
    },
    //歌手页面路由
    {
      path: '/singer',
      component: Singer,
      children:[
        {
          path:'/singer/:id',
          component:SingerDetail
        }
      ]
    },
    //排行页面路由
    {
      path: '/ranking',
      component: Ranking,
      children:[
        {
          path:'/ranking/:id',
          component:RankingDetail
        }
      ]
    },
    //搜索页面路由
    {
      path: '/search',
      component: Search,
    },
  ]
})
