<template>
  <a href="#" @click="to" class="Backtop">
    <slot></slot>
  </a>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    to () {
      try {
        // 在这里运行代码
        // document.querySelector(this.props).scrollIntoView(true)
        document.scrollIntoView(true)
      } catch (err) {
        // if (err) { throw err } // 在这里处理错误
      }
    }
  },
  props: {
    target: {type: String, default: ''}
  }
}
</script>

<style lang="scss" scoped>
.Backtop{
  position: fixed;
  z-index: 2000;
  bottom: 20px;
  right: 20px;
}
</style>
