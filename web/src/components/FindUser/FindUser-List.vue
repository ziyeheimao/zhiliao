<template>
  <section ref="section">

    <div class="my-btn my-btn-left el-icon-arrow-left" @click="slide(1)"></div>
    <div :style="'width:'+ScrollWidth+'px;overflow: hidden;'">
      <Scroll ref="scroll" class="scroll" :step='ScrollWidth*0.8' :direction='direction' :style="'width:'+ScrollWidth+'px;'">

        <ul class="find-user-list" :style="'width:'+(ScrollWidth+1)+'px;min-width:'+listMinWidth+'px;'">
          <li v-for="(v, k) in FindUserList" :key="k" @click="activate(v, k)"
            :class="activateIndex === k ? 'activate' : ''">
            <div class="pic">
              <el-avatar :size="85" :src="v.userPic" style="margin-top: 10px;"></el-avatar>
            </div>

            <div class="info">
              <p>
                <output class="userName">
                  {{v.userName}}
                  <span class="sex" :class="v.sex === 1 ? 'sex1' : v.sex === 2 ? 'sex2' : ''">{{v.sex | sex}}</span>
                </output>
              </p>

              <!-- <p>
                <output>
                  纸条:
                  <el-link type="primary">{{v.sex}}</el-link>
                </output>
              </p> -->
            </div>
          </li>
        </ul>

      </Scroll>
    </div>
    <div class="my-btn my-btn-right el-icon-arrow-right" @click="slide(-1)"></div>

  </section>
</template>

<script>
// import api from '@api'
// import main from '@main'
import Scroll from '../MyUI/Scroll'

export default {
  components: {
    Scroll
  },
  // props: [''],
  computed: {
    FindUserList () {
      return this.$store.getters.FindUserList
    },
    Width () {
      return this.$store.getters.InnerSize.width
    },
    // 滚动容器宽度
    ScrollWidth () {
      let width = this.sectionWidth - 60
      return width
    },
    // ul最小宽度(确保不会被 flex 挤变形)
    listMinWidth () {
      return (140 + 20) * this.FindUserList.length
    }
  },
  data () {
    return {
      // 滚动容器
      // step: 200, // 步长 / px
      direction: 1, // 方向倍率 1 / -1
      sectionWidth: 0, // 外层容器宽度
      activateIndex: -1
    }
  },
  methods: {
    slide (type) {
      if (type === 1) {
        this.direction = 0
        setTimeout(() => { this.direction = 1 }, 100)
      } else if (type === -1) {
        this.direction = 0
        setTimeout(() => { this.direction = -1 }, 100)
      }
    },
    // 获取Section宽度
    getSectionWidth () {
      this.sectionWidth = this.$refs.section.offsetWidth
    },
    activate (v, k) {
      this.activateIndex = k // 激活颜色
      this.$emit('activate', k)
    }
  },
  beforeCreate () {},
  created () {},
  beforeMount () {},
  mounted () {
    this.getSectionWidth()
  },
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {},
  deactivated () {},
  watch: {
    Width () {
      this.getSectionWidth()
    }
  }

}
</script>

<style lang='scss' scoped>
@import '@style/index.scss';
section{
  width: 100%;

  @include scrollHidden;
  @include flex-between-center;
  & > .my-btn{
    background-color: #00000015;
    height: 175px;
    width: 30px;
    font-size: 2rem;
    text-align: center;
    line-height: 175px;
    cursor: pointer;
    color: #666;
  }
  & > .my-btn:hover{
    background-color: rgba(147, 201, 255, 0.548);
    color: rgb(64 , 158, 255);
  }
  & > .my-btn-left{
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;

    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
  }
  & > .my-btn-right{
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;

    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }
}
ul.find-user-list{
  display: flex;
  justify-content: center; // 考试卡片 对齐方式
  overflow: hidden;

  & > li{
    margin: 10px;
    width: 140px;
    height: 170px;
    border-radius: 5px;
    border: 1px solid #eee;
    box-shadow: 2px 2px 5px #00000050;
    background-color: rgb(243, 252, 255);
    cursor: pointer;
    transition: all linear 0.6s;

    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    .pic>.el-avatar{
      border: 1px solid #ccc;
    }
    .info>p{
      font-family: huakang-shaonv;
      font-size: 1.4rem;
      text-align: center;
      vertical-align: baseline;

      output{
        display: inline-block;
        max-width: 90px;
        @include overflow-ellipsis;
      }
    }
  }
  & > li:hover{
    box-shadow: 4px 4px 8px #00000060;
    background-color: rgb(224, 255, 228);
  }
  li.activate {
    box-shadow: 4px 4px 8px #00000060;
    background-color: rgb(255, 236, 224);
  }
}

</style>
