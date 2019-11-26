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

            <div class="toolbar">
              <el-link type="primary" icon='el-icon-picture' :underline="false"
                @click="toolbar('pic')">插入图片</el-link>

              <el-divider direction="vertical"></el-divider>

              <el-link type="primary" icon='el-icon-picture-outline-round' :underline="false" disabled>插入表情</el-link>

              <el-divider direction="vertical"></el-divider>

              <el-link type="primary" icon='el-icon-upload' :underline="false" disabled>上传文件</el-link>
            </div>

            <el-form-item prop="content">
              <el-input clearable placeholder="记录生活 分享快乐~" v-model="form.content"
                type='textarea' :rows="20"></el-input>
            </el-form-item>

            <el-form-item prop="keyword">
              <el-input clearable placeholder="关键词 多个时可用空格隔开" v-model="form.keyword"></el-input>
            </el-form-item>

            <el-form-item prop="languageSign">
              <el-select class="language-sign-select" multiple clearable
                v-model="form.languageSign" placeholder="语言标记 便于搜索和推荐 若内容含HTML标签必须标记">
                <el-option v-for="(v, k) in res.languageSign" :key="k" :label="v.name" :value="v.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="btn">
              <el-button type='primary' @click="releasePaperStrip('form')">发 布</el-button>
            </el-form-item>
          </el-form>

          <!-- 上传图片用 -->
          <div class="toolbar-file-input-box">
            <input type="file" id="insertPic"  @change="insertPic">
          </div>
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
        keyword: [],
        languageSign: [
          { required: true, message: '语言标记不可为空', trigger: 'blur' }
        ]
      },

      form: {
        userName: '',
        title: '',
        content: '',
        keyword: '',
        languageSign: [] // 语言标记
      },
      res: {
        languageSign: [
          // { name: 'HTML', value: 1 },
          // { name: 'CSS', value: 2 },
          // { name: 'JavaScript', value: 3 },
          // { name: 'jQuery', value: 4 },
          // { name: 'Vue', value: 5 },
          // { name: 'React', value: 6 },
          // { name: 'AngularJS', value: 7 },
          // { name: 'Node.js', value: 8 },
          // { name: 'MySQl', value: 9 },
          // { name: 'ReactNative', value: 10 },
          // { name: 'ionic', value: 11 },
          // { name: 'Java', value: 12 },
          // { name: 'PHP', value: 13 },
          // { name: 'Android', value: 14 },
          // { name: 'iOS', value: 15 },
          // { name: '.NET', value: 16 },
          // { name: 'Hadoop', value: 17 },
          // { name: 'Python', value: 18 },
          // { name: 'Delphi', value: 19 },
          // { name: 'VB', value: 20 },
          // { name: 'Perl', value: 21 },
          // { name: 'Ruby', value: 22 },
          // { name: 'Golang', value: 23 },
          // { name: 'Erlang', value: 24 },
          // { name: 'WP', value: 25 },
          // { name: 'Flash', value: 26 },
          // { name: 'C', value: 27 },
          // { name: 'C++', value: 28 },
          // { name: 'C#', value: 29 }
        ]
      },
      imgList: [
        // { name: '[图片: 1.png]', value: 'base64 .......' }
      ]
    }
  },
  methods: {
    // 发帖
    releasePaperStrip (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.form.userName = this.User.userName

          let reqData = main.clone(this.form)
          reqData.languageSign = JSON.stringify(reqData.languageSign)

          for (let i of this.imgList) { // 替换图片名称字符串为base64
            if (reqData.content.indexOf(i.name) !== -1) {
              reqData.content = reqData.content.replace(i.name, i.value)
            }
          }

          api.releasePaperStrip(reqData).then(({data}) => {
            if (main.msg(data.code, data.msg)) {
              this.form.title = ''
              this.form.content = ''
              this.form.keyword = ''
              this.imgList = []
            }
          })
        }
      })
    },

    // 点击工具栏内工具
    toolbar (name) {
      switch (name) {
        case 'pic': // 插入图片
          document.getElementById('insertPic').click()
          break
        case '':
          break
      }
    },

    // 图片选择时 添加
    insertPic (e) {
      // 检测图片格式和尺寸
      let img = e.target.files[0]

      let type = img.type
      let size = img.size
      let name = img.name

      let valid = function (type, size) {
        if (type.indexOf('image/') === -1) {
          main.openWarningInfo('只能上传图片格式')
          return false
        }

        if (size / 1024 / 1024 > 5) {
          main.openWarningInfo('图片大小不能超过5M')
          return false
        }

        return true
      }

      if (!valid(type, size)) return

      // 处理图片
      let reader = new FileReader() // 创建一个reader
      reader.readAsDataURL(img) // 转码base64格式

      reader.onloadend = () => { // 监听转码结束之后执行的回调函数
        let nameStr = `[图片: ${name}]`
        this.form.content += `\n${nameStr}\n` // 文本框中只显示 [图片: 文件名.png]
        this.imgList.push({
          name: nameStr,
          value: `<img signStart='' src='${reader.result}' style='max-width: 100%;' signEnd=''>`
        }) // base64 数据存内存 发布的时候在导出来
      }
    },

    // 获取编程语言
    language () {
      api.language().then(({data}) => {
        if (data.code === 0) {
          this.res.languageSign = data.data
        }
      })
    }
  },
  beforeCreate () {},
  created () {
    this.language()
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

.language-sign-select{
  width: 100%;
}
// 工具栏
@import '@style/toolbar.scss';
</style>
