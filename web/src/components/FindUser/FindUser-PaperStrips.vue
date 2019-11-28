<template>
  <div>
    <ul class="list">
      <li v-for="(v, k) in paperStrip" :key="k" @click="details(v)">
        <h4>{{v.title}}</h4>

        <div class="time">
          <output>{{v.releaseTime | dateTimetrans}}</output>
        </div>

        <p v-html="v.content"></p>
      </li>
      <li class="null" v-if="paperStrip.length === 0">这家伙很懒 什么都没留下 ╮(๑•́ ₃•̀๑)╭ </li>
    </ul>
  </div>
</template>

<script>
import api from '@api'
// import main from '@main'

export default {
  components: {
    // x
  },
  props: {
    UserId: {
      type: Number, // 非实时派发scroll事件和位置参数, 类型由0,1,2,3,
      default: 0
    }
  },
  computed: {

  },
  data () {
    return {
      paperStrip: [],
      userId: this.$route.query.userId
    }
  },
  methods: {
    findPaperStripByUserId () {
      if (!this.userId) return
      api.findPaperStripByUserId(this.userId).then(({data}) => {
        this.paperStrip = data.data.reverse()
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
  created () {
    this.findPaperStripByUserId()
  },
  beforeMount () {},
  mounted () {},
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {},
  deactivated () {},
  watch: {
    '$route.query.userId' () {
      this.userId = this.$route.query.userId
      this.findPaperStripByUserId()
    }
  }

}
</script>

<style lang='scss' scoped>
@import '@style/index.scss';
.list{
  & > li{
    margin: 15px 0;
    padding: 15px;
    cursor: pointer;
    &>h4{
      font-size: 1.3rem;
      @include overflow-ellipsis;
    }
    &>div.time{
      text-align: right;
    }
    &>p{
      text-indent: 2rem;
      @include Overflow-ellipsis(3)
    }
  }
  & > li ~ li {
    border-top: 1px solid #ccc;
  }
  & > li:hover{
    background-color: rgb(224, 255, 228);
  }
}

@import '@style/null.scss';
li.null{
  border: 1px dashed #bbb;
  background-color: #ffece0;
}
</style>
