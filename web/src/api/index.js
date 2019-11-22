import axios from '../axios'

export default {
  // -------------------------------------------------用户↓-----------------------------------------------------
  // 检测 昵称 手机 邮箱 是否注册
  checkUserNamePhoneEmail (data, code = 0) {
    if (code === 0) {
      return axios.get(`/user/checkUserNamePhoneEmail?field=${data.field}`) // 注册时不带userId
    } else if (code === 1) {
      return axios.get(`/user/checkUserNamePhoneEmail?field=${data.field}&userId=${data.userId}`) // 修改时带userId排除自身
    }
  },

  // 注册
  register (data) {
    return axios.post(`/user/register`, data)
  },

  // 登录
  login (data) {
    return axios.post(`/user/login`, data)
  },

  // 头像上传
  userPicUpload: `/user/userPic/upload`,

  // 通过token获取当前用户信息 修改用户信息后刷新
  getUserInfo () {
    return axios.get(`/user/getUserInfo`)
  },

  // 修改个人信息
  setUserInfo (data) {
    return axios.put(`/user/setUserInfo`, data)
  },

  // 获取验证码
  verificationCode (field) {
    return axios.get(`/user/verificationCode?field=${field}`)
  },

  // 忘记密码
  forgetPassword (data) {
    return axios.put(`/user/forgetPassword`, data)
  },
  // -------------------------------------------------用户↑-----------------------------------------------------

  // -------------------------------------------------其它↓-----------------------------------------------------
  // 区域信息
  regionInfo () {
    return axios.get(`/other/regionInfo`)
  },

  // 职业信息
  occupation () {
    return axios.get(`/other/occupation`)
  },
  // -------------------------------------------------其它↑-----------------------------------------------------

  // -------------------------------------------------内容↓-----------------------------------------------------
  // 获取搜索热词
  getHotWords (keyword) {
    return axios.get(`/ctn/getHotWords?keyword=${keyword}`)
  },

  // 标题+正文+关键字 广泛搜索
  widelySearch (data) {
    if (!data.type) return axios.post(`/ctn/widelySearch`, data)
    else return axios.post(`/ctn/widelySearch`, data)
  },

  // 搜索作者名时搜索 辅助
  authorName (keyword) {
    return axios.get(`/ctn/authorName?keyword=${keyword}`)
  },

  // 搜索作者
  author (data) {
    return axios.get(`/ctn/author?keyword=${data.keyword}&userId=${data.userId}`)
  },

  // 获取某个用户的纸条数量
  authorPaperStripCount (userId) {
    return axios.get(`/ctn/authorPaperStripCount?userId=${userId}`)
  },

  // 通过Id 获取纸条(帖子)
  paperStrip (paperStripId) {
    return axios.get(`/ctn/paperStrip?paperStripId=${paperStripId}`)
  },

  // 发布纸条
  releasePaperStrip (data) {
    return axios.post('/ctn/releasePaperStrip', data)
  },

  // 删除纸条
  delPaperStrip (paperStripId) {
    return axios.delete(`/ctn/delPaperStrip?paperStripId=${paperStripId}`)
  },

  // 修改纸条
  upDataPaperStrip (data) {
    return axios.put(`/ctn/upDataPaperStrip`, data)
  },

  // 通过用户id获取该用户所有纸条u
  findPaperStripByUserId (userId) {
    return axios.get(`/ctn/findPaperStripByUserId?userId=${userId}`)
  }
  // -------------------------------------------------内容↑-----------------------------------------------------

}
