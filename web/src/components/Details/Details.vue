<template>
  <el-container>
    <el-header height='80px'>
      <Search></Search>
    </el-header>

    <el-container :style="'min-height:' + height + 'px;'">
      <el-aside :width="width > 1440 ? '200px' : '100px'" v-show="width > 992"></el-aside>

      <el-main>
        <div class="details-ctn">
          <h1 class="title">{{ctnData.title}}</h1>

          <div class="info">
            <el-link type="primary" @click="findUser(ctnData)">
              <output>{{ctnData.userName}}</output>
            </el-link><!-- 作者 -->

            <el-link type="primary" :underline="false">
              <output>{{ctnData.releaseTime | dateTimetrans}}</output>
            </el-link>

            <el-link type="primary" @click.stop="star(ctnData)" :disabled='Token ? false : true'>
              <output>{{JSON.parse(ctnData.starUserId).indexOf(User.userId) === -1 ? '赞:' : '取消赞:'}} {{ctnData.star}}</output>
            </el-link>

            <el-link type="success" @click="beforeupDataPaperStrip" v-if="ctnData.userId === User.userId">修改内容</el-link>
            <el-link type="danger" @click="delDialogVisible = true" v-if="ctnData.userId === User.userId">删除</el-link>
          </div>

          <div class="ctn" v-html="ctnData.content" v-if="ctnData.languageSign.indexOf(1) === -1" v-highlight></div>
          <div class="ctn" v-if="ctnData.languageSign.indexOf(1) !== -1" v-highlight>
            <pre><code>{{ctnData.content}}</code></pre>
          </div>

        </div>

        <!-- 删除 -->
        <el-dialog
          title="删除纸条"
          :visible.sync="delDialogVisible"
          :width="width > 768 ? '450px' : '80%'"
          append-to-body>

          <span>确定要删除该纸条吗?</span>

          <span slot="footer" class="dialog-footer">
            <el-button @click="delDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="delPaperStrip">删 除</el-button>
          </span>
        </el-dialog>

        <!-- 修改 -->
        <el-dialog
          title="修改纸条"
          :visible.sync="upDataDialogVisible"
          fullscreen
          append-to-body>

          <el-container class="ctn"><!-- :style="'min-height:' + height + 'px;'" -->
            <el-aside :width="width > 1440 ? '200px' : '100px'" v-show="width > 992"></el-aside>

            <el-main class="paper-strip">
              <el-form :model="ctnData" :rules="rules" ref="ctnData">

                <el-form-item prop="title">
                  <el-input clearable placeholder="标题" v-model="ctnData.title"></el-input>
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
                  <el-input clearable placeholder="记录生活 分享快乐~" v-model="ctnData.content"
                    type='textarea' :rows="20"></el-input>
                </el-form-item>

                <el-form-item prop="keyword">
                  <el-input clearable placeholder="关键词 多个时可用空格隔开" v-model="ctnData.keyword"></el-input>
                </el-form-item>

                <el-form-item prop="languageSign">
                  <el-select class="language-sign-select" multiple clearable
                    v-model="ctnData.languageSign" placeholder="语言标记 便于搜索和推荐 若内容含HTML标签必须标记">
                    <el-option v-for="(v, k) in res.languageSign" :key="k" :label="v.name" :value="v.value"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item class="btn">
                  <el-button @click="cancel">取 消</el-button>
                  <el-button type='primary' @click="upDataPaperStrip('ctnData')">修 改</el-button>
                </el-form-item>

              </el-form>

              <!-- 上传图片用 -->
              <div class="toolbar-file-input-box">
                <input type="file" id="insertPic"  @change="insertPic">
              </div>

              <Backtop>
                <div style="{
                  height: 40px; width: 40px;
                  text-align: center; line-height: 40px; color: #1989fa;
                  background-color: #f2f5f6; box-shadow: 0px 0px 6px #00000070;
                  border: 1px solid #eee; border-radius: 50%; font-size: 2rem; }">
                  <i class="el-icon-caret-top"></i>
                </div>
              </Backtop>
            </el-main>

            <el-aside :width="width > 1440 ? '200px' : '100px'" v-show="width > 992"></el-aside>
          </el-container>

        </el-dialog>
      </el-main>

      <el-aside :width="width > 1440 ? '200px' : '100px'" v-show="width > 992"></el-aside>
    </el-container>
  </el-container>
</template>

<script>
import api from '@api'
import main from '@main'
import Search from '../Modular/Search'
import Backtop from '../MyUI/Backtop'

export default {
  components: {
    Search,
    Backtop
  },
  // props: [''],
  computed: {
    PaperStripId () {
      return this.$store.getters.PaperStripId
    },
    height () {
      return this.$store.getters.InnerSize.height - 80
    },
    width () {
      return this.$store.getters.InnerSize.width
    },
    User () {
      return this.$store.getters.User
    },
    Token () {
      return this.$store.getters.Token
    }
  },
  data () {
    return {
      // contentSegmentation: [], // 内容分段 纸条内容为html代码时特殊处理
      ctnData: {
        userId: '',
        userName: '',
        title: '',
        content: '',
        keyword: '',
        paperStripId: '',
        releaseTime: '',
        coverMap: '', // 封图
        languageSign: [], // 语言标记
        star: '',
        starUserId: '[]' // JSON 字符串
      },
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

      delDialogVisible: false,
      delPaperStripId: '', // 将被删除的纸条id

      upDataDialogVisible: false, // 修改

      imgList: [ // base64图片数据
        // { name: '[图片1]', value: 'base64 .......' }
      ],

      res: {
        languageSign: []
      },
      time: null
    }
  },
  methods: {
    // 通过纸条Id 获取详细内容
    paperStrip () {
      if (!this.PaperStripId) return
      api.paperStrip(this.PaperStripId).then(({data}) => {
        if (data.code === 0) {
          this.ctnData = data.data
          this.ctnData.languageSign = JSON.parse(this.ctnData.languageSign)
          if (this.ctnData.languageSign.indexOf(1) === -1) { // 帖子不包含内容html则转码
            this.ctnData.content = main.strToH5(this.ctnData.content)
          } else { // 否则克隆后分段

          }
        }
      })
    },
    // 跳转查询用户页面,通过userId 获取 该用户的所有纸条
    findUser (user) {
      this.$router.push({
        name: `FindUser`,
        query: {
          userName: user.userName, userId: user.userId
        }
      })
    },

    // 删除纸条
    delPaperStrip () {
      api.delPaperStrip(this.ctnData.paperStripId).then(({data}) => {
        if (main.msg(data.code, data.msg)) {
          this.delDialogVisible = false
          this.$router.push('/list')
        }
      })
    },

    // 进入修改页面之前处理字符串
    beforeupDataPaperStrip () {
      if (this.ctnData.languageSign.indexOf(1) === -1) { // 帖子不包含内容html则转码
        this.ctnData.content = main.H5ToStr(this.ctnData.content)
      }
      // base64图片转图片标记
      this.base64ToSign()

      this.upDataDialogVisible = true
    },
    // base64图片转图片标记
    base64ToSign () {
      let reg = /<img signStart='' src='[^>]+' style='max-width: 100%;' signEnd=''>/g
      let reg2 = /<img signStart='' src='[^>]+' style='max-width: 100%;' signEnd=''>/
      let arr = this.ctnData.content.match(reg) || []
      this.imgList = []
      for (let i = 0; i < arr.length; i++) {
        // 缓存base64
        this.imgList.push({ name: `[图片${i + 1}]`, value: arr[i] })
        // 替换base64
        this.ctnData.content = this.ctnData.content.replace(reg2, `[图片${i + 1}]`)
      }
    },

    // 取消修改时
    cancel () {
      if (this.ctnData.languageSign.indexOf(1) === -1) { // 帖子不包含内容html则转码
        this.ctnData.content = main.strToH5(this.ctnData.content)
      }

      // 图片标记转base64
      setTimeout(() => {
        for (let i of this.imgList) { // 替换图片名称字符串为base64
          if (this.ctnData.content.indexOf(i.name) !== -1) {
            this.ctnData.content = this.ctnData.content.replace(i.name, i.value)
          }
        }
      }, 100)

      this.upDataDialogVisible = false
    },
    // 修改纸条
    upDataPaperStrip (ctnData) {
      this.$refs[ctnData].validate(valid => {
        if (valid) {
          this.ctnData.userName = this.User.userName

          // // 图片标记转base64
          let reqData = main.clone(this.ctnData)
          for (let i of this.imgList) { // 替换图片名称字符串为base64
            if (reqData.content.indexOf(i.name) !== -1) {
              reqData.content = reqData.content.replace(i.name, i.value)
            }
          }
          reqData.languageSign = JSON.stringify(reqData.languageSign)

          api.upDataPaperStrip(reqData).then(({data}) => {
            if (main.msg(data.code, data.msg)) {
              this.upDataDialogVisible = false
              this.imgList = []
              this.$router.push('/list')
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

      reader.onloadend = (element) => { // 监听转码结束之后执行的回调函数
        main.imgHandle(element, 0.8, 1280, '知了 (๑•̀ㅂ•́)و✧').then(base64 => {
          let nameStr = `[图片: ${name}]`
          this.ctnData.content += `\n${nameStr}\n` // 文本框中只显示 [图片: 文件名.png]
          this.imgList.push({
            name: nameStr,
            // reader.result // 原base64
            value: `<img signStart='' src='${base64}' style='max-width: 100%;' signEnd=''>`
          }) // base64 数据存内存 发布的时候在导出来
        })
      }
    },

    // 获取编程语言
    language () {
      api.language().then(({data}) => {
        if (data.code === 0) {
          this.res.languageSign = data.data
        }
      })
    },

    // 点赞 取消点赞
    star (paperStrip) {
      clearTimeout(this.time)
      this.time = setTimeout(() => {
        let data = { paperStripId: paperStrip.paperStripId }
        api.star(data).then(({data}) => {
          if (data.code === 0) {
            // 前端视图
            let arr = JSON.parse(paperStrip.starUserId)
            if (!arr.length) arr = []
            if (JSON.parse(paperStrip.starUserId).indexOf(this.User.userId) === -1) { // 赞
              arr.push(this.User.userId)
              paperStrip.star = paperStrip.star + 1
            } else { // 取消赞
              let index = arr.indexOf(this.User.userId)
              arr.splice(index, 1)
              paperStrip.star = paperStrip.star - 1
            }
            let JSONArr = JSON.stringify(arr)
            paperStrip.starUserId = JSONArr
          } else {
            main.openWarningInfo(data.msg)
          }
        })
      }, 300)
    }
  },
  beforeCreate () {},
  created () {
    this.paperStrip()
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

.el-header{
  background-color: #fff;
  box-shadow: 2px 2px 5px #00000020;
  z-index: 2;
}
.el-container{
  background-color: #eee;
  z-index: 1;
}

.details-ctn{
  color: #333;
  padding: 40px 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 2px 2px 5px #00000050;

  & > .title {
    margin: 0 0 7px 0;
    max-width: calc(100% -30px);
    @include overflow-ellipsis;
    font-size: 2rem;
    text-indent: 3rem;
  }
  & > .info {
    padding: 15px;
    text-align: right;
    font-size: 1.5rem;
    & > .el-link{
      margin-left: 5px;
    }
  }
  & > .ctn {
    // text-align-last:justify;
    text-align: justify;
    text-justify: distribute-all-lines; // 这行必加，兼容ie浏览器

    // text-indent: 3rem;
    font-size: 1.5rem;
    line-height: 2rem;
    & > pre{
      text-indent: none;
      & > code {
        text-indent: none;
      }
    }
  }
}

.el-dialog {
  .btn{
    text-align: right;
  }
}

.language-sign-select{
  width: 100%;
}

// 工具栏
@import '@style/toolbar.scss';
</style>
