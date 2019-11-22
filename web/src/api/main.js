import Vue from 'vue'
// import DOMToImage from '@static/js/dom-to-image.js' // DOM渲染图片
// eslint-disable-next-line no-unused-vars
// import FileSaver from '@static/js/FileSaver.js' // 文件转码
const vue = new Vue()

const serverUrl = 'http://127.0.0.1:80' // 服务器地址
// const serverUrl = 'http://929b537c.ngrok.io:80' // 内网穿透地址

// const defaultPic = 'http://127.0.0.1:666/static/userPic/defaultPic.png' // 默认头像

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
// 导出
export default {
  serverUrl,
  delSpace,
  distinct,
  len,
  openInfo,
  openSuccessInfo,
  openWarningInfo,
  openErrorInfo,
  msg,
  strToH5,
  H5ToStr
}
