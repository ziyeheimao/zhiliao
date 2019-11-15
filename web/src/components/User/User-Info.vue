<template>
  <el-form :model="form" :rules="rules" ref="form">
    <el-form-item prop="userName">
      <el-input clearable placeholder="昵称" v-model="form.userName" @blur="checkUserNamePhoneEmail(form.userName, 'userName')"></el-input>
    </el-form-item>

    <el-form-item prop="email">
      <el-input clearable placeholder="电子邮箱" v-model="form.email" @blur="checkUserNamePhoneEmail(form.email, 'email')" :disabled='true'></el-input>
    </el-form-item>

    <el-form-item prop="password">
      <el-input clearable placeholder="密码" v-model="form.password" show-password></el-input>
    </el-form-item>

    <el-form-item prop="sex">
      <el-radio-group v-model="form.sex">
        <el-radio :label="0">保密</el-radio>
        <el-radio :label="1">男</el-radio>
        <el-radio :label="2">女</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item class="btn">
      <el-button type='primary' @click="setUserInfo('form')">保 存</el-button>
    </el-form-item>
  </el-form>
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
    User () {
      return this.$store.getters.User
    }
  },
  data () {
    return {
      form: {
        userName: '',
        email: '',
        password: '',
        sex: 0
      },
      rules: {
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
        ],
        isUserName: true,
        isEmail: true
      }

    }
  },
  methods: {
    init () {
      this.form.userName = this.User.userName
      this.form.email = this.User.email
      this.form.sex = this.User.sex
    },

    // 修改个人信息
    setUserInfo: async function (form) {
      await this.checkUserNamePhoneEmail(this.form.userName, 'userName')
      await this.checkUserNamePhoneEmail(this.form.email, 'email')
      await this._setUserInfo(form)
    },
    _setUserInfo: async function (form) {
      this.$refs[form].validate(valid => {
        if (valid * this.rules.isUserName * this.rules.isEmail) {
          api.setUserInfo(this.form).then(({data}) => {
            main.msg(data.code, data.msg)
          })
        }
      })
    },

    // 检测 昵称 手机 邮箱 是否已被占用
    checkUserNamePhoneEmail (value, type) {
      if (value === '') return
      return new Promise((resolve, reject) => {
        let data = { field: value, userId: this.User.userId }
        api.checkUserNamePhoneEmail(data, 1).then(({data}) => {
          if (main.msg(data.code, data.msg)) {
            switch (type) {
              case 'userName':
                this.rules.isUserName = true
                break
              case 'email':
                this.rules.isEmail = true
                break
            }
          } else {
            switch (type) {
              case 'userName':
                this.rules.isUserName = false
                break
              case 'email':
                this.rules.isEmail = false
                break
            }
          }
          resolve()
        })
      })
    }
  },
  beforeCreate () {},
  created () {
    this.init()
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
//
.el-form{
  text-align: center;
  margin-top: 50px;
}
.el-form-item{
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
}
</style>
