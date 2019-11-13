// @数据获取

const getters = {
  InnerSize: (state) => { // 内容区域尺寸
    return state.InnerSize
  },
  Token: (state) => {
    return state.Token
  },
  Refresh: (state) => {
    return state.Refresh
  },
  User: (state) => { // 用户信息
    return state.User
  },
  SearchCondition: (state) => {
    return state.SearchCondition // 搜索条件
  },
  Listdata: (state) => { // 搜索结果数据
    return state.Listdata
  },
  PaperStripId: (state) => { // 纸条Id (跳转详情页时
    return state.PaperStripId
  },
  RefreshUserInfo: (state) => { // 刷新用户信息
    return state.RefreshUserInfo
  }
}

export default getters
