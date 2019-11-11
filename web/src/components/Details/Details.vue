<template>
  <el-container>
    <el-header height='80px'>
      <Search></Search>
    </el-header>

    <el-container :style="'min-height:' + height + 'px;'">
      <el-aside width="200px" v-show="width > 992"></el-aside>

      <el-main>
        <div class="details-ctn">
          <h2>{{ctnData.title}}</h2>

          <div>
            <output @click="findUser(ctnData.userId)">{{ctnData.userName}}</output>
            <output>{{ctnData.releaseTime | dateTimetrans}}</output>
          </div>

          <p>{{ctnData.content}}</p>
        </div>
      </el-main>

      <el-aside width="200px" v-show="width > 992"></el-aside>
    </el-container>
  </el-container>
</template>

<script>
import api from '@api'
// import main from '@main'
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
    }
  },
  data () {
    return {
      ctnData: {}
    }
  },
  methods: {
    // 通过纸条Id 获取详细内容
    paperStrip () {
      if (!this.PaperStripId) return
      api.paperStrip(this.PaperStripId).then(({data}) => {
        if (data.code === 0) this.ctnData = data.data
      })
    },
    // 跳转查询用户页面,通过userId 获取 该用户的所有纸条
    findUser (userId) {
      console.log(userId)
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
  padding: 8px 15px 10px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 2px 2px 5px #00000050;

  & > h2 {
    margin: 10px 0 7px 0;
    max-width: calc(100% -30px);
    @include overflow-ellipsis;
    font-size: 1.8rem;
  }
  & > div {
    text-align: right;
    & > output {
      padding: 5px 7px;
      border-radius: 5px;
      color: #0084ff;
    }
    & > output:first-child{
      cursor: pointer;
    }
  }
  & > p {
    text-indent: 3rem;
    font-size: 1.5rem;
  }
}
</style>
