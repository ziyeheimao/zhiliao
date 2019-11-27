<template>
  <el-container>
    <el-header class="title">
      <Logo></Logo>
      <Search></Search>
      <User></User>
    </el-header>

    <el-container class="ctn" :style="'min-height:'+height+'px;'">
      <el-aside :width="width > 1440 ? '200px' : '100px'" v-show="width > 992"></el-aside>
      <el-main style="background-color: #fff;">

        <!-- 模糊搜索到的用户列表 滚动容器 -->
        <el-container>
          <List @activate='listActivate'></List>
        </el-container>

        <el-container class="main">
          <!-- 一般屏幕左栏 -->
          <el-aside width="300px" v-if="width > 768">
            <Info :FindUserList='FindUserList' :activate='activate'></Info>
          </el-aside>

          <!-- 超小屏幕上栏 -->
          <el-header v-if="width <= 768" height='350px'>
            <Info :FindUserList='FindUserList' :activate='activate'></Info>
          </el-header>

          <!-- 纸条列表 & 粉丝 & 关注 -->
          <el-main :class="width <= 768 ? '' : 'xl-padding'">
            <PaperStrips v-if='activate !== -1 && FindUserList.length !== 0' :UserId='activate !== -1 ? FindUserList[activate].userId : ""'></PaperStrips>
          </el-main>
        </el-container>

      </el-main>
      <el-aside :width="width > 1440 ? '200px' : '100px'" v-show="width > 992"></el-aside>

    </el-container>
  </el-container>
</template>

<script>
// import api from '@api'
// import main from '@main'
import User from '../Modular/User'
import Logo from '../Modular/Logo'
import Search from './FindUser-Search'
import List from './FindUser-List'
import PaperStrips from './FindUser-PaperStrips'
import Info from './FindUser-Info'

export default {
  components: {
    User,
    Logo,
    List,
    Search,
    PaperStrips,
    Info
  },
  // props: [''],
  computed: {
    width () {
      return this.$store.getters.InnerSize.width
    },
    height () {
      return this.$store.getters.InnerSize.height - 60
    },
    FindUserList () {
      return this.$store.getters.FindUserList
    },
    User () {
      return this.$store.getters.User
    }
  },
  data () {
    return {
      width_: '',
      activate: 0
    }
  },
  methods: {
    // 子组件传来的参数
    listActivate (data) {
      this.activate = data
    }
  },
  beforeCreate () {},
  created () {
    this.width_ = this.width
  },
  beforeMount () {},
  mounted () {},
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {},
  deactivated () {},
  watch: {
    width () {
      // 跨越超小屏幕 768 阈值时刷新当前页面
      if ((this.width_ > 768 && this.width <= 768) || (this.width_ <= 768 && this.width > 768)) {
        this.$router.push('/blank')
        setTimeout(() => {
          this.$router.go(-1)
        }, 500)
      }
      this.width_ = this.width
    }
  }

}
</script>

<style lang='scss' scoped>
@import '@style/index.scss';

.title{
  @include flex-between-center;
  background-color: #fff;
  box-shadow: 2px 2px 5px #00000020;
  z-index: 2;
}
.ctn{
  background-color: #eee;
  z-index: 1;
}

.main{
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #ddd;
}

// 大屏幕下取消纸条列表右补丁
.xl-padding{
  padding-right: 0;
}
</style>
