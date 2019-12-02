import Vue from 'vue'
// import DOMToImage from '@static/js/dom-to-image.js' // DOM渲染图片
// eslint-disable-next-line no-unused-vars
// import FileSaver from '@static/js/FileSaver.js' // 文件转码
const vue = new Vue()

const serverUrl = 'http://127.0.0.1:80' // 服务器地址
// const serverUrl = 'http://929b537c.ngrok.io:80' // 内网穿透地址

// const defaultPic = 'http://127.0.0.1:666/static/userPic/defaultPic.png' // 默认头像

// 克隆对象
const clone = function (obj) {
  let newObj = {}
  for (let k in obj) {
    newObj[k] = obj[k]
  }
  return newObj
}

const random = {// 随机
  // 取两个数之间随机数
  num: function (min = 0, max = 100, len = 0) {
    return Number((min + (max - min) * Math.random()).toFixed(len))
  },

  // 任意长度 随机字符串
  str: function (len = 8) {
    let str = ''
    let list = '0123456789abcdefghijklmnopqrstuvwxyz'
    for (let i = 0; i < len; i++) {
      let index = this.num(0, 35)
      let word = list[index]
      if (isNaN(word) && this.num() < 50) {
        word = word.toUpperCase()
      }
      str += word
    }
    return str
  },

  // 随机字母
  letter: function (len = 8) {
    let str = ''
    let list = 'abcdefghijklmnopqrstuvwxyz'
    for (let i = 0; i < len; i++) {
      let index = this.num(0, 26)
      let word = list[index]
      if (isNaN(word) && this.num() < 50) {
        word = word.toUpperCase()
      }
      str += word
    }
    return str
  }
}

// 去掉空格（两种方法都可以）
const delSpace = function (str) {
  str = str.replace(/\+/g, '')
  return str
  // str = str.replace(/[ ]/g, '')
}

// 数组去重
const distinct = function (...rest) {
  return Array.from(new Set([...rest]))
}

// 对对象数组按某个属性去重
const distinctByKey = function (key, arr) {
  let keyList = []
  for (let i of arr) {
    keyList.push(i[key])
  }

  keyList = Array.from(new Set([...keyList]))

  let resArr = []
  for (let i of keyList) {
    for (let j of arr) {
      if (i === j[key]) {
        resArr.push(j)
        break
      }
    }
  }

  return resArr
}

// 限制数组为指定长度
const len = function (arr, len) {
  if (arr.length === undefined || arr === undefined) {
    return []
  }
  let len_ = arr.length
  let index = 0
  if (len_ > len) {
    index = len_ - len
  }
  for (let i = 0; i < index; i++) {
    arr.pop()
  }
  return arr
}

// 消息提示
const openInfo = function (msg) {
  vue.$message({ showClose: true, message: msg })
}
// 成功提示
const openSuccessInfo = function (msg) {
  vue.$message({ showClose: true, message: msg, type: 'success' })
}
// 警告信息
const openWarningInfo = function (msg) {
  vue.$message({ showClose: true, message: msg, type: 'warning' })
}
// 错误信息
const openErrorInfo = function (msg) {
  vue.$message({ showClose: true, message: msg, type: 'error' })
}
// 传入返回的data 根据状态码调用提示框
const msg = function (code, msg) {
  if (code === 0) {
    openSuccessInfo(msg)
    return true
  } else {
    openErrorInfo(msg)
    return false
  }
}
const strToH5 = function (val) {
  val = val.replace(/\n/g, '<br/>') // 换行替换

  val = val.replace(/《《/g, '<h4>') // 标题替换
  val = val.replace(/》》/g, '</h4>') // 标题替换

  val = val.replace(/@@/g, '<pre><code>') // 代码块替换
  val = val.replace(/##/g, '</code></pre>') // 代码块替换
  return val
}
const H5ToStr = function (val) {
  val = val.replace(/<br\/>/ig, '\n') // 换行替换

  val = val.replace(/<h4>/ig, '《《') // 标题替换
  val = val.replace(/<\/h4>/ig, '》》') // 标题替换

  val = val.replace(/<pre><code>/ig, '@@') // 代码块替换
  val = val.replace(/<\/code><\/pre>/ig, '##') // 代码块替换
  return val
}

// 图片处理                元素     质量0-1        最大宽高           浮水印内容                 最小           文件最大体积
const imgHandle = function (e, quality = 0.8, myWidth = 1024, ctnStr = '知了 (๑•̀ㅂ•́)و✧', minSize = 100, maxSize = 1024 * 1.5) { // 上传图片处理 1转码base64 2按比例缩放宽高到允许范围内 3压缩文件体积到的指定大小范围 4加浮水印
  let base64 = e.target.result // 转码过后的base64编码
  // console.log('压缩前', base64.length / 1024)
  var newBase64 = null
  // 创建一个图片
  let newImage = new Image()
  // let quality = 0.6 // 压缩系数0-1之间，压缩到0.9以上会有bug，注意！（可以自行设置）
  newImage.src = base64
  newImage.setAttribute('crossOrigin', 'Anonymous') // url为外域时需要 图片跨域？
  let imgWidth, imgHeight

  return new Promise((resolve, reject) => {
    newImage.onload = function () {
      imgWidth = this.width
      imgHeight = this.height
      // 给生成图片设置一个默认的最大宽/高（可以自行设置）
      // let myWidth = 800

      // 准备在画布上绘制图片
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')

      // 判断上传的图片的宽高是否超过设置的默认最大值，以及设置同比例的宽高
      if (Math.max(imgWidth, imgHeight) > myWidth) {
        if (imgWidth > imgHeight) {
          canvas.width = myWidth // 宽度直接赋值
          canvas.height = myWidth * imgHeight / imgWidth // 高度按比例缩放
        } else {
          canvas.height = myWidth // 高度度直接赋值
          canvas.width = myWidth * imgWidth / imgHeight // 宽度按比例缩放
        }
      } else {
        canvas.width = imgWidth
        canvas.height = imgHeight
      }

      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // 开始绘制图片到画布上
      ctx.drawImage(this, 0, 0, canvas.width, canvas.height) // 图片画到画布上

      // 绘制文字水印
      ctx.font = '15px microsoft yahei'
      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      // let ctnStr = '知了 (๑•̀ㅂ•́)و✧' // 浮水印内容
      var ctnWidth = ctx.measureText(ctnStr).width // 计算文本宽度/返回文本宽度
      ctx.fillText(ctnStr, canvas.width - ctnWidth - 10, canvas.height - 10) // 内容及绘制的坐标位置

      newBase64 = canvas.toDataURL('image/jpeg', quality) // 压缩图片大小（关键代码）

      // 获取到当前的图片的大小，然后调整成自己需要的大小，例如说需要200KB-500KB之间（可以自行设置）
      while (newBase64.length / 1024 > maxSize) {
        quality -= 0.02
        newBase64 = canvas.toDataURL('image/jpeg', quality)
      }

      while (newBase64.length / 1024 < minSize && base64.length / 1024 > minSize) {
        quality += 0.02
        newBase64 = canvas.toDataURL('image/jpeg', quality)
      }
      // console.log('压缩后base64', newBase64.length / 1024)
      // throw new Error(newBase64)
      resolve(newBase64)
    }
  })
}

// 导出
export default {
  serverUrl,
  random,
  clone,
  delSpace,
  distinct,
  distinctByKey,
  len,
  openInfo,
  openSuccessInfo,
  openWarningInfo,
  openErrorInfo,
  msg,
  strToH5,
  H5ToStr,
  imgHandle
}
