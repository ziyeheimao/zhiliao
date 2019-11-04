// @数据获取

const getters = {
  InnerSize: (state) => { // 内容区域尺寸
    return state.InnerSize
  },
  Mode: (state) => {
    return state.Mode // 页面模块显示
  },
  Token: (state) => {
    return state.Token
  },
  Refresh: (state) => {
    return state.Refresh
  },
  User: (state) => { // 用户信息
    return state.User
  }
}

export default getters
