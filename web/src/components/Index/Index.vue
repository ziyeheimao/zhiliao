<template>
  <el-container>
    <el-header>
      <div>用户</div>
    </el-header>

    <el-main>
      <div>
        <div class="logo">知了</div>

        <div class="search">
          <!-- 搜索栏 -->
          <el-input
            autofocus
            :style="'width:' + inputWidth + 'px;'"
            clearable v-model="keyword" class="input-with-select"
            placeholder="人傻才要多xiao习(๑•̀ㅂ•́)و✧"
            @keyup.native="keyupSearch($event)">

            <el-button slot="append" icon="el-icon-search" @click="search">知了</el-button>
          </el-input>

          <!-- 搜索辅助 -->
          <ul
            :style="'width:' + inputWidth + 'px;' + show"
            class="hotWords" id="hotWords"
            @mouseenter='mouseenter' @mouseleave='mouseleave'>

            <li v-for="(v, k) in res.hotWords" :key="k"
              @click="clickLi(v)" :class="k === activateIndex ? 'activate' : ''">

              <span :style="'max-width:'+(inputWidth-35)+'px'">{{v}}</span>
              <i class="el-icon-close" v-show="mode" @click.stop="del(v)"></i>
            </li>
          </ul>
        </div>
      </div>

      <div>
        首页推荐列表
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import api from '@api'
// import main from '@main'

export default {
  components: {
    // x
  },
  // props: [''],
  computed: {
    show () {
      if (this.keyword) {
        return 'display: block;'
      } else {
        return 'display: none;'
      }
    }
  },
  data () {
    return {
      inputWidth: 450, // 搜索栏&搜索辅助宽度
      keyword: '', // 搜索关键字
      timer: null, // 节流
      activateIndex: -1, // 当前激活颜色的选项
      mode: false, // 关键词模式 true搜索历史(显示关闭的x) false热词(不显示关闭的x)
      hover: false, // 鼠标是否悬停在ul (热词&历史)上
      res: {
        hotWords: ['123', '321']
      }
    }
  },
  methods: {
    // 搜索
    search () {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        console.log('搜索', this.keyword)
      }, 300)
    },
    keyupSearch (e) {
      switch (e.keyCode) {
        case 13: // 搜索
          if (this.activateIndex === -1) {

          } else this.keyword = this.res.hotWords[this.activateIndex]
          this.search()
          break
        case 38: // ↑
          if (this.activateIndex === -1) this.activateIndex = this.res.hotWords.length - 1
          else this.activateIndex--
          break
        case 40: // ↓
          this.activateIndex === this.res.hotWords.length - 1 ? this.activateIndex = -1 : this.activateIndex++
          break
        default: // 搜索辅助 获取匹配的搜索热词
          this.getHotWords()
          break
      }
    },
    getHotWords () {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        api.getHotWords(this.keyword).then(({data}) => {
          console.log(data)
        })
      }, 300)
    },
    // 点击热词
    clickLi (value) {
      this.keyword = value
      this.search()
    },

    // input 获取焦点 失去焦点时
    focus (code) {
      if (code === 1) { // 获取焦点
        if (this.keyword === '' || this.res.hotWords.length === 0) {
          this.historyMode() // 判断使用搜索历史还是 搜索热词
        }
      } else if (code === 0) { // 失去焦点
        setTimeout(() => {
          if (this.hover === false) {
            this.show = ''
          }
        }, 300)
      }
    },

    // 判断使用搜索历史还是 搜索热词
    historyMode () {
      this.mode = true
      let history = window.localStorage.getItem('searchHistory')

      if (history === null || history.length === 0) { // 搜索热词
        this.hotWords()

        if (this.searchSettings.searchAIDS) {
          this.show = 'display:block;'
        }
      } else { // 搜索历史
        let historyArr = JSON.parse(history)
        this.res.hotWords = historyArr

        if (this.searchSettings.searchHistory) {
          this.show = 'display:block;'
        }
      }
    },

    // 删除某条搜索记录
    del (value) {
      let history = window.localStorage.getItem('searchHistory') // 取
      let historyArr = JSON.parse(history) // 转数组
      let index = historyArr.indexOf(value) // 查
      historyArr.splice(index, 1) // 删

      let searchHistory = JSON.stringify(historyArr) // 转json
      window.localStorage.setItem('searchHistory', searchHistory) // 存

      // 刷新
      this.historyMode()
    },

    // 鼠标移入
    mouseenter () {
      this.hover = true
    },

    // 鼠标移出
    mouseleave () {
      this.activateIndex = -1 // 激活的选项复位
      this.hover = false
      this.focus(0)
      document.getElementById('keyword').blur()
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
.logo{
  text-align: center;
  font-size: 1.8rem;
}
.search{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 15px;
  // & * {
  //   outline: 1px solid red;
  // }
}
// 搜索辅助
.search{
  position: relative;
}
.search>.hotWords{
  position: absolute;
  top: 40px;
  margin: 0 auto;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  background: #fff;
  overflow: hidden;
  padding: 3px 0 5px;
  box-shadow: 2px 4px 8px #00000050;
}
.search>.hotWords>li{
  padding: 7px 10px;
  color: #666;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search>.hotWords>li~li{
  border-top: 1px solid #eee;
}
.search>.hotWords>li:hover{
  background: #ecf8ff;
  color: #409eff;
}

// 搜搜辅助 activate
.search>.hotWords>li.activate{
  background: #ecf8ff;
  color: #409eff;
}
.search>.hotWords>li>span{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 搜搜辅助 close
.search>.hotWords>li>i:hover{
  color: red;
}
</style>

<style lang='scss'>
// 搜索按钮
.el-input-group__append{
  background-color: #409EFF;
  color: #fff;
  border: none;
}
</style>
