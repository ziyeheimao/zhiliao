<template>
    <el-container>
      <el-header height='80px'>
        <Search></Search>
      </el-header>

      <el-container :style="'min-height:' + height + 'px;'" class="ctn">
        <el-aside :width="width > 1440 ? '200px' : '100px'" v-show="width > 992"></el-aside>

        <el-main class="paper-strip">

          <el-tabs v-model="type">
            <el-tab-pane label="个人信息" name="userInof">
              <UserInfo></UserInfo>
            </el-tab-pane>

            <el-tab-pane label="修改头像" name="userpic">
              <UserPic></UserPic>
            </el-tab-pane>
          </el-tabs>

        </el-main>

        <el-aside :width="width > 1440 ? '200px' : '100px'" v-show="width > 992"></el-aside>
      </el-container>
    </el-container>

</template>

<script>
import api from '@api'
// import main from '@main'
import Search from '../Modular/Search'
import UserInfo from './User-Info'
import UserPic from './User-Pic'

export default {
  components: {
    Search,
    UserInfo,
    UserPic
  },
  // props: [''],
  computed: {
    height () {
      return this.$store.getters.InnerSize.height - 80
    },
    width () {
      return this.$store.getters.InnerSize.width
    },
    RefreshUserInfo () {
      return this.$store.getters.RefreshUserInfo // 刷新用户信息
    }
  },
  data () {
    return {
      type: 'userInof'
    }
  },
  methods: {
    // 刷新
    getUserInfo () {
      api.getUserInfo().then(({data}) => {
        this.$store.dispatch('AUser', data.data)
        let user = JSON.stringify(data.data) // 对象转json字符串
        window.sessionStorage.setItem('user', user)
      })
    }
  },
  beforeCreate () {},
  created () {},
  beforeMount () {},
  mounted () {},
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {},
  deactivated () {},
  watch: {
    RefreshUserInfo () {
      this.getUserInfo()
    }
  }

}
</script>

<style lang='scss' scoped>
@import '@style/index.scss';
.ctn{
  padding: 0 15px;
}
.el-header{
  background-color: #fff;
  box-shadow: 2px 2px 5px #00000020;
  z-index: 2;
}
.el-container{
  background-color: #eee;
  z-index: 1;
}
.paper-strip{
  padding: 50px 0 20px;
}
.btn .el-button{
  width: 100%;
}

</style>
