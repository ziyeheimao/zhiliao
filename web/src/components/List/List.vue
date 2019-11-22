<template>
  <el-container>
    <el-header height='80px' class="a">
      <Search></Search>
    </el-header>

    <el-container :style="'min-height:' + height + 'px;'">
      <el-aside :width="width > 1440 ? '200px' : '100px'" v-show="width > 992"></el-aside>

      <el-main>
        <Ctn></Ctn>
        <Backtop>
          <div style="{
            height: 40px; width: 40px;
            text-align: center; line-height: 40px; color: #1989fa;
            background-color: #f2f5f6; box-shadow: 0px 0px 6px #00000070;
            border: 1px solid #eee; border-radius: 50%; font-size: 2rem; }">
            <i class="el-icon-caret-top"></i>
          </div>
        </Backtop>
      </el-main>

      <el-aside :width="width > 1440 ? '200px' : '100px'" v-show="width > 992"></el-aside>
    </el-container>
  </el-container>
</template>

<script>
// import api from '@api'
// import main from '@main'
import Search from '../Modular/Search'
import Ctn from './List-Ctn'
import Backtop from '../MyUI/Backtop'

export default {
  components: {
    Search,
    Ctn,
    Backtop
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
