// @数据获取

const getters = {
  InnerSize: (state) => { // 内容区域尺寸
    return state.InnerSize
  },
  Token: (state) => {
    return state.Token
  },
  User: (state) => { // 用户信息
    return state.User
  },
  SearchCondition: (state) => {
    return state.SearchCondition // 搜索条件
  },
  SearchAuthorName: (state) => {
    return state.SearchAuthorName // 上次搜索的作者名字
  },
  Listdata: (state) => { // 搜索结果数据
    return state.Listdata
  },
  PaperStripId: (state) => { // 纸条Id (跳转详情页时
    return state.PaperStripId
  },
  RefreshUserInfo: (state) => { // 刷新用户信息
    return state.RefreshUserInfo
  },
  FindUserList: (state) => {
    return state.FindUserList // 模糊搜索的用户信息列表
  }
}

export default getters
