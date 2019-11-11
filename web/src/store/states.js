const state = {
  InnerSize: { // 内容区域尺寸
    width: '',
    height: ''
  },
  Token: window.sessionStorage.getItem('token'), // token
  Refresh: true, // 刷新
  User: JSON.parse(window.sessionStorage.getItem('user')) ? JSON.parse(window.sessionStorage.getItem('user')) : {}, // 用户信息 // json字符串转对象
  SearchCondition: JSON.parse(window.sessionStorage.getItem('searchCondition')) ? JSON.parse(window.sessionStorage.getItem('searchCondition')) : { keyword: '' }, // type: 0 // 搜索条件
  Listdata: [], // 搜索结果数据
  PaperStripId: window.sessionStorage.getItem('paperStripId') // 纸条Id (跳转详情页时
}

export default state
