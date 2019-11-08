<template>
  <el-container>
    <el-header style="outline: 1px solid #bbf;">
      <div>用户模块</div>
    </el-header>

    <el-main>
      <div class="search-box">
        <div class="logo">知了</div>

        <Search></Search>
      </div>

      <div class="newList" :style="'height:' + height + 'px;'">
        <!-- 首页推荐列表 -->
      </div>
    </el-main>
  </el-container>
</template>

<script>
// import api from '@api'
// import main from '@main'
import Search from './Index-search'

export default {
  components: {
    Search
  },
  // props: [''],
  computed: {
    height () {
      return this.$store.getters.InnerSize.height - 80 - 40 - 60 - 50
    }
  },
  data () {
    return {
    }
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
.logo{
  text-align: center;
  font-size: 1.8rem;
}
.search-box{
  padding-top: 50px;
}
// 新闻列表
.newList{
  // border: 1px solid red;
}
// 用户
.el-header{
  // border: 1px solid red;
}
</style>
