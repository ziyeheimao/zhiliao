<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {

    }
  },
  methods: {
    // 节流
    throttle () {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.innerSizeCount()
      }, 300)
    },

    // 文档可视区尺寸
    innerSizeCount () {
      let size = { // 内容区域尺寸
        width: window.innerWidth,
        height: window.innerHeight
      }
      this.$store.commit('SInnerSize', size)
    }
  },
  created () {
    this.innerSizeCount()
  },
  mounted () {
    window.onresize = () => {
      this.throttle()
    }
  }
}
</script>

<style>
</style>
