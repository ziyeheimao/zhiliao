<template>
  <el-container>
    <el-header>
      <div class="logo">
        <img src="../../assets/img/logo1.png" alt="logo" height="50px" style="padding-left:20px;">
      </div>
      <User class="user"></User>
    </el-header>

    <el-main>
      <div class="search-box">
        <div class="logo">
          <img src="../../assets/img/logo2.png" alt="logo" height="65px">
        </div>

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
import User from '../Modular/User'

export default {
  components: {
    Search,
    User
  },
  // props: [''],
  computed: {
    height () {
      return this.$store.getters.InnerSize.height - 60 - 220
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
.search-box > .logo{
  text-align: center;
  font-size: 1.8rem;
}
.search-box{
  padding-top: 50px;
}

// 用户
.el-header{
  @include flex-between-center;
  box-shadow: 2px 2px 5px #00000020;
  background-color: #fff;
}

// 新闻列表
.newList{
  // border: 1px solid red;
}

</style>
