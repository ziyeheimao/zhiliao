<template>
  <section>
    <el-container>
      <el-header height='80px'>
        <Search></Search>
      </el-header>

      <el-container :style="'min-height:' + height + 'px;'" class="ctn">
        <el-aside :width="width > 1440 ? '200px' : '100px'" v-show="width > 992"></el-aside>

        <el-main class="paper-strip">
          <el-form :model="form" :rules="rules" ref="form">

            <el-form-item prop="title">
              <el-input clearable placeholder="标题" v-model="form.title"></el-input>
            </el-form-item>

            <el-form-item prop="content">
              <el-input clearable placeholder="记录你的生活 分享你的快乐~" v-model="form.content"
                type='textarea' :rows="20"></el-input>
            </el-form-item>

            <el-form-item prop="keyword">
              <el-input clearable placeholder="关键词 多个时可用空格隔开" v-model="form.keyword"></el-input>
            </el-form-item>

            <el-form-item class="btn">
              <el-button type='primary' @click="releasePaperStrip('form')">发 布</el-button>
            </el-form-item>
          </el-form>
        </el-main>

        <el-aside :width="width > 1440 ? '200px' : '100px'" v-show="width > 992"></el-aside>
      </el-container>
    </el-container>
  </section>

</template>

<script>
import api from '@api'
import main from '@main'
import Search from '../Modular/Search'

export default {
  components: {
    Search
  },
  // props: [''],
  computed: {
    height () {
      return this.$store.getters.InnerSize.height - 80
    },
    width () {
      return this.$store.getters.InnerSize.width
    },
    User () {
      return this.$store.getters.User
    }
  },
  data () {
    return {
      rules: {
        title: [
          { required: true, message: '标题不可为空', trigger: 'blur' },
          { min: 1, max: 64, message: '标题在1到64位之间', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '内容不可为空', trigger: 'blur' }
        ],
        keyword: []
      },
      form: {
        userName: '',
        title: '',
        content: '',
        keyword: ''
      }
    }
  },
  methods: {
    // 发帖
    releasePaperStrip (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.form.userName = this.User.userName
          api.releasePaperStrip(this.form).then(({data}) => {
            if (main.msg(data.code, data.msg)) {
              this.form.title = ''
              this.form.content = ''
              this.form.keyword = ''
            }
          })
        }
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
  watch: {}

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
