import axios from 'axios'
import store from '../store'
import router from '../router'
import {Message} from 'element-ui'

// 设置全局axios默认值
axios.defaults.timeout = 10000 // 10000的超时验证
axios.defaults.baseURL = 'http://127.0.0.1:666'
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// axios.defaults.headers.post['Content-Type'] = 'x-www-form-urlencoded'

// 创建一个axios实例
const http = axios.create()
http.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// axios.defaults.headers.post['Content-Type'] = 'x-www-form-urlencoded'

axios.interceptors.request.use = http.interceptors.request.use

// request拦截器
http.interceptors.request.use(
  config => {
    // 每次发送请求之前检测都vuex存有token,那么都要放在请求头发送给服务器
    if (store.state.Token) {
      config.headers.Token = `${store.state.Token}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// respone拦截器
http.interceptors.response.use(res => {
  if (res.data.code === 1001) {
    Message.error({message: res.data.msg}) // token问题
    router.push('/inlet') // 返回登陆页
  } else if (res.data.code === 1002) { // 接口开发中
    Message.error({message: res.data.msg})
  } else if (res.data.code === 1003) {
    Message.error({message: '用户不存在'})
  } else if (res.data.code === 1004) {
    Message.error({message: 'token错误'})
    router.push('/login')
  } else {
    return res
  }
  return Promise.reject(res)
}, err => {
  if (err.response.status === 504 || err.response.status === 404) {
    Message.error({message: '服务器被吃了⊙﹏⊙∥'})
  } else if (err.response.status === 403) {
    Message.error({message: '权限不足,请联系管理员!'})
  } else {
    Message.error({message: `发生未知错误,错误代码:${err.response.status}`})
  }
  return Promise.reject(err)
})
export default http
