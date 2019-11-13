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
            <el-link type="primary" @click="findUser(ctnData.userId)">{{ctnData.userName}}</el-link>
            <el-link type="primary" :underline="false">{{ctnData.releaseTime | dateTimetrans}}</el-link>

            <el-link type="success" @click="beforeupDataPaperStrip">修改内容</el-link>
            <el-link type="danger" @click="delDialogVisible = true">删除</el-link>
          </div>

          <div class="ctn" v-html="ctnData.content" v-highlight></div>
        </div>

        <!-- 删除 -->
        <el-dialog
          title="删除纸条"
          :visible.sync="delDialogVisible"
          width="450px"
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

                <el-form-item prop="content">
                  <el-input clearable placeholder="记录你的生活 分享你的快乐~" v-model="ctnData.content"
                    type='textarea' :rows="20"></el-input>
                </el-form-item>

                <el-form-item prop="keyword">
                  <el-input clearable placeholder="关键词 多个时可用空格隔开" v-model="ctnData.keyword"></el-input>
                </el-form-item>

                <el-form-item class="btn">
                  <el-button @click="cancel">取 消</el-button>
                  <el-button type='primary' @click="upDataPaperStrip('ctnData')">修 改</el-button>
                </el-form-item>

              </el-form>
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

export default {
  components: {
    Search
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
    }
  },
  data () {
    return {
      ctnData: {
        userId: '',
        userName: '',
        title: '',
        content: '',
        keyword: '',
        paperStripId: '',
        releaseTime: '',
        coverMap: '' // 封图
      },
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

      delDialogVisible: false,
      delPaperStripId: '', // 将被删除的纸条id

      upDataDialogVisible: false // 修改
    }
  },
  methods: {
    // 通过纸条Id 获取详细内容
    paperStrip () {
      if (!this.PaperStripId) return
      api.paperStrip(this.PaperStripId).then(({data}) => {
        if (data.code === 0) {
          this.ctnData = data.data
          this.ctnData.content = main.strToH5(this.ctnData.content)
        }
      })
    },
    // 跳转查询用户页面,通过userId 获取 该用户的所有纸条
    findUser (userId) {
      console.log(userId)
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
      this.ctnData.content = main.H5ToStr(this.ctnData.content)
      this.upDataDialogVisible = true
    },
    // 取消修改时
    cancel () {
      this.ctnData.content = main.strToH5(this.ctnData.content)
      this.upDataDialogVisible = false
    },
    // 修改纸条
    upDataPaperStrip (ctnData) {
      this.$refs[ctnData].validate(valid => {
        if (valid) {
          this.ctnData.userName = this.User.userName
          api.upDataPaperStrip(this.ctnData).then(({data}) => {
            if (main.msg(data.code, data.msg)) {
              this.upDataDialogVisible = false
              this.$router.push('/list')
            }
          })
        }
      })
    }
  },
  beforeCreate () {},
  created () {
    this.paperStrip()
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
.el-dialog .btn{
  text-align: right;
}

</style>
