// @数据异步修改

export default {
  AToken: (context, data) => {
    context.commit('SToken', data)
  },
  AUser: (context, data) => {
    context.commit('SUser', data)
  },
  AListdata: (context, data) => {
    context.commit('SListdata', data) // 搜索结果数据
  },
  ARefreshUserInfo: (context, data) => {
    context.commit('SRefreshUserInfo', data) // 刷新用户信息
  },
  AFindUserList: (context, data) => { // 模糊搜索的用户信息列表
    context.commit('SFindUserList', data)
  }
}
