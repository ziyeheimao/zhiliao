<template>
  <div class="search">
    <!-- 搜索栏 -->
    <!-- autofocus -->
    <el-input
      id="searchInput"
      clearable
      :style="'width:' + (Width > 768 ? inputWidth + 'px;' : '100%;')"
      class="input-with-select"
      placeholder="人傻才要多xiao习(๑•̀ㅂ•́)و✧"

      v-model="keyword"
      @keyup.native="keyupSearch($event)"
      @focus="inputFocus"
      @blur="inputBlur">

      <el-button slot="append" icon="el-icon-search" @click="search">知了</el-button>
    </el-input>

    <!-- 搜索辅助 -->
    <ul :style="'width:' + (Width > 768 ? inputWidth + 'px;' : '100%;') + isShow"
      class="hotWords" id="hotWords">

      <li v-for="(v, k) in res.hotWords" :key="k"
        @click="clickLi(v)" :class="k === activateIndex ? 'activate' : ''">
        <span :style="'max-width:' + (Width > 768 ? inputWidth + 'px;' : '100%;')">{{v}}</span>
        <i class="el-icon-close" v-show="mode" @click.stop="del(v)"></i>
      </li>

    </ul>
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
    Width () {
      return this.$store.getters.InnerSize.width
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
        hotWords: []
      },
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
          keyword: this.keyword
        }

        let searchCondition = JSON.stringify(data) // 对象转json字符串
        window.sessionStorage.setItem('searchCondition', searchCondition)

        this.$store.commit('SSearchCondition', data)

        this.cache()
        this.$router.push('/list')
      }, 300)
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
.search{
  @include flex-center-center;
  flex-direction: column;
  flex-wrap: wrap;

  margin-top: 15px;
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
</style>
