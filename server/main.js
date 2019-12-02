const pool = require('./pool.js'); // 数据库 连接池
const sjcl = require('sjcl'); // 斯坦福加密算法 // npm i sjcl

const serverIp = 'http://127.0.0.1' // 后端服务器ip
const serverPort = 80 // 服务器端口
const DBHost = '127.0.0.1' // 数据库ip
const corsHost = ['http://127.0.0.1', 'http://localhost'] // 跨域白名单 ip 域名

const adoptPath = [ // 无需携带token即可访问的 路由
  // '/static',

  '/user/login',
  '/user/checkUserNamePhoneEmail',
  '/user/register',
  '/user/verificationCode',
  '/user/forgetPassword',

  '/ctn/news',
  '/ctn/getHotWords',
  '/ctn/widelySearch',
  '/ctn/authorName',
  '/ctn/author',
  '/ctn/authorPaperStripCount',
  '/ctn/paperStrip',
  '/ctn/findPaperStripByUserId',

  '/other/language'
]

// 字符串处理
const str = {
  // 删除开头和结尾的空字符
  trim: function (str) {
    return str.replace(/^\s+|\s+$/g, '');
  },

  // 将字符串中所有  原字符   目标       替换内容
  replace: function (str, targetCtn, replaceCtn) {
    if (typeof str !== 'string') return str
    let reg = new RegExp(`${targetCtn}`, "g")
    str = str.replace(reg, replaceCtn) // '替换
    return str
  }
}

// 正则
const reg = {
  url: /[a-zA-z]+:\/\/[^\s]*/,
  email: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
  phone: /^1([3-9][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
  charset: /<meta[^>]*?charset=(["\']?)([a-zA-z0-9\-\_]+)(\1)[^>]*?>/is
}

// 数组
const arr = {
  // 去重
  distinct: function (...rest) {
    return Array.from(new Set([...rest]))
  }
}

const obj = {
  // 克隆对象
  clone: function (obj) {
    let newObj = {}
    for (let k in obj) {
      newObj[k] = obj[k]
    }
    return newObj
  }
}


// 随机
const random = {
  // 取两个数之间随机数
  num: function (min = 0, max = 100, len = 0) {
    return Number((min + (max - min) * Math.random()).toFixed(len));
  },

  // 任意长度 随机字符串
  str: function (len = 8) {
    let str = '';
    let list = '0123456789abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < len; i++) {
      let index = this.num(0, 35);
      let word = list[index];
      if (isNaN(word) && this.num() < 50) {
        word = word.toUpperCase();
      }
      str += word;
    }
    return str;
  },

  // 随机字母
  letter: function (len = 8) {
    let str = '';
    let list = 'abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < len; i++) {
      let index = this.num(0, 26);
      let word = list[index];
      if (isNaN(word) && this.num() < 50) {
        word = word.toUpperCase();
      }
      str += word;
    }
    return str;
  }
}

const secretKey = random.str(16) // token加密/解密密钥

// 验证码
const verificationCode = {
  // 检测邮箱 手机 用户名对应的userId是否有验证码
  vali: function (field) {
    return new Promise((resolve, reject) => {

      if (reg.email.test(field)) {
        sql = 'SELECT verificationCode FROM verification_code WHERE userId=(SELECT userId FROM user_info WHERE email=?)'
      } else if (reg.phone.test(field)) {
        sql = 'SELECT verificationCode FROM verification_code WHERE userId=(SELECT userId FROM user_info WHERE phone=?)'
      } else {
        sql = 'SELECT verificationCode FROM verification_code WHERE userId=(SELECT userId FROM user_info WHERE userName=?)'
      }
      
      pool.query(sql, [field], (err, result) => {
        if (err) throw err;
        //判断查询的结果（数组）长度是否大于0 大于0，说明查询到数据，有这个用户登录成功
        if (result.length > 0) {
          resolve({valid: true, result})
        } else {
          resolve({valid: false})
        }
      });

    })
  },

  // 检测该userId是否有验证码
  valid: function (userId) {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * FROM verification_code WHERE userId=?'
      pool.query(sql, [userId], (err, result) => {
        if (err) throw err;
        let validRes = null // 检测结果

        if (result.length > 0) {
          validRes = true
        } else {
          validRes = false
        }

        resolve(validRes)
      })
    })
  },

  // 添加验证码 userId + 验证码 存数据库
  add: function (userId, verificationCode) {
    let sql = 'INSERT INTO verification_code SET userId=?,verificationCode=?'
    pool.query(sql, [userId, verificationCode], (err, result) => {
      if (err) throw err;
      if (result.affectedRows > 0) {
        this._del(userId)
        return true;
      } else {
        return false;
      }
    })
  },

  // 30秒后删除刚才添加的验证码
  _del: function (userId) {
    setTimeout(() => {
      let sql = 'DELETE FROM verification_code WHERE userId=?'
      pool.query(sql, [userId], (err, result) => {
        if (err) throw err;
      });
    }, 30000)
  }
}

const token = {
  // 通过uid生成token
  create: function (user) {
    let userId = user.userId + ''
    let token = sjcl.encrypt(secretKey, userId)
    token = JSON.stringify(token)

    // 根据返回的用户信息中的设置 计算token时间戳
    let timeStamp = null
    timeStamp = Number((new Date()).valueOf()) + 1000 * 60 * 60 * 8; // 获取当前毫秒的时间戳 + 8小时token有效期

    this._valid(userId).then(validRes => {
      if (validRes === true) { // 已有token // 更新 token
        this._upData(userId, timeStamp)
      } else if (validRes === false) { // 没有token // 创建 token
        this._add(userId, timeStamp) // uid + 时间戳存数据库
      }
    })

    return token
  },
  // 检测是否有token
  _valid: function (userId) {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * FROM token_date WHERE userId=?'
      pool.query(sql, [userId], (err, result) => {
        if (err) throw err;
        let validRes = null // 检测结果
  
        if (result.length > 0) {
          validRes = true
        } else {
          validRes = false
        }
        resolve(validRes)
      })
    })
  },
  // 新增
  _add: function (userId, timeStamp) {
    let sql = 'INSERT INTO token_date SET userId=?,timeStamp=?'
    pool.query(sql, [userId, timeStamp], (err, result) => {
      if (err) throw err;
    })
  },
  // 更新
  _upData: function (userId, timeStamp) {
    let sql = 'UPDATE token_date SET timeStamp=? WHERE userId=?'
    pool.query(sql, [timeStamp, userId], (err, result) => {
      if (err) throw err;
    })
  },
  // 把token还原成uid
  toUserId: function (token) {
    token = JSON.parse(token)
    let userId = sjcl.decrypt(secretKey, token) // 解密数据
    userId = Number(userId)
    return userId
  }
}

// 时间
const date = {
  // 时间格式转换
  timetrans: function (date) {
    var date = new Date(date);                                                                     // 转时间类型
    var Y = date.getFullYear() + '-';                                                              // 年
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';  // 月
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';                 // 日
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';                // 时
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';          // 分
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());                // 秒
    return Y + M + D + h + m + s;
  },

  // 获取当前系统时间
  getDate: function (isWeekDay = false, timeStr = '-', timeStr2 = ':') {
    let date = new Date();

    let Year = date.getFullYear(); // 获取年(4位)

    let Month = date.getMonth() + 1; // 获取月份(0-11, 0是1月)
    if (Month < 10) Month = '0' + Month;

    let Day = date.getDate(); // 获取日(1-31)
    if (Day < 10) Day = '0' + Day;

    let WeekDay = date.getDay(); // 获取星期(0-6 , 0是星期日)
    switch (WeekDay) {
      case 0:
        WeekDay = '星期日'
        break
      case 1:
        WeekDay = '星期一'
        break
      case 2:
        WeekDay = '星期二'
        break
      case 3:
        WeekDay = '星期三'
        break
      case 4:
        WeekDay = '星期四'
        break
      case 5:
        WeekDay = '星期五'
        break
      case 6:
        WeekDay = '星期六'
        break
    }


    let Hour = date.getHours(); // 获取小时(0-23)
    if (Hour < 10) Hour = '0' + Hour;

    let Minute = date.getMinutes(); // 获取分钟(0-59)
    if (Minute < 10) Minute = '0' + Minute;

    let Sec = date.getSeconds(); // 获取秒数(0-59)
    if (Sec < 10) Sec = '0' + Sec;

    let current = Year + timeStr + Month + timeStr + Day + ' ' + Hour + timeStr2 + Minute + timeStr2 + Sec

    if (isWeekDay) current = current + ' ' + WeekDay // 是否需要星期几

    return current
  }
};

// 中间件
const middleware = {
  token: function(req, res, next) {
    let token_ = req.headers.token
    let url = req._parsedUrl.pathname // url // 获取用户访问的接口
    let expireTimeStamp = null // 本次登录到期时间戳
    console.log(url)

    // 检测是否携带token
    if (!token_) { // 没有token
      if (adoptPath.includes(url) === true) { // 在不携带token可访问范围内
        return next()
      } else {
        res.send({code: 1001, msg: '请携带token访问此接口'})
        return
      }
    } else if (token_) { // 检测token是否过期

      let userId = token.toUserId(token_)

      // 获取token到期 时间戳
      user.getTimeStamp(userId).then(resolve => { // 根据userId 查token表
        if (resolve === false) { // 表里没有当前用户token
          res.send({code: 1004, msg: 'token错误请重新登录'})
          return
        } else {
          expireTimeStamp = resolve.timeStamp

          let valid = middleware._tokenValid(expireTimeStamp)
          if (valid) {
            return next()
          } else {
            res.send({code: 1001, msg: 'token已过期, 请重新登录'})
          }
        }
      })
    }
  },

  _tokenValid: function (expireTimeStamp) {
    //      到期时间              当前时间
    if (expireTimeStamp > new Date().valueOf()) { // 未过期
      // console.log('token到期时间', expireTimeStamp, '当前时间', new Date().valueOf())
      return true
    } else { // 已过期
      return false
    }
  },

  // 用户权限
  power: function (req, res, next) {
    // console.log('验证用户权限写这里:', req.token, req._parsedUrl.pathname)
    return next();
  }
}

const user = {
  // 获取用户信息(用户表)
  get: function (userId, field = '*') {
    return new Promise((resolve, reject) => {
      let sql = `SELECT ${field} FROM user_info WHERE userId=?`
      pool.query(sql, [userId], (err, result) => {
        if (err) throw err;
        let res_ = null // 检测结果
  
        if (result.length > 0) {
          res_ = result[0]
          delete res_.password
        } else {
          res_ = false
        }
        resolve(res_)
      })
    })
  },

  // 获取用户token到期时间戳
  getTimeStamp: function (userId) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT timeStamp FROM token_date WHERE userId=?`
      pool.query(sql, [userId], (err, result) => {
        if (err) throw err;
        let res_ = null // 检测结果

        if (result.length > 0) {
          res_ = result[0]
        } else {
          res_ = false
        }
        resolve(res_)
      })
    })
  }
}

// 转换数据
const transform = {
  // 分页查询 page 转 start
  page: function (page, limit) {
    return (page - 1) * limit
  }
}

// 通过主键 id 对数组对象进行去重
const distinctById = function (PrimaryKeyId, arr) {
  let idList = []
  for (let i of arr) {
    idList.push(i[PrimaryKeyId])
  }

  idList = Array.from(new Set([...idList]))

  let resArr = []
  for (let i of idList) {
    for (let j of arr) {
      if (i === j[PrimaryKeyId]) {
        resArr.push(j)
        break
      }
    }
  }

  return resArr
}

module.exports = {
  arr,
  obj,
  serverIp,
  serverPort,
  DBHost,
  corsHost,
  adoptPath,
  str,
  reg,
  random,
  verificationCode,
  token,
  date,
  middleware,
  user,
  transform,
  distinctById
}
