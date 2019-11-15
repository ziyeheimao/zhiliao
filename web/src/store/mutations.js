// @数据同步修改
const mutations = {
  SInnerSize: (state, data) => { // 内容区域尺寸
    state.InnerSize = data
  },
  SToken: (state, data) => {
    state.Token = data
  },
  SUser: (state, data) => {
    state.User = data
  },
  SSearchCondition: (state, data) => { // 搜索条件
    state.SearchCondition = data
  },
  SSearchAuthorName: (state, data) => { // 上次搜索的作者名字
    state.SearchAuthorName = data
  },
  SListdata: (state, data) => { // 搜索结果数据
    state.Listdata = data
  },
  SPaperStripId: (state, data) => { // 纸条Id (跳转详情页时
    state.PaperStripId = data
  },
  SRefreshUserInfo: (state, data) => { // 刷新用户信息
    state.RefreshUserInfo = data
  },
  SFindUserList: (state, data) => {
    state.FindUserList = data // 模糊搜索的用户信息列表
  }
}

export default mutations
