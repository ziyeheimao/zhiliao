<template>
  <div class="logo">
    <img src="../../assets/img/logo1.png" alt="logo" height="50px" style="padding:5px 20px;" @click="toIndex">
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    toIndex () {
      if (this.$route.path === '/') return
      this.$router.push('/')
    }
  }
}
</script>
<style lang="scss" scoped>
.logo {
  cursor: pointer;
}
</style>
