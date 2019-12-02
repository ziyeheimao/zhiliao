const CronJob = require('cron').CronJob; // 定时执行
const pool = require('./pool.js'); // 数据库连接池
const fs = require('fs'); // 文件管理
const main = require('./main.js'); // 工具类

// constructor(cronTime, onTick, onComplete, start, timezone, context, runOnInit, unrefTimeout)

// cronTime [必需] 配置定时任务的时间，可以使用这可以是cron语法或JS Date对象的形式。
// onTick [必需]在指定时间触发的回调。
// onComplete [可选] 在作业停止时将触发的回调。
// Start [可选]指定是否在退出构造函数之前启动作业，默认情况下，此值设置为false。
// timeZone [可选] -指定执行的时区。这将修改相对于您的时区的实际时间 ，不设置为当前所在时区。设置为Europe/London 为UTC 0时区


/*
此模块中中cron有一定的差异，时间取值范围，且有六个字段，其中1秒是最精细的粒度。：
秒：0-59
分钟：0-59
小时：0-23
天：1-31
月份：0-11（1月至12月）
星期几：0-6（周日至周六）

排列顺序：
秒 分钟 小时 天 月份 星期几

*为通配符
-为时间段连接符
,号为分隔符，可以在某一节输入多个值
/号为步进符（间隔）
*/

// 每天4:30备份数据库,生成sql文件存public下
new CronJob(
// 秒 分 小时 天 月 星期
  // '*/5 * * * * *',
  '0 30 4 * * *',
  function () {
    let tiem = main.date.getDate().slice(0,10);

    // 纸条备份
    let sql = `SELECT * FROM paper_strip`;
    pool.query(sql, [], (err, data) => {
      if (err) throw err;
      if (data.length > 0) {
        let exportSql =`INSERT INTO paper_strip VALUES\r\n`

        for (let i of data) {
          exportSql += `(NULL,${i.userId},"${i.userName}","${i.title}","${i.content}","${i.keyword}","${i.coverMap}",${i.releaseTime},"${i.languageSign}",${i.star},"${i.starUserId}"),\r\n`
        }

        let index = exportSql.lastIndexOf(',')
        exportSql = exportSql.slice(0, index)
        exportSql += ';'

        let path = './public/static/admini/'; // 文件的保存路径
        let fileName = `paper_strip${tiem}.sql`

        fs.writeFile(path + fileName, exportSql, {encoding: 'utf8'},(err) => {
          if (err) throw err;
          console.log('数据库 paper_strip表 备份成功')
        })
      }
    })

    // 用户表备份
    let sql2 = `SELECT * FROM user_info`;
    pool.query(sql2, [], (err, data) => {
      if (err) throw err;
      if (data.length > 0) {
        let exportSql =`INSERT INTO user_info VALUES\r\n`

        for (let i of data) {
          exportSql += '(NULL,"'+i.email+'","'+i.userName+'","'+i.password+'",'+i.sex+',"'+i.userPic+'"),\r\n'
        }

        let index = exportSql.lastIndexOf(',')
        exportSql = exportSql.slice(0, index)
        exportSql += ';'

        let path = './public/static/admini/'; // 文件的保存路径
        let fileName = `user_info${tiem}.sql`

        fs.writeFile(path + fileName, exportSql, {encoding: 'utf8'},(err) => {
          if (err) throw err;
          console.log('数据库 user_info表 备份成功')
        })
      }
    })
  },
  null,
  true,
);