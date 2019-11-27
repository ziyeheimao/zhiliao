const express = require('express');
const cheerio = require("cheerio");      // 模拟jq获取节点组件

const pool = require('../pool.js');
const main = require('../main.js');      // 工具类
const worm = require('../worm.js');      // 爬虫模块

const fs = require('fs');                // 文件管理
const multer = require('multer');        // 文件上传

var router = express.Router();           // 创建空路由

// 首页推荐列表
router.post(`/news`, (req, res) => {
  let obj = req.body;
  let userId = null;
  if (req.headers.token) userId = main.token.toUserId(req.headers.token);
  let page = 1;
  let limit = 90;
  let time = new Date().getTime(); // 当前时间戳

  let _findAll = function () { // 未登录或者该用户没有发过纸条
    let sql = `SELECT * FROM paper_strip ORDER BY star DESC limit ?,?` // LIMIT ?,?
    pool.query(sql, [(page - 1) * limit, limit], (err, data) => { // , page, limit
      if (err) throw err;
      res.send({ code: 0, data })
    })
  }

  let languageSignAggregate = null // 当前用户发布纸条包含的语言
  let _find = function () {
    return new Promise((open, error) => {
      let sql = 'SELECT languageSign FROM paper_strip WHERE userId=?'
      pool.query(sql, userId, (err, data) => {
        if (err) throw err;
        if (data.length > 0) { // 已登录查该用户以往发帖的语言 并推荐相同的语言
          let arr = []
          for (let i of data) {
            let narr = JSON.parse(i.languageSign)
            for (let k of narr) {
              arr.push(k)
            }
          }

          languageSignAggregate = main.arr.distinct(...arr)

          if (languageSignAggregate.length === 0) _findAll()
          else open()
        } else _findAll() // 如果该用户没有发帖查全部
      })
    })
  }

  let _findByLanguage = function () { // 通过当前用户的语言集合具有针对性查询推送信息
    let sql = `SELECT * FROM paper_strip WHERE userId !=? AND ( ` // 语言条件
    let reqSql = [userId]

    for (let i = 0; i < languageSignAggregate.length; i++) {
      reqSql.push(`%[${languageSignAggregate[i]}]%`)
      reqSql.push(`%[${languageSignAggregate[i]},%`)
      reqSql.push(`%,${languageSignAggregate[i]}]%`)
      reqSql.push(`%,${languageSignAggregate[i]},%`)
      sql += ' languageSign LIKE ? OR languageSign LIKE ? OR languageSign LIKE ? OR languageSign LIKE ? OR '
    }

    reqSql.push((page - 1) * limit, limit)
    sql = sql.slice(0, -3)

    sql += ` ) ORDER BY star DESC LIMIT ?,?` // LIMIT ?,?

    pool.query(sql, reqSql, (err, data) => { // , page, limit
      if (err) throw err;
      if (data.length === 0) _findAll() // 如果当前用使用的语言数据库内 没有对应纸条 推送其它语言纸条
      else res.send({ code: 0, data })
    })
  }

  let _async = async function () {
    await _find()
    await _findByLanguage()
  }
  // 如果 1用户登陆了登陆了 获取该用户所有纸条的语言类型并去重
  //    获取除当前用户外的 日期在距今一周内所有(语言类型符合上述条件)的纸条 按点赞数排序取前30名send
  if (userId) {
    _async()
  } else { // 未登录 纸条表取 取点赞数排序前90名send
    _findAll()
  }
})
// 首页推荐列表

// 通过搜索标题形成热词 ↓
router.get(`/getHotWords`, (req, res) => {
  let obj = req.query;
  let keyword = obj.keyword;

  let sql = `SELECT * FROM paper_strip WHERE title LIKE ?` // LIMIT ?,?
  pool.query(sql, ['%' + keyword + '%'], (err, data) => { // , page, limit
    if (err) throw err;
    res.send({ code: 0, data })
  })
})
// 通过搜索标题形成热词 ↑

// 标题 + 正文 + 关键字 + 作者 广泛搜索 ↓
router.post(`/widelySearch`, (req, res) => {
  let obj = req.body;
  let keyword = obj.keyword;
  let resArr = []

  let type = 0; // 搜索类型 0全部 1标题 2正文 3作者 4关键字
  type = !obj.type ? 0 : Number(obj.type);
  let count = 0;
  if (!type) count = 40
  else count = 10

  let speedOfProgress = 0; // 查询进度
  let resObj = { code: 0 } // 返回内容

  let _res = function () {
    resArr = main.distinctById('paperStripId', resArr)
    resObj.data = resArr
  }

  const _searchTitle = function () {
    let sql1 = `SELECT * FROM paper_strip WHERE title LIKE ?` // 查标题
    pool.query(sql1, ['%' + keyword + '%'], (err, result) => {
      if (err) throw err;
      resArr.push(...result)

      speedOfProgress += 10
      if (speedOfProgress === count) {
        _res();
        res.send(resObj)
      }
    })
  }

  const _searchContent = function () {
    let sql2 = `SELECT * FROM paper_strip WHERE content LIKE ?` // 查正文
    pool.query(sql2, ['%' + keyword + '%'], (err, result) => {
      if (err) throw err;
      resArr.push(...result)

      speedOfProgress += 10
      if (speedOfProgress === count) {
        _res();
        res.send(resObj)
      }
    })
  }

  const _searchUserName = function () {
    let sql3 = `SELECT * FROM paper_strip WHERE userName LIKE ?` // 查作者
    pool.query(sql3, ['%' + keyword + '%'], (err, result) => {
      if (err) throw err;
      resArr.push(...result)

      speedOfProgress += 10
      if (speedOfProgress === count) {
        _res();
        res.send(resObj)
      }
    })
  }

  const _searchKeyword = function () {
    let sql4 = `SELECT * FROM paper_strip WHERE keyword LIKE ?` // 关键字
    pool.query(sql4, ['%' + keyword + '%'], (err, result) => {
      if (err) throw err;
      resArr.push(...result)

      speedOfProgress += 10
      if (speedOfProgress === count) {
        _res();
        res.send(resObj)
      }
    })
  }
  switch (type) {
    case 1:
      _searchTitle()
      break
    case 2:
      _searchContent()
      break
    case 3:
      _searchUserName()
      break
    case 4:
      _searchKeyword()
      break
    default:
      _searchTitle()
      _searchContent()
      _searchUserName()
      _searchKeyword()
      break
  }
})
// 标题 + 正文 + 关键字 + 作者 广泛搜索 ↑

// 模糊搜索作者名搜索热词辅助 ↓
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
// 模糊搜索作者名搜索热词辅助 ↑

// 搜索作者 ↓
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
// 搜索作者 ↑

// 获取该用户有多少纸条 ↓
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
// 获取该用户有多少纸条 ↑

// 通过纸条Id获取纸条信息 ↓
router.get(`/paperStrip`, (req, res) => {
  let obj = req.query;
  let paperStripId = obj.paperStripId;

  if (!paperStripId) {
    res.send({ code: -1, msg: '纸条Id不可为空' })
  }

  let sql = `SELECT * FROM paper_strip WHERE paperStripId=?` // LIMIT ?,?
  pool.query(sql, [paperStripId], (err, data2) => {
    if (err) throw err;
    let data = data2[0]
    res.send({ code: 0, data })
  })
})
// 通过纸条Id获取纸条信息 ↑

// 发布纸条 ↓
router.post(`/releasePaperStrip`, (req, res) => {
  let obj = req.body;
  let userId = main.token.toUserId(req.headers.token)
  let userName = obj.userName;
  let title = obj.title;
  let content = obj.content;
  let keyword = obj.keyword;
  let languageSign = obj.languageSign;


  let releaseTime = new Date().getTime(); // 时间戳

  if (!userName) {
    res.send({ code: -1, msg: '昵称不可为空' });
    return
  }
  if (!title) {
    res.send({ code: -1, msg: '标题不可为空' });
    return
  }
  if (!content) {
    res.send({ code: -1, msg: '内容不可为空' });
    return
  }
  if (!languageSign) {
    res.send({ code: -1, msg: '语言标记不可为空' });
    return
  }

  let sql = `INSERT INTO paper_strip VALUES (NULL,?,?,?,?,?,NULL,?,?,0,'[]')`;
  pool.query(sql, [userId, userName, title, content, keyword, releaseTime, languageSign], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.send({ code: 0, msg: '发帖成功 []~(￣▽￣)~*' });
    } else {
      res.send({ code: 1, msg: '发帖失败 w( ゜Д ゜)w' });
    }
  });
})
// 发布纸条 ↑

// 删除纸条 ↓
router.delete(`/delPaperStrip`, (req, res) => {
  let obj = req.query;
  let paperStripId = obj.paperStripId; // 纸条id
  let userId = main.token.toUserId(req.headers.token)

  if (!paperStripId) {
    res.send({ code: -1, msg: 'paperStripId不可为空' });
    return
  }

  var sql = 'DELETE FROM `paper_strip` WHERE paperStripId=? AND userId=?';
  pool.query(sql, [paperStripId, userId], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      res.send({ code: 0, msg: '删除成功' });
    } else {
      res.send({ code: 1, msg: '删除失败' });
    }
  })
})
// 删除纸条 ↑

// 修改纸条 ↓
router.put(`/upDataPaperStrip`, (req, res) => {
  let obj = req.body;

  let userId = main.token.toUserId(req.headers.token)
  let paperStripId = obj.paperStripId;
  let userName = obj.userName;
  let title = obj.title;
  let content = obj.content;
  let keyword = obj.keyword;
  let languageSign = obj.languageSign;

  if (!paperStripId) {
    res.send({ code: -1, msg: '纸条Id不可为空' });
    return
  }
  if (!userName) {
    res.send({ code: -1, msg: '昵称不可为空' });
    return
  }
  if (!title) {
    res.send({ code: -1, msg: '标题不可为空' });
    return
  }
  if (!content) {
    res.send({ code: -1, msg: '内容不可为空' });
    return
  }

  let sql = 'UPDATE paper_strip SET userName=?, title=?, content=?, keyword=?, languageSign=? WHERE userId=? AND paperStripId=?'

  pool.query(sql, [userName, title, content, keyword, languageSign, userId, paperStripId], (err, result) => {
    if (err) throw err;

    if (result.affectedRows > 0) { // 判断是否更改成功
      res.send({ code: 0, msg: '修改成功' });
    } else {
      res.send({ code: 1, msg: '修改失败' });
    }
  });
})
// 修改纸条 ↑

// 通过用户id获取该用户所有纸条 ↓
router.get(`/findPaperStripByUserId`, (req, res) => {
  let obj = req.query;
  let userId = Number(obj.userId);

  if (!userId) {
    res.send({ code: -1, msg: 'userId不可为空' });
    return
  }

  let sql = `SELECT * FROM paper_strip WHERE userId=?` // LIMIT ?,?
  pool.query(sql, [userId], (err, data) => {
    if (err) throw err;
    res.send({ code: 0, data })
  })
})
// 通过用户id获取该用户所有纸条 ↑

// 点赞/取消点赞
router.put('/star', (req, res) => {
  let obj = req.body;
  let userId = main.token.toUserId(req.headers.token);
  let paperStripId = obj.paperStripId; // 纸条id
  if (!paperStripId) {
    res.send({ data: -1, msg: 'paperStripId 不可为空'})
    return
  }
  let paperStrip = null // 当前纸条

  // 查
  let _find = function () {
    return new Promise((open, err) => {
      let sql = `SELECT * FROM paper_strip WHERE paperStripId=?`
      pool.query(sql,[paperStripId], (err, data) => {
        if (err) throw err;
        if (data.length > 0) {
          paperStrip = data[0]
          open()
        } else {
          res.send({code: 1, data: [], msg: '该纸条已被作者删除 或被和谐 ╮(๑•́ ₃•̀๑)╭'})
        }
      })
    })
  }

  // 改
  let _updata = function () {
    return new Promise((open, err) => {
      let arr = JSON.parse(paperStrip.starUserId)
      if (!arr.length) arr = [] // 防止arr 不是函数的情况
      let index = arr.indexOf(userId)
      let sql = 'UPDATE paper_strip SET starUserId=?, star=? WHERE paperStripId=?'
      if (index === -1) { // 点赞
        arr.push(userId)
        let JSONArr = JSON.stringify(arr)
        let count = paperStrip.star + 1
        pool.query(sql, [JSONArr, paperStripId, count], (err, result) => {
          if (err) throw err;

          if (result.affectedRows > 0) { // 判断是否更改成功
            res.send({ code: 0, msg: '点赞成功' });
          } else {
            res.send({ code: 1, msg: '点赞失败' });
          }
        });
      } else { // 取消点赞
        arr.splice(index, 1)
        let JSONArr = JSON.stringify(arr)
        let count = paperStrip.star + 1
        pool.query(sql, [JSONArr, paperStripId, count], (err, result) => {
          if (err) throw err;

          if (result.affectedRows > 0) { // 判断是否更改成功
            res.send({ code: 0, msg: '取消点赞成功' });
          } else {
            res.send({ code: 1, msg: '取消点赞失败' });
          }
        });
      }
    })
  }

  let async = async function () {
    await _find()
    await _updata()
  }

  async()
})
// 点赞/取消点赞





/*
跨表分页查询
`select * from web INNER JOIN class_details ON fk_wid=wid`  //跨表查询 排除笛卡尔积后 的全部数据
`SELECT * FROM web INNER JOIN class_details ON fk_wid=wid WHERE class_details.uid=1 AND class_details.cid=1`       //对结果进行条件uid cid（安右侧class_details）过滤之后的数据
`SELECT * FROM web INNER JOIN class_details ON fk_wid=wid WHERE class_details.uid=1 AND class_details.cid=1 LIMIT 0,1`    //多表查询+条件过滤+分页 需要四个条件过滤：uid cid 分页：当前页 最大页
*/

//导出路由器
module.exports = router;