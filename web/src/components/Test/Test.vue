<template>
  <div class="finish_roow" style="width: 100%;">
    <div class="finish_room2" style="display: flex; flex-wrap: wrap;">
      <div v-for="(item, index) in imgUrl" :key="index" class="room_img">
        <img :src="item" alt="" class="mb-35">
        <span @click="delete_img(index)">x</span>
      </div>

      <div class="room_add_img">
        <span>
          上传 图片?
        </span>
        <span>上传图片</span>
        <input @change="add_img" type="file">
      </div>
    </div>
  </div>
</template>

<script>
// import api from '@api'
// import main from '@main'

export default {
  components: {

  },
  // props: [''],
  computed: {

  },
  data () {
    return {
      message: '',
      imgUrl: [], // 获取图片的数组
      cate: [], // 帖子分类
      save: [],
      booleans: false
    }
  },
  methods: {
    getCate (id) { // 获取帖子分类id
      this.cate_id = id
    },
    delete_img (item) { // 点击删除图片
      this.imgUrl.splice(item, 1)
    },
    add_img (event) { // 点击添加图片
      let reader = new FileReader() // 创建一个reader
      let img1 = event.target.files[0]

      reader.readAsDataURL(img1) // 将图片转为base64

      reader.onloadend = () => {
        this.imgUrl.push(reader.result)
        console.log('base64?', this.imgUrl)
      }
    },
    release () { // 点击发布按钮
      // 获取文本框的内容
      this.content = this.$refs.message.$el.getElementByClassName('van-field__control')[0].value

      // 带参数调用接口
      // postService.pushPost({cate_id: this.cate_id, content: this.content, image: this.imgUrl}).then(e => {
      //   this.save = e.data
      // })

      // 获取之后使文本内容为空
      this.$refs.message.$el.getElementByClassName('van-field__control')[0].value = ''
      // this.$router.push({path: '/'})
      alert('发布成功')
    }
  },
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
    // postService.postCate().then(e => {
    //   this.cate = e.data
    // })
  },
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {},
  deactivated () {},
  // beforeRouteEnter (to, from, next) {
  //   // do someting
  //   // 在渲染该组件的对应路由被 confirm 前调用
  //   console.log('beforeRouteEnter', to, from, next)
  // },
  // beforeRouteUpdate (to, from, next) {
  //   // do someting
  //   // 在当前路由改变，但是依然渲染该组件是调用
  //   console.log('beforeRouteUpdate', to, from, next)
  // },
  // beforeRouteLeave (to, from, next) {
  //   console.log('beforeRouteLeave', to, from, next)
  //   // do someting
  //   // 导航离开该组件的对应路由时被调用
  // },
  watch: {}
}
</script>

<style lang='scss' scoped>
@import '@style/index.scss';
.finish_room{
  width: 430px;
  height: auto;
}
.finish_room2{
  width: 100%;
  height: auto;
  padding-top: 15px;
}
</style>
