// @数据异步修改

export default {
  AMode: (context, data) => {
    context.commit('SMode', data) // 页面模块显示
  },
  AToken: (context, data) => {
    context.commit('SToken', data)
  },
  ARefresh: (context, data) => {
    context.commit('SRefresh', data)
  },
  AUser: (context, data) => {
    context.commit('SUser', data)
  },
  ASearchCondition: (context, data) => {
    context.commit('SSearchCondition', data) // 搜索条件
  },
  AListdata: (context, data) => {
    context.commit('SListdata', data) // 搜索结果数据
  }
}
