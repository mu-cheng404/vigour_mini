const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  var dataArr = event.dataArr //参数-dataArr列表
  var avatarArr = [] //头像数组
  var nickNameArr = [] //昵称数组
  for (var i = 0; i < dataArr.length; i++) {
    await cloud.database().collection("user").where({
        _openid: dataArr[i]._openid
      }).get()
      .then((res) => {
        avatarArr[i] = res.data[0].avatarUrl
        nickNameArr[i] = res.data[0].nickName
      })
      .catch(console.log)
  }
  return {
    avatarArr: avatarArr,
    nickNameArr: nickNameArr
  }
}