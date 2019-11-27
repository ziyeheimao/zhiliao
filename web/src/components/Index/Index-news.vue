<template>
  <ul class="news" :style="gridTemplateColumns+gridTemplateRows">
    <li class="card" v-for="(v, k) in newsList" :key="k" @click="clickLi(v)">
      <h4 class="title">{{v.title}}</h4>

      <p class="inif">
        <el-link type="primary" @click.stop="findUser(v)">
          <output>{{v.userName}}</output>
        </el-link>

        <el-link type="primary" :underline="false">
          <output>{{v.releaseTime | dateTimetrans}}</output>
        </el-link>

        <el-link type="primary" @click.stop="star(v)" :disabled='Token ? false : true'>
          <output>{{JSON.parse(v.starUserId).indexOf(User.userId) === -1 ? '赞:' : '取消赞:'}} {{v.star}}</output>
        </el-link>
      </p>

      <p class="ctn">{{v.content}}</p>
    </li>

    <li class="null" v-if='newsList.length===0'>
      暂无内容
    </li>
  </ul>
</template>

<script>
import api from '@api'
import main from '@main'

export default {
  components: {
    // x
  },
  props: ['random'],
  computed: {
    width () {
      return this.$store.getters.InnerSize.width
    },
    gridTemplateColumns () {
      //                                                      列数自动判断    最大宽度 300px 比例1:1:1..
      if (this.width > 1280) return 'grid-template-columns: repeat(auto-fit, minmax(30%, 1fr));'
      else if (this.width < 360) return 'grid-template-columns: repeat(auto-fit, minmax(100%, 1fr));'
      else return 'grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));'
    },
    gridTemplateRows () {
      //                                              维持比例行数  高度比例
      if (this.width < 672) return 'grid-template-rows: repeat(6, 110px);'
      else if (this.width < 1010 && this.width >= 672) return 'grid-template-rows: repeat(3, 110px);'
      else return 'grid-template-rows: repeat(2, 110px);' // 900以上
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
      newsListAll: [],
      newsList: [] // top 6
    }
  },
  methods: {
    // 获取新闻列表
    news () {
      api.news().then(({data}) => {
        if (data.code === 0) {
          this.newsListAll = data.data
        }
      })
    },
    // 跳转至详情页
    clickLi (v) {
      let paperStripId = v.paperStripId
      this.$store.commit('SPaperStripId', paperStripId)

      let _paperStripId = JSON.stringify(paperStripId) // 对象转json字符串
      window.sessionStorage.setItem('paperStripId', _paperStripId)

      let data = { keyword: v.title }
      let searchCondition = JSON.stringify(data) // 对象转json字符串
      window.sessionStorage.setItem('searchCondition', searchCondition)
      this.$store.commit('SSearchCondition', data)

      this.$router.push('/details')
    },
    // 跳转作者
    findUser (paperStrip) {
      this.$router.push({
        name: `FindUser`,
        query: {
          userName: paperStrip.userName, userId: paperStrip.userId
        }
      })
    },
    // 点赞 取消点赞
    star (paperStrip) {
      let data = { paperStripId: paperStrip.paperStripId }

      // 后端数据
      api.star(data).then(({data}) => {
        console.log(data)
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
    }
  },
  beforeCreate () {},
  created () {
    this.news()
  },
  beforeMount () {},
  mounted () {},
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {},
  deactivated () {},
  watch: {
    newsListAll () {
      this.newsList = this.newsListAll.slice(0, 6)
    },
    random () {
      // 生成随机下标
      let arr = []
      for (let i = 0; i < 6; i++) {
        let fn = () => {
          let r = main.random.num(0, this.newsListAll.length - 1)
          if (!arr.includes(r)) arr.push(r)
          else return fn()
        }
        fn()
      }

      // 随机替换内容
      this.newsList = []
      for (let i of arr) {
        this.newsList.push(this.newsListAll[i])
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@import '@style/index.scss';
.news {
  padding-bottom: 25px;

  display: grid; /* 格子布局 */
  grid-gap: 15px; /* 格子之间的间隙 */
  &>li.card{
    // outline: 1px solid red;
    border-radius: 3px;
    box-shadow: 0 0 7px #00000040;
    cursor: pointer;

    padding: 15px;

    &>h4,&>p{
      margin: 0;
    }

    &>h4.title{
      font-size: 1.5rem;
      color: #333;
      @include overflow-ellipsis;
    }
    &>p.inif{
      text-align: right;
      margin: 0 5px 5px 0;
      &>.el-link{
        font-size: 1.2rem;
      }
      &>.el-link:first-child{
        display: inline-block;
        max-width: 90px;
        @include overflow-ellipsis;
      }
    }
    &>p.ctn{
      color: #666;
      text-indent: 2rem;
      font-size: 1.3rem;
      @include Overflow-ellipsis(2)
    }
  }
  &>li.card:hover{
    box-shadow: 0 0 10px #00000060;
  }
}

@import '@style/null.scss';
.null{
  border-radius: 3px;
  box-shadow: 0 0 7px #00000040;
  line-height: 65px;
}
</style>
