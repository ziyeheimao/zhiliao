<template>
  <el-container>
    <el-header height='80px'>
      <Search></Search>
    </el-header>

    <el-container :style="'min-height:' + height + 'px;'">
      <el-aside width="200px" v-show="width > 992"></el-aside>

      <el-main>
        <Ctn></Ctn>
      </el-main>

      <el-aside width="200px" v-show="width > 992"></el-aside>
    </el-container>
  </el-container>
</template>

<script>
// import api from '@api'
// import main from '@main'
import Search from './List-search'
import Ctn from './List-Ctn'

export default {
  components: {
    Search,
    Ctn
  },
  // props: [''],
  computed: {
    height () {
      return this.$store.getters.InnerSize.height - 80
    },
    width () {
      return this.$store.getters.InnerSize.width
    }
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
  watch: {}

}
</script>

<style lang='scss' scoped>
@import '@style/index.scss';
.el-header{
  background-color: #fff;
  box-shadow: 2px 2px 5px #00000020;
  z-index: 2;
}
.el-container{
  background-color: #eee;
  z-index: 1;
}
</style>
