<template>
  <div class="search">
    <!-- 搜索栏 -->
    <el-input
      id="searchInput"
      clearable
      :style="'width:' + inputWidth"
      class="input-with-select"
      placeholder="人傻才要多xiao习(๑•̀ㅂ•́)و✧"

      v-model="keyword"
      @keyup.native="keyupSearch($event)"
      @focus="inputFocus"
      @blur="inputBlur">

      <el-button slot="append" icon="el-icon-search" @click="search">查找作者</el-button>
    </el-input>

    <!-- 搜索辅助 -->
    <ul :style="'width:' + inputWidth + isShow"
      class="hotWords" id="hotWords">

      <li v-for="(v, k) in res.hotWords" :key="k"
        @click="clickLi(v)" :class="k === activateIndex ? 'activate' : ''">
        <span :style="'max-width:'+(inputWidth-35)+'px'">{{v}}</span>
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
    SearchAuthorName () {
      return this.$store.getters.SearchAuthorName
    },
    User () {
      return this.$store.getters.User
    },
    Token () {
      return this.$store.getters.Token
    },
    width () {
      return this.$store.getters.InnerSize.width
    },
    inputWidth () {
      if (this.width > 768) return '450px;' // 搜索栏&搜索辅助宽度
      else return '100%;'
    }
  },
  data () {
    return {
      keyword: '', // 搜索关键字
      userId: 'undefined',
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
        this.res.hotWords = JSON.parse(window.localStorage.getItem('authorNameHistory')) === null ? [] : JSON.parse(window.localStorage.getItem('authorNameHistory'))
        return
      }
      clearTimeout(this.timer)

      this.timer = setTimeout(() => {
        // 搜索条件 (作者名)
        window.sessionStorage.setItem('searchAuthorName', this.keyword)

        this.$store.commit('SSearchAuthorName', this.keyword)

        this.cache()
        this.author()
      }, 300)
    },
    // 缓存搜索历史
    cache () {
      let history = window.localStorage.getItem('authorNameHistory')
      var authorNameHistory = null

      if (history === null) { // 没有历史纪录时
        let arr = [this.keyword]
        authorNameHistory = JSON.stringify(arr) // 转json
      } else { // 有历史记录时
        let historyArr = JSON.parse(history)
        historyArr.unshift(this.keyword)
        historyArr = main.distinct(...historyArr) // 数组去重
        historyArr = main.len(historyArr, 15) // 限制历史记录个数 // 如果数组长度大于15 尾巴切掉 只留15个记录
        authorNameHistory = JSON.stringify(historyArr) // 转数组
      }
      window.localStorage.setItem('authorNameHistory', authorNameHistory)
    },
    // 搜索接口
    author () {
      let data = { keyword: this.keyword, userId: this.userId }
      if (data.keyword === '') return

      api.author(data).then(({data}) => {
        this.$store.dispatch('AFindUserList', data.data)
        let findUserList = JSON.stringify(data.data)
        window.sessionStorage.setItem('findUserList', findUserList)
      })
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
          this.authorName()
          break
      }
    },
    // 搜索作者名辅助
    authorName () {
      if (this.keyword === '') {
        this.mode = true
        this.res.hotWords = JSON.parse(window.localStorage.getItem('authorNameHistory')) === null ? [] : JSON.parse(window.localStorage.getItem('authorNameHistory'))
        return
      }

      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        api.authorName(this.keyword).then(({data}) => {
          this.mode = false
          this.res.hotWords = []

          for (let i = 0; i < data.data.length; i++) {
            this.res.hotWords.push(data.data[i].userName)
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
        this.res.hotWords = JSON.parse(window.localStorage.getItem('authorNameHistory')) === null ? [] : JSON.parse(window.localStorage.getItem('authorNameHistory'))
      } else { // 显示热词
        this.mode = false
        this.authorName()
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
      let history = window.localStorage.getItem('authorNameHistory') // 取
      let historyArr = JSON.parse(history) // 转数组
      let index = historyArr.indexOf(value) // 查
      historyArr.splice(index, 1) // 删

      let authorNameHistory = JSON.stringify(historyArr) // 转json
      window.localStorage.setItem('authorNameHistory', authorNameHistory) // 存

      let searchInput = document.getElementById('searchInput')
      searchInput.focus()

      setTimeout(() => {
        this.isShow = 'display: block;'
      }, 100)
    }
  },
  beforeCreate () {},
  created () {
    if (this.$route.query.userId && this.$route.query.userName) {
      this.keyword = this.$route.query.userName
      this.userId = this.$route.query.userId
    }
    this.author()
  },
  beforeMount () {},
  mounted () {},
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {},
  deactivated () {},
  watch: {
    keyword () {
      this.userId = 'undefined'
    }
  }

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

  // margin-top: 15px;
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
