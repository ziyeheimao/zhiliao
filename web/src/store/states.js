const state = {
  InnerSize: { // 内容区域尺寸
    width: '',
    height: ''
  },
  Token: window.sessionStorage.getItem('token'), // token
  Refresh: true, // 刷新
  User: JSON.parse(window.sessionStorage.getItem('user')), // 用户信息 // json字符串转对象
  SearchCondition: { // 搜索条件
    keyword: ''
    // type: 0
  },
  Listdata: [], // 搜索结果数据
  PaperStripId: '' // 纸条Id (跳转详情页时
}

export default state
