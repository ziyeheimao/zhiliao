// @数据同步修改
const mutations = {
  SInnerSize: (state, data) => { // 内容区域尺寸
    state.InnerSize = data
  },
  SMode: (state, data) => {
    state.Mode = data // 页面模块显示
  },
  SToken: (state, data) => {
    state.Token = data
  },
  SRefresh: (state, data) => {
    state.Refresh = data
  },
  SUser: (state, data) => {
    state.User = data
  }
}

export default mutations
