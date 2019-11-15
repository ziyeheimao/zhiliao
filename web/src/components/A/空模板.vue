<template>
  <span></span>
</template>

<script>
// import api from '@api'
// import main from '@main'

export default {
  components: {
    // x
  },
  // props: [''],
  computed: {

  },
  data () {
    return {}
  },
  methods: {

  },
  beforeCreate () {},
  created () {},
  beforeMount () {},
  mounted () {},
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {},
  deactivated () {},
  beforeRouteEnter (to, from, next) {
    // do someting
    // 在渲染该组件的对应路由被 confirm 前调用
  },
  beforeRouteUpdate (to, from, next) {
    // do someting
    // 在当前路由改变，但是依然渲染该组件是调用
  },
  beforeRouteLeave (to, from, next) {
    // do someting
    // 导航离开该组件的对应路由时被调用
  },

  watch: {}

}
</script>

<style lang='scss' scoped>
@import '@style/index.scss';
</style>
