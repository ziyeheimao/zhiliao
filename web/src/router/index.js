import Vue from 'vue'
import store from '@store/index.js'

import Router from 'vue-router'

// 路由懒加载
// 测试
const Test = resolve => {
  require.ensure(['@components/Test/Test.vue'], () => {
    resolve(require('@components/Test/Test.vue'))
  })
}

// 首页
const Index = resolve => {
  require.ensure(['@components/Index/Index.vue'], () => {
    resolve(require('@components/Index/Index.vue'))
  })
}

// List
const List = resolve => {
  require.ensure(['@components/List/List.vue'], () => {
    resolve(require('@components/List/List.vue'))
  })
}

// 详情页
const Details = resolve => {
  require.ensure(['@components/Details/Details.vue'], () => {
    resolve(require('@components/Details/Details.vue'))
  })
}
// 用户中心
const User = resolve => {
  require.ensure(['@components/User/User.vue'], () => {
    resolve(require('@components/User/User.vue'))
  })
}

// 猜你喜欢
const PaperStrip = resolve => {
  require.ensure(['@components/PaperStrip/PaperStrip.vue'], () => {
    resolve(require('@components/PaperStrip/PaperStrip.vue'))
  })
}

// // 友情链接
// const Links = resolve => {
//   require.ensure(['@components/Links/Links.vue'], () => {
//     resolve(require('@components/Links/Links.vue'))
//   })
// }

// // 关于本站
// const About = resolve => {
//   require.ensure(['@components/About/About.vue'], () => {
//     resolve(require('@components/About/About.vue'))
//   })
// }

// // 在线留言
// const Message = resolve => {
//   require.ensure(['@components/Message/Message.vue'], () => {
//     resolve(require('@components/Message/Message.vue'))
//   })
// }

// 404
const NotFound = resolve => {
  require.ensure(['@components/NotFound/NotFound.vue'], () => {
    resolve(require('@components/NotFound/NotFound.vue'))
  })
}

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/test', // 测试接口
      name: 'Test',
      component: Test
    },
    // {
    //   path: '/inlet',
    //   name: 'Inlet',
    //   component: Inlet
    // },
    // {
    //   path: '/login',
    //   redirect: '/inlet' // 重定向到入口页面
    // },
    {
      path: '/',
      component: Index,
      meta: {
        // requiresAuth: true
      }
    },
    {
      path: '/index',
      name: 'Index',
      component: Index,
      meta: {
        // requiresAuth: true
      }
    },
    {
      path: '/list',
      name: 'List',
      component: List,
      meta: {
        // requiresAuth: true
      }
    },
    {
      path: '/details',
      name: 'Details',
      component: Details,
      meta: {
        // requiresAuth: true
      }
    },
    {
      path: '/user',
      name: 'User',
      component: User,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/paperStrip',
      name: 'PaperStrip',
      component: PaperStrip,
      meta: {
        requiresAuth: true
      }
    },
    // {
    //   path: '/recommend',
    //   name: 'Recommend',
    //   component: Recommend,
    //   meta: {
    //     requiresAuth: true
    //   }
    // },
    // {
    //   path: '/links',
    //   name: 'Links',
    //   component: Links,
    //   meta: {
    //     requiresAuth: true
    //   }
    // },
    // {
    //   path: '/about',
    //   name: 'About',
    //   component: About,
    //   meta: {
    //     requiresAuth: true
    //   }
    // },
    // {
    //   path: '/message',
    //   name: 'Message',
    //   component: Message,
    //   meta: {
    //     requiresAuth: true
    //   }
    // },
    {
      path: '/404',
      name: 'NotFound',
      component: NotFound
    },
    {
      path: '*', // 此处需特别注意置于最底部
      redirect: '/404'
    }
  ]
})

// 注册全局钩子用来拦截导航
router.beforeEach((to, from, next) => {
  // 获取store里面的token
  let token = store.state.Token
  // 判断要去的路由有没有requiresAuth
  if (to.meta.requiresAuth) {
    if (token) {
      next()
    } else {
      next({
        path: '/',
        query: { redirect: to.fullPath } // 将刚刚要去的路由path（却无权限）作为参数，方便登录成功后直接跳转到该路由
      })
    }
  } else {
    next()
  }
})

export default router
