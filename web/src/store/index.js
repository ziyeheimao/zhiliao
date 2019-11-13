// @vuex入口
import Vue from 'vue'
import Vuex from 'vuex'

import state from './states.js' // 状态值
import mutations from './mutations.js' // 同步修改 state的值
import actions from './actions.js' // 异步修改 state的值
import getters from './getters.js' // 取

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
