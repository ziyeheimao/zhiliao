// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import filters from './filters' // 自定义过滤器
// 引入store
import store from './store'
// 引用elment-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// #在main.js定义自定义指令
Vue.directive('highlight', function (el) {
  let blocks = el.querySelectorAll('pre code')
  blocks.forEach((block) => {
    // eslint-disable-next-line no-undef
    hljs.highlightBlock(block)
  })
})

Object.keys(filters).forEach(k => Vue.filter(k, filters[k])) // 调用过滤器

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
