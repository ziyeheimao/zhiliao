<template>
<div id="wraper" class="wraper">
  Scroll down to see the bottom-right button.
  <Backtop target="wraper"></Backtop>
  <h1>滚动内容部分</h1>
  <h1>滚动内容部分</h1>
  <h1>滚动内容部分</h1>
  <h1>滚动内容部分</h1>
  <h1>滚动内容部分</h1>
  <h1>滚动内容部分</h1>
  <h1>滚动内容部分</h1>
  <h1>滚动内容部分</h1>
  <h1>滚动内容部分</h1>
  <h1>滚动内容部分</h1>
  <h1>滚动内容部分</h1>
  <h1>滚动内容部分</h1>
  <h1>滚动内容部分</h1>
  <h1>滚动内容部分</h1>
  <h1>滚动内容部分</h1>
  <h1>滚动内容部分</h1>
  <h1>滚动内容部分</h1>
  <h1>滚动内容部分</h1>
  <h1>滚动内容部分</h1>
  <h1>滚动内容部分</h1>
  <h1>滚动内容部分</h1>
  <h1>滚动内容部分</h1>
  <h1>滚动内容部分</h1>
  <h1>滚动内容部分</h1>
  <h1>滚动内容部分</h1>
</div>

</template>

<script>
// import api from '@api'
// import main from '@main'
import Backtop from '../MyUI/Backtop'

export default {
  components: {
    Backtop
  },
  // props: [''],
  computed: {

  },
  data () {
    return {
      ctnData: `
        <style>
          a {
            color: ctnData
          }
        </style>
        <pre>222222222222222233333333333333</pre>
        <var>123</var>
        <code>456
        </code>
      `
    }
  },
  methods: {
  },
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
  },
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {},
  deactivated () {},
  // beforeRouteEnter (to, from, next) {
  //   // do someting
  //   // 在渲染该组件的对应路由被 confirm 前调用
  //   console.log('beforeRouteEnter', to, from, next)
  // },
  // beforeRouteUpdate (to, from, next) {
  //   // do someting
  //   // 在当前路由改变，但是依然渲染该组件是调用
  //   console.log('beforeRouteUpdate', to, from, next)
  // },
  // beforeRouteLeave (to, from, next) {
  //   console.log('beforeRouteLeave', to, from, next)
  //   // do someting
  //   // 导航离开该组件的对应路由时被调用
  // },
  watch: {}
}
</script>

<style lang='scss' scoped>
@import '@style/index.scss';
</style>
