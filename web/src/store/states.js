const state = {
  InnerSize: { // 内容区域尺寸
    width: '',
    height: ''
  },
  Mode: 0, // 页面模块显示
  Token: window.sessionStorage.getItem('token'), // token
  Refresh: true, // 刷新
  User: JSON.parse(window.sessionStorage.getItem('user')) // 用户信息 // json字符串转对象
}

export default state
