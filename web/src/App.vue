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
    // 文档可视区尺寸
    innerSizeCount () {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        let size = { // 内容区域尺寸
          width: window.innerWidth,
          height: window.innerHeight
        }
        this.$store.commit('SInnerSize', size)
      }, 100)
    }
  },
  created () {
    this.innerSizeCount()
  },
  mounted () {
    window.onresize = () => {
      this.innerSizeCount()
    }
  }
}
</script>

<style>
</style>
