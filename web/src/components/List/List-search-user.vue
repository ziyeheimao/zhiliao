<template>
  <div class="user">
    <el-avatar :size="45" :src="userPic"></el-avatar>

    <ul>
      <li>登录 / 注册</li>
      <li>个人中心</li>
      <li>发布纸条</li>
      <li>安全退出</li>
    </ul>
  </div>
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

  },
  data () {
    return {
      userPic: '../../../static/img/userPic.png',
      a: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
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
.user {
  box-sizing: border-box;
  padding-top: 2px;
  position: relative;
  height: 50px;
  cursor: pointer;
  width: 120px;
  text-align: center;
  & > ul {
    display: none;
    padding: 5px 0;
    width: 120px;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 3px 3px 7px #00000040;
    position:absolute;
    top: 50px;
    background-color: #fff;
    & > li {
      padding: 5px 10px;
      font-size: 1.2rem;
    }
    & > li:hover{
      background-color: rgb(119, 187, 255);
      color: #fff;
    }
    & > li ~ li {
      border-top: 1px solid #eee;
    }
  }
}
.user:hover > ul{
  display: block;
}
</style>
