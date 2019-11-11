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

  // 获取验证码
  verificationCode (field) {
    return axios.get(`/user/verificationCode?field=${field}`)
  },

  // 修改密码
  forgetPassword (data) {
    return axios.put(`/user/forgetPassword`, data)
  },

  // 获取当前用户信息(通过token)
  getUserInfo () {
    return axios.get(`/user/getUserInfo`)
  },
  // -------------------------------------------------用户↑-----------------------------------------------------

  // -------------------------------------------------内容: 分类↓-----------------------------------------------------
  // 添加分类
  classAdd (data) {
    return axios.post(`/ctn/class/add`, data)
  },

  // 删除分类
  classDel (classId) {
    return axios.delete(`/ctn/class/del?classId=${classId}`)
  },

  // 修改分类
  classUpdata (data) {
    return axios.put(`/ctn/class/updata`, data)
  },

  // 获取分类
  classGet () {
    return axios.get(`/ctn/class/get`)
  },

  // 分类拖拽排序
  classExchange (data) {
    return axios.put(`/ctn/class/exchange`, data)
  },
  // -------------------------------------------------内容: 分类↑-----------------------------------------------------

  // -------------------------------------------------内容: 卡片↓-----------------------------------------------------
  // 添加卡片 (json形式)
  cardAdd (data) {
    return axios.post(`/ctn/card/add`, data)
  },

  // 添加卡片 (文件形式)
  cardUpload: '/ctn/card/upload',

  // 删除卡片
  cardDel (webId) {
    return axios.delete(`/ctn/card/del?webId=${webId}`)
  },

  // 修改卡片
  cardUpdata (data) {
    return axios.put(`/ctn/card/updata`, data)
  },

  // 获取卡片
  cardGet (data) {
    return axios.get(`/ctn/card/get?classId=${data.classId}&page=${data.page}&limit=${data.limit}`)
  },

  // 卡片拖拽换位
  cardExchange (data) {
    return axios.put(`/ctn/card/exchange`, data)
  },

  // 卡片移动到某分类
  cardToClass (data) {
    return axios.put('ctn/card/toClass', data)
  },

  // 卡片添加到某分类
  cardAddClass (data) {
    return axios.put('ctn/card/addClass', data)
  },

  // 删除卡片的某个分类
  cardDelClass (data) {
    return axios.delete(`/ctn/card/delClass?webId=${data.webId}&classId=${data.classId}`)
  },
  // -------------------------------------------------内容: 卡片↑-----------------------------------------------------

  // -------------------------------------------------管理↓-----------------------------------------------------
  // -------------------------------------------------管理↑-----------------------------------------------------

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

  // 获取搜索热词
  getHotWords (keyword) {
    return axios.get(`/ctn/getHotWords?keyword=${keyword}`)
  },
  // 标题+正文+关键字 广泛搜索
  widelySearch (data) {
    if (!data.type) return axios.post(`/ctn/widelySearch`, data)
    else return axios.post(`/ctn/widelySearch`, data)
  },
  // 通过Id 获取纸条(帖子)
  paperStrip (paperStripId) {
    return axios.get(`/ctn/paperStrip?paperStripId=${paperStripId}`)
  },

  // 登录
  login (data) {
    return axios.post(`/user/login`, data)
  }
}
