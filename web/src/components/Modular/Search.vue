<template>
  <section class="ctn">
    <!-- logo -->
    <div class="logo">
      <img src="../../assets/img/logo1.png" alt="logo" height="50px" style="padding-left:20px;">
    </div>

    <!-- 搜索 -->
    <div class="search-box">
      <div class="search">
        <!-- 搜索栏 -->
        <el-input
          id="searchInput"
          clearable
          :style="'width:' + inputWidth + 'px;'"
          class="input-with-select"
          placeholder="人傻才要多xiao习(๑•̀ㅂ•́)و✧"

          v-model="keyword"
          @keyup.native="keyupSearch($event)"
          @focus="inputFocus"
          @blur="inputBlur">

          <el-button slot="append" icon="el-icon-search" @click="search">知了</el-button>
        </el-input>

        <!-- 搜索辅助 -->
        <ul :style="'width:' + inputWidth + 'px;' + isShow"
          class="hotWords" id="hotWords">

          <li v-for="(v, k) in res.hotWords" :key="k"
            @click="clickLi(v)" :class="k === activateIndex ? 'activate' : ''">
            <span :style="'max-width:'+(inputWidth-35)+'px'">{{v}}</span>
            <i class="el-icon-close" v-show="mode" @click.stop="del(v)"></i>
          </li>

        </ul>
      </div>
      <el-radio-group v-model="type">
        <el-radio :label="0">全部</el-radio>
        <el-radio :label="1">标题</el-radio>
        <el-radio :label="2">正文</el-radio>
        <el-radio :label="3">作者</el-radio>
        <el-radio :label="4">关键词</el-radio>
      </el-radio-group>
    </div>

    <!-- 用户模块 -->
    <User></User>
  </section>
</template>

<script>
import api from '@api'
import main from '@main'
import User from './User'
export default {
  components: {
    User
  },
  // props: [''],
  computed: {
    SearchCondition () {
      return this.$store.getters.SearchCondition
    }
  },
  data () {
    return {
      type: 0,
      keyword: '', // 搜索关键字

      res: {
        hotWords: []
      },

      inputWidth: 450, // 搜索栏&搜索辅助宽度
      timer: null, // 节流
      activateIndex: -1, // 当前激活颜色的选项
      mode: false, // 关键词模式 true搜索历史(显示关闭的x) false热词(不显示关闭的x)

      isShow: 'display: none;' // 'display: block;' // 热词辅助和搜索历史是否显示
    }
  },
  methods: {
    // 搜索
    search () {
      if (this.keyword === '') {
        this.mode = true
        this.res.hotWords = JSON.parse(window.localStorage.getItem('searchHistory')) === null ? [] : JSON.parse(window.localStorage.getItem('searchHistory'))
        return
      }
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        let data = {
          keyword: this.keyword,
          type: this.type
        }
        api.widelySearch(data).then(({data}) => {
          if (data.code === 0) this.$store.dispatch('AListdata', data.data)
        })
        this.cache()
        this.isShow = 'display: none;' // 隐藏辅助
        this.activateIndex = -1
        document.getElementById('searchInput').blur() // 失去焦点
      }, 300)
      if (this.$route.name !== 'List') this.$router.push('./list')
    },
    // 缓存搜索历史
    cache () {
      let history = window.localStorage.getItem('searchHistory')
      var searchHistory = null

      if (history === null) { // 没有历史纪录时
        let arr = [this.keyword]
        searchHistory = JSON.stringify(arr) // 转json
      } else { // 有历史记录时
        let historyArr = JSON.parse(history)
        historyArr.unshift(this.keyword)
        historyArr = main.distinct(...historyArr) // 数组去重
        historyArr = main.len(historyArr, 15) // 限制历史记录个数 // 如果数组长度大于15 尾巴切掉 只留15个记录
        searchHistory = JSON.stringify(historyArr) // 转数组
      }
      window.localStorage.setItem('searchHistory', searchHistory)
    },

    keyupSearch (e) {
      if (this.keyword !== '') this.isShow = 'display: block;'

      switch (e.keyCode) {
        case 13: // 回车搜索
          if (this.activateIndex !== -1) this.keyword = this.res.hotWords[this.activateIndex]

          let data = { keyword: this.keyword }
          let searchCondition = JSON.stringify(data) // 对象转json字符串
          window.sessionStorage.setItem('searchCondition', searchCondition)
          this.$store.commit('SSearchCondition', data)
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
    // 热词辅助
    getHotWords () {
      if (this.keyword === '') {
        this.mode = true
        this.res.hotWords = JSON.parse(window.localStorage.getItem('searchHistory')) === null ? [] : JSON.parse(window.localStorage.getItem('searchHistory'))
        return
      }

      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        api.getHotWords(this.keyword).then(({data}) => {
          this.mode = false
          this.res.hotWords = []
          for (let i of data.data) {
            this.res.hotWords.push(i.title)
          }
        })
      }, 300)
    },
    // 点击热词
    clickLi (value) {
      this.keyword = value
      this.search()
    },

    // input 获取焦点
    inputFocus (code) {
      this.isShow = 'display: block;'
      if (this.keyword === '') { // 显示搜索历史记录
        this.mode = true
        this.res.hotWords = JSON.parse(window.localStorage.getItem('searchHistory')) === null ? [] : JSON.parse(window.localStorage.getItem('searchHistory'))
      } else { // 显示热词
        this.mode = false
        this.getHotWords()
      }
      if (this.res.hotWords.length === 0) {
        this.isShow = 'display: none;'
        this.activateIndex = -1
      }
    },
    // input 失去焦点
    inputBlur () {
      setTimeout(() => {
        this.isShow = 'display: none;'
        this.activateIndex = -1
      }, 200)
    },

    // 删除某条搜索记录
    del (value) {
      let history = window.localStorage.getItem('searchHistory') // 取
      let historyArr = JSON.parse(history) // 转数组
      let index = historyArr.indexOf(value) // 查
      historyArr.splice(index, 1) // 删

      let searchHistory = JSON.stringify(historyArr) // 转json
      window.localStorage.setItem('searchHistory', searchHistory) // 存

      let searchInput = document.getElementById('searchInput')
      searchInput.focus()

      setTimeout(() => {
        this.isShow = 'display: block;'
      }, 100)
    },
    init () {
      this.keyword = this.SearchCondition.keyword
      if (this.keyword !== '' && this.$route.name === 'List') this.search()
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

<style lang='scss'>
// 搜索按钮
.el-input-group__append{
  background-color: #409EFF;
  color: #fff;
  border: none;
}
</style>
<style lang='scss' scoped>
@import '@style/index.scss';
.ctn{
  width: 100%;
  height: 100%;
  @include flex-between-center;
}
.search{
  @include flex-center-center;
  flex-direction: column;
  flex-wrap: wrap;

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
  max-height: 470px;
  @include scrollHidden;
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

// 搜索赛选与搜索辅助文字层级调整
.search{
  position: relative;
  z-index: 2;
}
.el-radio-group{
  position: relative;
  z-index: 1;
}

//
.search-box{
  display: flex;
  flex-direction: column;
  & > .el-radio-group {
    margin: 10px 0 0 5px;
  }
}
</style>
