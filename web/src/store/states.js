const state = {
  InnerSize: { // 内容区域尺寸
    width: '',
    height: ''
  },
  Token: window.sessionStorage.getItem('token'), // token
  User: JSON.parse(window.sessionStorage.getItem('user')) ? JSON.parse(window.sessionStorage.getItem('user')) : {}, // 用户信息 // json字符串转对象
  SearchCondition: JSON.parse(window.sessionStorage.getItem('searchCondition')) ? JSON.parse(window.sessionStorage.getItem('searchCondition')) : { keyword: '' }, // type: 0 // 搜索条件
  SearchAuthorName: window.sessionStorage.getItem('searchAuthorName'), // 上次搜索的作者名字
  Listdata: [], // 搜索结果数据
  PaperStripId: window.sessionStorage.getItem('paperStripId'), // 纸条Id (跳转详情页时
  RefreshUserInfo: false, // 刷新用户信息
  FindUserList: JSON.parse(window.sessionStorage.getItem('findUserList')) ? JSON.parse(window.sessionStorage.getItem('findUserList')) : [] // 模糊搜索的用户信息列表
}

export default state
