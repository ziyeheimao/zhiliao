<template>
  <div class="user">
    <el-avatar :size="45" :src="userPic"></el-avatar>

    <ul>
      <li v-if="!Token" @click="dialogVisible = true">登录 / 注册</li>
      <li v-if="Token" @click="to(1)">个人中心</li>
      <li v-if="Token" @click="to(2)">发布纸条</li>
      <li v-if="Token" @click="clearCache">安全退出</li>
    </ul>

    <el-dialog
      :visible.sync="dialogVisible"
      width="650px"
      append-to-body>

      <el-tabs v-model="activeName">
        <!-- 登录 -->
        <el-tab-pane label="登录" name="login">

          <el-form :model="loginForm" :rules="rules" ref="rules">
            <el-form-item prop="field">
              <el-input clearable placeholder="昵称 / 邮箱" v-model="loginForm.field" @keyup.native="keyup($event)"></el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input clearable placeholder="密码" v-model="loginForm.password" show-password @keyup.native="keyup($event)"></el-input>
            </el-form-item>
          </el-form>

        </el-tab-pane>

        <!-- 注册 -->
        <el-tab-pane label="注册" name="reg">

          <el-form :model="regForm" :rules="rules" ref="rules">
            <el-form-item prop="userName">
              <el-input clearable placeholder="昵称" v-model="regForm.userName" @keyup.native="keyup($event)"></el-input>
            </el-form-item>

            <el-form-item prop="email">
              <el-input clearable placeholder="邮箱" v-model="regForm.email" @keyup.native="keyup($event)">
                <el-button slot="append">获取验证码</el-button>
              </el-input>
            </el-form-item>

            <el-form-item prop="verificationCode">
              <el-input clearable placeholder="验证码" v-model="regForm.verificationCode" @keyup.native="keyup($event)"></el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input clearable placeholder="密码" v-model="regForm.password" show-password @keyup.native="keyup($event)"></el-input>
            </el-form-item>
          </el-form>

        </el-tab-pane>

        <!-- 忘记密码 -->
        <el-tab-pane label="忘记密码" name="forgetPassword">

          <el-form :model="forgetPasswordFrom" :rules="rules" ref="rules">
            <el-form-item prop="email">
              <el-input clearable placeholder="邮箱" v-model="forgetPasswordFrom.email" @keyup.native="keyup($event)">
                <el-button slot="append">获取验证码</el-button>
              </el-input>
            </el-form-item>

            <el-form-item prop="verificationCode">
              <el-input clearable placeholder="验证码" v-model="forgetPasswordFrom.verificationCode" @keyup.native="keyup($event)"></el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input clearable placeholder="密码" v-model="forgetPasswordFrom.password" show-password @keyup.native="keyup($event)"></el-input>
            </el-form-item>
          </el-form>

        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@api'
import main from '@main'

export default {
  components: {
    // x
  },
  // props: [''],
  computed: {
    Token () {
      return this.$store.getters.Token
    },
    User () {
      return this.$store.getters.User
    },
    userPic () {
      return this.$store.getters.User.userPic ? this.$store.getters.User.userPic : '../../../static/img/userPic.png'
    }
  },
  data () {
    return {
      dialogVisible: false, // 登录窗口
      activeName: 'login',
      time: null,

      // 登录
      loginForm: {
        field: '箫',
        password: '4869'
      },
      // 注册
      regForm: {
        userName: '',
        email: '',
        verificationCode: '',
        password: '4869'
      },
      // 忘记密码
      forgetPasswordFrom: {
        email: '',
        verificationCode: '',
        password: '4869'
      },

      // 表单验证
      rules: {
        field: [
          { required: true, message: '昵称/邮箱不可为空', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '昵称不可为空', trigger: 'blur' },
          { min: 1, max: 20, message: '昵称在1到20位之间', trigger: 'blur' }
        ],
        email: [
          // eslint-disable-next-line no-useless-escape
          { pattern: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/, message: '请输入正确的邮箱格式' },
          { required: true, message: '邮箱不可为空', trigger: 'blur' }
        ],
        verificationCode: [
          { required: true, message: '验证码不可为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不可为空', trigger: 'blur' },
          { min: 1, max: 20, message: '密码在1到20位之间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    to (type) {
      if (type === 1) {
        this.$router.push('/user')
      } else if (type === 2) {
        this.$router.push('/paperStrip')
      }
    },
    // 按回车
    keyup (e) {
      if (e.keyCode === 13) {
        this.submit()
      }
    },
    submit () {
      if (this.activeName === 'login') {
        this.login()
      } else if (this.activeName === 'reg') {
        this.reg()
      } else if (this.activeName === 'forgetPassword') {
        this.forgetPassword()// 忘记密码
      }
    },
    // 登录
    login () {
      clearTimeout(this.time)
      this.time = setTimeout(() => {
        api.login(this.loginForm).then(({data}) => {
          if (data.code === 0) {
            let token = data.token
            window.sessionStorage.setItem('token', token)
            this.$store.dispatch('AToken', token)

            this.$store.dispatch('AUser', data.data)
            let user = JSON.stringify(data.data) // 对象转json字符串
            window.sessionStorage.setItem('user', user)

            this.dialogVisible = false
          } else main.openWarningInfo(data.msg)
        })
      }, 300)
    },
    // 注册
    reg () {
      clearTimeout(this.time)
      this.time = setTimeout(() => {

      }, 300)
    },
    // 忘记密码
    forgetPassword () {},

    // 退出登录 清除缓存
    clearCache () {
      sessionStorage.clear() // 清除缓存
      this.$store.commit('SToken', '')
      this.$store.commit('SUser', '')
      if (this.$route.path !== '/' && this.$route.path !== '/index') this.$router.push('/')
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
