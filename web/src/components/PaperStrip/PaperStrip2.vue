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

            <el-form-item class="btn">
              <el-button type='primary' @click="releasePaperStrip('form')">发 布</el-button>
            </el-form-item>
          </el-form>

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
        keyword: []
      },

      form: {
        userName: '',
        title: '',
        content: '',
        keyword: ''
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

          for (let i of this.imgList) { // 替换图片名称字符串为base64
            if (this.form.content.indexOf(i.name) !== -1) {
              this.form.content = this.form.content.replace(i.name, i.value)
            }
          }

          api.releasePaperStrip(this.form).then(({data}) => {
            if (main.msg(data.code, data.msg)) {
              this.form.title = ''
              this.form.content = ''
              this.form.keyword = ''
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
        // reader.result // 转码的 base64 数据
        // this.form.content += `\n<img src='${reader.result}' style='max-width: 100%;'>\n`

        //
        let nameStr = `[图片: ${name}]`
        this.form.content += `\n${nameStr}\n` // 文本框中只显示 [图片: 文件名.png]
        this.imgList.push({
          name: nameStr,
          value: `<img signStart='' src='${reader.result}' style='max-width: 100%;' signEnd=''>`
        }) // base64 数据存内存 发布的时候在导出来
        console.log(this.imgList)
      }
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

// 工具栏
.toolbar {
  border-radius: 3px;
  margin-bottom: 8px;
  padding: 8px 15px;
  background-color: #fff;
  border: 1px solid #DCDFE6;
}
// 工具栏input
.toolbar-file-input-box{
  width: 0;
  height: 0;
  overflow: hidden;
}
</style>
