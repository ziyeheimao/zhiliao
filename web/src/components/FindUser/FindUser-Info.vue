<template>
  <div v-if='activate !== -1 && FindUserList.length !== 0' class="userData">
    <div class="pic">
      <el-avatar :size="200" :src="FindUserList[activate].userPic" style="border: 2px solid #ddd; margin-top:12px;"></el-avatar>
    </div>

    <div class="info">
      <p>
        <output class="userName">{{FindUserList[activate].userName}}</output>
        &nbsp;
        <output class="sex" :class="FindUserList[activate].sex === 1 ? 'sex1' : FindUserList[activate].sex === 2 ? 'sex2' : ''">{{FindUserList[activate].sex | sex}}</output>
      </p>

      <p>
        <output>
          纸条:
          <el-link type="primary">{{PaperStripCount}}</el-link>
        </output>
        &nbsp;
        <output>
          粉丝:
          <el-link type="primary">{{0}}</el-link><!-- FindUserList[activate].sex -->
        </output>
        &nbsp;
        <output>
          关注:
          <el-link type="primary">{{0}}</el-link>
        </output>
      </p>
    </div>
  </div>
</template>

<script>
import api from '@api'
export default {
  props: ['FindUserList', 'activate'],
  data () {
    return {
      PaperStripCount: 0
    }
  },
  methods: {
    authorPaperStripCount () {
      if (this.activate === -1 || this.FindUserList.length === 0) return
      api.authorPaperStripCount(this.FindUserList[this.activate].userId).then(({data}) => {
        this.PaperStripCount = data.data
      })
    }
  },
  created () {
    this.authorPaperStripCount()
  },
  watch: {
    FindUserList () {
      this.authorPaperStripCount()
    },
    activate () {
      this.authorPaperStripCount()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@style/index.scss';
// 用户介绍部分
.userData{
  background: #eee;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  & > .info{
    text-align: center;
    margin-top: 15px;
    font-size: 1.4rem;
    font-family: huakang-shaonv;
  }
}
</style>
