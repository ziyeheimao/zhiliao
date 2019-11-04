
<template>
  <div>
    <div>
      <button type="primary" @click="select(1)" size="small">选取试卷</button>
      <button @click="upload" type="primary" size="small">上传</button>
      <input type="file" name="testPaper" id="testPaper" @change="check(1)" style="opacity: 0; width: 0;">
    </div>

    <vueCropper style="width: 300px; height: 300px;"
      ref="cropper"
      :img="picCropper.img"
      :outputSize="picCropper.size"
      :outputType="picCropper.outputType"

      :info="picCropper.info"
      :autoCrop="picCropper.autoCrop"
      :fixed='picCropper.fixed'
      :fixedNumber="picCropper.fixedNumber"

      :fixedBox="picCropper.fixedBox"
      :maxImgSize='picCropper.maxImgSize'
      >
    </vueCropper>

    <div>
      <p>预览</p>
      <img :src="hx" alt="" style="border: 1px; solid #eee">
    </div>
  </div>
</template>

<script>
// import api from '@api'
// import main from '@main'
// import { Menu, ExchangeBox, ExchangeCard } from '@myui'
import { VueCropper } from 'vue-cropper'

export default {
  components: {
    // ExchangeBox, ExchangeCard, Menu
    VueCropper
  },
  // props: [''],
  computed: {

  },
  data () {
    return {
      hx: '',
      picCropper: { // 图片裁切
        img: '', // 裁剪图片的地址 空 url 地址 || base64 || blob
        // outputSize: '', // 裁剪生成图片的质量 1 0.1 - 1
        outputType: 'jpg', // 裁剪生成图片的格式 jpg (jpg 需要传入jpeg) jpeg || png || webp
        info: true, // 裁剪框的大小信息 true true || false
        // canScale: '', // 图片是否允许滚轮缩放 true true || false
        autoCrop: true, // 是否默认生成截图框 false true || false
        // autoCropWidth: '', // 默认生成截图框宽度 容器的80% 0~max
        // autoCropHeight: '', // 默认生成截图框高度 容器的80% 0~max
        fixed: true, // 是否开启截图框宽高固定比例 true true | false
        fixedNumber: [1, 1], // 截图框的宽高比例 [1, 1] [宽度, 高度]
        // full: '', // 是否输出原图比例的截图 false true | false
        fixedBox: false, // 固定截图框大小 不允许改变 false true | false
        // canMove: '', // 上传图片是否可以移动 true true | false
        // canMoveBox: '', // 截图框能否拖动 true true | false
        // original: '', // 上传图片按照原始比例渲染 false true | false
        // centerBox: '', // 截图框是否被限制在图片里面 false true | false
        // high: '', // 是否按照设备的dpr 输出等比例图片 true true | false
        // infoTrue: '', // true 为展示真实输出图片宽高 false 展示看到的截图框宽高 false true | false
        maxImgSize: 1000 // 限制图片最大宽度和高度 2000 0-max
        // enlarge: '', // 图片根据截图框输出比例倍数 1 0-max(建议不要太大不然会卡死的呢)
        // mode: '' // 图片默认渲染方式 contain contain, cover, 100px, 100% auto
      }
    }
  },
  methods: {
    // 选择
    select () {
      document.getElementById('testPaper').click()
    },

    // 选择图片后 检测图片格式&尺寸
    check () {
      let file = document.getElementById('testPaper').files[0]
      var path = window.URL.createObjectURL(file)
      this.picCropper.img = path

      let type = document.getElementById('testPaper').files[0].type
      let size = document.getElementById('testPaper').files[0].size

      console.log(type, size)

      this.dialogVisible = true
      // if (this.checkFileType(type)) {
      //   this.fileCheck.type = true
      // } else {
      //   this.fileCheck.type = false
      // }
      // if (this.checkFileSize(size)) {
      //   this.fileCheck.size = true
      // } else {
      //   this.fileCheck.size = false
      // }
    },

    // 上传
    upload () {
      // let data = new FormData()
      // data.append('testPaper', document.getElementById('testPaper').files[0]) // 学生表
      // data.append('testQuestionsPosition', JSON.stringify(this.form.testQuestionsPosition)) // 定位数据
      // data.append('userId', this.form.userId) // 通过append向form对象添加数据 userId

      // this.$refs.cropper.startCrop() // 开始截图
      // this.$refs.cropper.stopCrop() // 停止截图
      // this.$refs.cropper.clearCrop() // 清除截图
      // this.$refs.cropper.changeScale() // 修改图片大小 正数为变大 负数变小
      // this.$refs.cropper.getImgAxis() // 获取图片基于容器的坐标点
      // this.$refs.cropper.getCropAxis() // 获取截图框基于容器的坐标点
      // this.$refs.cropper.goAutoCrop // 自动生成截图框函数
      // this.$refs.cropper.rotateRight() // 向右边旋转90度
      // this.$refs.cropper.rotateLeft() // 向左边旋转90度

      // 获取截图的blob数据
      this.$refs.cropper.getCropBlob((data) => {
        // do something
        console.log('blob', data)
      })

      // 获取截图的base64 数据
      this.$refs.cropper.getCropData((data) => {
        // do something
        this.hx = data
        console.log('base64', data)
      })

      // api.uploadTestPaper(data).then(({data}) => {
      //   console.log('上传成功', data)
      // }).catch(err => {
      //   console.log('上传失败', err)
      // })
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

<style lang="scss" scoped>
@import '@style/index.scss';

</style>
