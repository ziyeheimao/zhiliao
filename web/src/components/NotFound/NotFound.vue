<template>
  <div class="ctn" :style="'width:'+width+'px;height:'+height+'px;'"></div>
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
    InnerSize () {
      return this.$store.getters.InnerSize
    },
    width () {
      return this.InnerSize.width
    },
    height () {
      return this.InnerSize.height
    }
  },
  data () {
    return {}
  },
  methods: {},
  beforeCreate () {},
  created () {
    setTimeout(() => {
      this.$router.push('/')
    }, 3000)
  },
  beforeMount () {},
  mounted () {},
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {},
  deactivated () {},
  watch: {}
}
</script>

<style lang='scss' scoped>
@import '@style/index.scss';
.ctn{
  background-image: url("../../assets/img/404.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 80%;
}
</style>
