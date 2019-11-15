exports.formatMoney = (value) => {
  if (value) {
    value = Number(value)
    return '￥ ' + value.toFixed(2)
  }
}

exports.statusName = (val) => {
  let statusName = ''
  switch (val) {
    case 0: {
      statusName = '已取消'
      break
    }
    case 10: {
      statusName = '未付款'
      break
    }
    case 20: {
      statusName = '已付款'
      break
    }
  }
  return statusName
}

// 时间戳转 时间格式
exports.dateTimetrans = (date2) => {
  var date = new Date(date2) // 转时间类型
  var Y = date.getFullYear() + '-' // 年
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' // 月
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ' // 日
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' // 时
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':' // 分
  var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()) // 秒
  return Y + M + D + h + m + s
}

// 性别
exports.sex = (data) => {
  let sex = ''
  if (data === 1) {
    sex = '♂'
  } else if (data === 2) {
    sex = '♀'
  } else {
    sex = ''
  }
  return sex
}
