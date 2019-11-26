<template>
  <el-container>
    <el-header>
      <Logo></Logo>

      <User class="user"></User>
    </el-header>

    <el-main class="ctn">
      <div class="search-box">
        <div class="logo">
          <img src="../../assets/img/logo2.png" alt="logo" height="65px">
        </div>

        <Search></Search>
      </div>

      <div class="news"
        :style="'height:' + (width < 768 ? height - 25 : width < 1280 ? height - 70 : height - 100) + 'px;' +
        (width < 768 ? 'padding: 25px 0 0;' : width < 1280 ? 'padding: 50px 20px 20px;' : 'padding: 80px 15% 20px;')">

        <div class="change">
          <el-link type="primary" @click="random = !random">换一换</el-link>
        </div>

        <!-- 首页推荐列表 -->
        <News :random='random'></News>
      </div>
    </el-main>
  </el-container>
</template>

<script>
// import api from '@api'
// import main from '@main'
import Search from './Index-search'
import News from './Index-news'
import User from '../Modular/User'
import Logo from '../Modular/Logo'

export default {
  components: {
    Search,
    News,
    User,
    Logo
  },
  // props: [''],
  computed: {
    height () {
      return this.$store.getters.InnerSize.height - 60 - 220
    },
    width () {
      return this.$store.getters.InnerSize.width
    }
  },
  data () {
    return {
      random: false
    }
  },
  methods: {},
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
// 用户
.el-header{
  @include flex-between-center;
  box-shadow: 2px 2px 5px #00000020;
  background-color: #fff;
  position: relative;
  z-index: 2;
}

.ctn{
  position: relative;
  z-index: 1;
  @include scrollHidden;

  &>.search-box{
    padding-top: 50px;
    position: relative;
    z-index: 2;

    &>.logo{
      text-align: center;
      font-size: 1.8rem;
    }
  }

    // 新闻列表
  & > .news{
    position: relative;
    z-index: 1;
    & > .change{
      padding: 0 10px 15px;
      text-align: right;
    }
  }
}
</style>
