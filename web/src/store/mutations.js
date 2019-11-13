// @数据同步修改
const mutations = {
  SInnerSize: (state, data) => { // 内容区域尺寸
    state.InnerSize = data
  },
  SToken: (state, data) => {
    state.Token = data
  },
  SRefresh: (state, data) => {
    state.Refresh = data
  },
  SUser: (state, data) => {
    state.User = data
  },
  SSearchCondition: (state, data) => { // 搜索条件
    state.SearchCondition = data
  },
  SListdata: (state, data) => { // 搜索结果数据
    state.Listdata = data
  },
  SPaperStripId: (state, data) => { // 纸条Id (跳转详情页时
    state.PaperStripId = data
  },
  SRefreshUserInfo: (state, data) => { // 刷新用户信息
    state.RefreshUserInfo = data
  }
}

export default mutations
