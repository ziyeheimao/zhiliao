const express = require('express');
const pool = require('../pool.js'); // 数据库 连接池
const email = require('../email');
const main = require('../main.js'); // 工具类

const fs = require('fs');                // 文件管理
const multer = require('multer');        // 文件上传

//创建空路由器
var router = express.Router();

// 用户登录 ↓
router.post('/login', (req, res) => {
  var obj = req.body;

  //验证数据是否为空
  var field = obj.field;
  var password = obj.password;

  if (!field) {
    res.send({ code: -1, msg: '账号不可为空' });
    return;
  }
  if (!password) {
    res.send({ code: -1, msg: '密码不可为空' });
    return;
  }

  let sql = ''
  if (main.reg.email.test(field)) {
    sql = 'SELECT * FROM user_info WHERE email=? AND password=md5(?)'
  } else {
    sql = 'SELECT * FROM user_info WHERE userName=? AND password=md5(?)'
  }
  //执行SQL语句，查看是否登录成功 使用用户名和密码两个条件能查询到数据

  pool.query(sql, [field, password], (err, result) => {
    if (err) throw err;
    //判断查询的结果（数组）长度是否大于0 大于0，说明查询到数据，有这个用户登录成功

    if (result.length > 0) {
      let data = result[0]
      delete data.password
      let token = main.token.create(data)
      res.send({ code: 0, msg: '欢迎回家', data, token });
    } else {
      res.send({ code: 1, msg: '账号或密码错误' });
    }
  });
});
// 用户登录 ↑

// 头像上传 ↓
const upload = multer({ dest: 'upload/' }); // 1、创建multer对象 创建目录upload
router.post('/userPic/upload', upload.single('file'), (req, res) => { // 2、接收用户上传文件的请求post //1、接口 2、文件的属性名 原生表单中的name属性值 3、回调函数
  let userId = main.token.toUserId(req.headers.token)

  let size = req.file.size / 1024 / 1024;      // 默认单位字节 // 3、判断大小 最大2MB
  let type = req.file.mimetype;                // 4、判断文件类型必须是图片
  let time = new Date().valueOf() // 时间戳

  if (req.file === undefined) {
    res.send({ code: -1, msg: '图片不可为空' })
    return
  }
  if (size > 5) {
    res.send({ code: 1, msg: "上传图片过大，最大5MB(・-・*)" }) // 3.图片尺寸
    return
  }
  if (type.indexOf('image') == -1) { // 4.判断文件类型名称是否含有image
    res.send({ code: 1, msg: "只能上传( σ'ω')σ 图片喲~" });
    return;
  }

  var picUrl = ''
  // 查询原来头像链接
  function _getUserPic () {
    return new Promise((open, error) => {
      let sql = `SELECT userPic FROM user_info WHERE userId=?`
      pool.query(sql, [userId], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
          let data = result[0].userPic
          picUrl = data
          open()
        }
      })

    })
  }
  // 删除文件
  function _delUserPic () {
    return new Promise((open, error) => {
      let filepath = `./public${picUrl.split(main.serverPort)[1]}`
      fs.unlink(filepath, function(err){
        if(err) throw err;
        open()
      })
    })
  }
  // 生成新的文件
  function _storage1 () {
    return new Promise((open, error) => {
      let _typeName = type.split('/')[1]
      let newPath = `./public/static/userPic/${userId}Pic_${time}.${_typeName}`;  // 拼接新文件存放的路径及文件名
      fs.renameSync(req.file.path, newPath); // 6、将临时文件移动到public目录下
      open()
    })
  }
  // 文件链接存数据库
  function _storage2 () {
    return new Promise((open, error) => {
      let _typeName = type.split('/')[1]
      userUrl = `${main.serverIp}:${main.serverPort}/static/userPic/${userId}Pic_${time}.${_typeName}` // 路径
      pool.query("UPDATE user_info SET userPic=? WHERE userId=?", [userUrl, userId], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
          res.send({code: 0,msg: '头像修改成功 ψ(｀∇´)ψ'}); // 7、返回上传成功消息即可
        }
        open()
      });
    })
  }

  async function async () {
    await _getUserPic()
    if (picUrl) await _delUserPic() // 有旧头像文件则删除
    await _storage1()
    await _storage2()
  }
  async()
})
// 头像上传 ↑

// 通过token获取用户信息
router.get(`/getUserInfo`, (req, res) => {
  let userId = main.token.toUserId(req.headers.token)
  main.user.get(userId).then(data => {
    if (data === false) {
      res.send({code: 1, msg: `并未发现userId为:${userId}的用户 ┑(￣Д ￣)┍`})
      return
    }
    res.send({code: 0, data})
  })
})

// 更改用户信息 ↓
router.put('/setUserInfo', (req, res) => {
  var obj = req.body;
  let userId = main.token.toUserId(req.headers.token)

  var email = obj.email;                     // 邮箱
  var userName = obj.userName;               // 昵称
  var password = obj.password;               // 密码
  var sex = obj.sex;                         // 性别

  if (!sex) sex = 0
  if (!email) {
    res.send({code: -1, msg: 'email不可为空'})
    return
  }
  if (!userName) {
    res.send({code: -1, msg: 'userName不可为空'})
    return
  }
  if (!password) {
    res.send({code: -1, msg: 'password不可为空'})
    return
  }
  //执行SQL语句
  let sql = 'UPDATE user_info SET email=?, userName=?, password=md5(?), sex=? WHERE userId=?'
  
  pool.query(sql, [email, userName, password, sex, userId], (err, result) => {
    if (err) throw err;

    if (result.affectedRows > 0) { // 判断是否更改成功
      res.send({ code: 0, msg: '修改成功' });
    } else {
      res.send({ code: 1, msg: '修改失败' });
    }
  });
});
// 更改用户信息 ↑

// 模糊搜索作者名
router.get(`/authorName`, (req, res) => {
  var obj = req.query;
  let keyword = obj.keyword;

  if (!keyword) {
    res.send({ code: -1, msg: 'keyword不可为空' })
    return
  }

  let sql = 'SELECT userId, userName FROM user_info WHERE userName LIKE ?'

  pool.query(sql, ['%' + keyword + '%'], (err, data) => {
    if (err) throw err;
    if (data.length > 0) {
      res.send({ code: 0, data });
    } else {
      res.send({ code: 1, msg: '没有搜索结果' , data});
    }
  });
})
// 模糊搜索作者名

// 搜索作者
router.get(`/author`, (req, res) => {
  let obj = req.query;
  let keyword = obj.keyword;
  let userId = obj.userId;
  if (!keyword) {
    res.send({ code: -1, msg: 'keyword不可为空' })
    return
  }

  let sql = ''
  if (userId !== 'undefined') {
    sql = 'SELECT * FROM user_info WHERE userId=?'
    pool.query(sql, [userId], (err, data) => {
      if (err) throw err;
  
      for (let i of data) {
        delete i.email
        delete i.password
      }
  
      if (data.length > 0) {
        res.send({ code: 0, data });
      } else {
        res.send({ code: 1, data, msg: '没有搜索结果'});
      }
    });
  } else {
    sql = 'SELECT * FROM user_info WHERE userName LIKE ?'
    pool.query(sql, ['%' + keyword + '%'], (err, data) => {
      if (err) throw err;
  
      for (let i of data) {
        delete i.email
        delete i.password
      }
  
      if (data.length > 0) {
        res.send({ code: 0, data });
      } else {
        res.send({ code: 1, data, msg: '没有搜索结果'});
      }
    });
  }
})
// 搜索作者

// 检测 昵称 邮箱 手机 是否注册 ↓
router.get('/checkUserNamePhoneEmail', (req, res) => {
  var obj = req.query;
  var field = obj.field;
  var userId = obj.userId;

  if (!field) {
    res.send({ code: -1, msg: "字段不可为空~" });
    return;
  }

  let sql = ''
  let infoField = ''
  if (main.reg.email.test(field)) {
    sql = 'SELECT * FROM user_info WHERE email=?'
    infoField = '邮箱'
  } else if (main.reg.phone.test(field)) {
    sql = 'SELECT * FROM user_info WHERE phone=?'
    infoField = '手机'
  } else {
    sql = 'SELECT * FROM user_info WHERE userName=?'
    infoField = '昵称'
  }

  if (userId) sql += ` AND userId!=?`

  pool.query(sql, [field, userId], (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      res.send({ code: 1, msg: `该${infoField}已被占用` });
    } else {
      res.send({ code: 0, msg: `可以使用该${infoField}` });
    }
  })
});
// 检测 昵称 邮箱 手机 是否注册 ↑

// 用户注册 ↓
router.post('/register', (req, res) => {
  var obj = req.body; //获取post请求的数据

  var userName = obj.userName; //判断用户名是否为空
  var password = obj.password; //验证密码、邮箱、手机是否为空
  var email = obj.email;
  // var phone = obj.phone;

  if (!userName) {
    res.send({ code: -1, msg: 'userName 不可为空' });
    return;
  }
  if (!password) {
    res.send({ code: -1, msg: 'password 不可为空' });
    return;
  }
  if (!email) {
    res.send({ code: -1, msg: 'email 不可为空' });
    return;
  }
  // if (!phone) {
  //   res.send({ code: -1, msg: 'phone 不可为空' });
  //   return;
  // }

  //执行SQL语句，将注册的数据插入到user_info数据表中，成功响应 {code:200,msg:'register suc'}
  pool.query('INSERT INTO user_info SET userName=?,password=md5(?),email=?,sex=0', [userName, password, email], (err, result) => {
    if (err) throw err;

    //是否添加成功
    if (result.affectedRows > 0) {
      res.send({ code: 0, msg: '注册成功 []~(￣▽￣)~*' });
    } else {
      res.send({ code: 1, msg: '注册失败' });
    }
  });

});
// 用户注册 ↑

// 获取验证码 ↓
router.get('/verificationCode', (req, res) => {
  var obj = req.query;
  var field = obj.field;

  if (!field) {
    res.send({ code: -1, msg: 'field 不可为空' });
    return;
  }

  if (main.reg.email.test(field)) { // 如果是邮箱 邮件验证
    let randomStr = email.forgetPassword(field) // 生成随机码

    let sql = 'SELECT * FROM user_info WHERE email=?'
    pool.query(sql, field, (err, result) => { // 查库 确认有这个邮箱在发消息
      if (err) throw err;

      if (result.length === 0) {
        res.send({ code: -1, msg: `此邮箱未注册` });
      } else {
        main.verificationCode.valid(result[0].userId).then(validRes => {
          if (validRes) { // 查数据库 判断 当前用户 是否有验证码 是否在30秒内
            res.send({ code: 1, msg: '30秒后才可重新获取验证码...', validRes })
          } else {
            main.verificationCode.add(result[0].userId, randomStr) // 添加验证码到数据库,并在30秒后删除
            res.send({ code: 0, msg: `验证码为: ${randomStr} 仅供开发测试用`, data: { result } });
          }
        })
      }
    })
  } else if (main.reg.phone.test(field)) { // 如果是手机 短信验证
    console.log('短信验证')
    res.send({ code: 1002, msg: '手机修改密码接口仍在开发中,暂时不可用,请使用邮箱修改密码...' });
  } else {
    res.send({ code: 1, msg: '手机或邮箱格式不正确'})
  }
})
// 获取验证码 ↑

// 忘记密码 ↓
router.put('/forgetPassword', (req, res) => {
  var obj = req.body; //获取post请求的数据
  var field = obj.field; //手机或邮箱
  var password = obj.password; //新密码
  var verificationCode = obj.verificationCode

  if (!field) {
    res.send({ code: -1, msg: 'field 不可为空' });
    return;
  }
  if (!password) {
    res.send({ code: -1, msg: 'password 不可为空' });
    return;
  }
  if (!verificationCode) {
    res.send({ code: -1, msg: 'verificationCode 不可为空' });
    return;
  }

  // 封装 更新函数
  var update = function (field, password) {
    let sql = 'UPDATE user_info SET password=md5(?) WHERE '

    if (main.reg.email.test(field)) {
      sql += 'email=?'
    } else if (main.reg.phone.test(field)) {
      sql += 'phone=?'
    } else {
      res.send({ code: -1, msg: 'field 格式不正确'});
    }

    pool.query(sql, [password, field], (err, result) => {
      if (err) throw err;
      if (result.affectedRows > 0) {
        res.send({ code: 0, msg: '密码修改成功' });
      } else {
        res.send({ code: -1, msg: '密码修改失败' });
      }
    })
  }

  main.verificationCode.vali(field).then(resolve => {
    if (resolve.valid === true) {
      if (!resolve.result[0].verificationCode) {
        res.send({ code: -1, msg: '验证码已过期' })
        return
      }
      if (resolve.result[0].verificationCode.toUpperCase() === verificationCode.toUpperCase()) {
        update(field, password)
      } else {
        res.send({ code: -1, msg: '验证码错误' })
      }
    } else if (resolve.valid === false) {
      res.send({ code: -1, msg: '验证码已过期' })
    }
  })
})
// 忘记密码 ↑

// 获取该用户有多少纸条
router.get('/authorPaperStripCount', (req, res) => {
  var obj = req.query;
  var userId = obj.userId;
  if (!userId) {
    res.send({ code: -1, msg: 'userId 不可为空' });
    return;
  }

  let sql = 'SELECT count(paperStripId) AS paperStripCount FROM paper_strip WHERE userId=?'
  pool.query(sql, userId, (err, result) => {
    if (err) throw err;

    let data = result[0].paperStripCount
    res.send({ code: 1, data })
  })
})

//导出路由器
module.exports = router;