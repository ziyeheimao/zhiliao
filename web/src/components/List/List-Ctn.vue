<template>
  <ul class="list">
    <li v-for="(v, k) in Listdata" :key="k" @click="details(v.paperStripId)">
      <h4>{{v.title}}</h4>

      <div>
        <!-- <img src="" alt=""> -->
        <output>{{v.userName}}</output>
        <output>{{v.releaseTime | dateTimetrans}}</output>
      </div>

      <p>{{v.content}}</p>
    </li>
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
    details (paperStripId) {
      this.$store.commit('SPaperStripId', paperStripId)
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
</style>
