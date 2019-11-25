<template>
  <ul class="list">
    <li v-for="(v, k) in Listdata" :key="k" @click="details(v)">
      <h4>{{v.title}}</h4>

      <div>
        <el-link type="primary" @click.stop="findUser(v)">
          <output>{{v.userName}}</output>
        </el-link>

        <el-link type="primary" :underline="false">
          <output>{{v.releaseTime | dateTimetrans}}</output>
        </el-link>
      </div>

      <p v-html="v.content"></p>
    </li>

    <li class="null" v-if="Listdata.length === 0">暂无数据 请尝试更换关键词 (。_。)... </li>
  </ul>
</template>

<script>
// import api from '@api'
// import main from '@main'

export default {
  components: {
    // x
  },
  // props: [''],
  computed: {
    Listdata () {
      return this.$store.getters.Listdata
    }
  },
  data () {
    return {}
  },
  methods: {
    findUser (user) {
      this.$router.push({
        name: `FindUser`,
        query: {
          userName: user.userName, userId: user.userId
        }
      })
    },
    details (v) {
      let paperStripId = v.paperStripId
      this.$store.commit('SPaperStripId', paperStripId)

      let _paperStripId = JSON.stringify(paperStripId) // 对象转json字符串
      window.sessionStorage.setItem('paperStripId', _paperStripId)

      let data = { keyword: v.title }
      let searchCondition = JSON.stringify(data) // 对象转json字符串
      window.sessionStorage.setItem('searchCondition', searchCondition)
      this.$store.commit('SSearchCondition', data)

      this.$router.push('/details')
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
.list > li {
  color: #333;
  padding: 8px 15px 10px;
  background-color: #fff;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 2px 2px 5px #00000050;
  & > h4 {
    margin: 10px 0 7px 0;
    max-width: 70%;
    font-size: 1.5rem;
    @include overflow-ellipsis;
  }
  & > div {
    text-align: right;
    & > output {
      margin: 0 5px;
    }
  }
  & > p {
    @include Overflow-ellipsis(3);
    text-indent: 2rem;
  }
}
.list > li:hover {
  box-shadow: 3px 3px 7px #00000070;
}
.list > li ~ li {
  margin-top: 10px;
}

@import '@style/null.scss';
</style>
