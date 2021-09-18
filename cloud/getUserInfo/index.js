const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  //传递来的openid
  var _openid = event._openid
  //uesr表中获取用户信息
  var userInfo = await cloud.database().collection("user").where({
    _openid: _openid
  }).get()
  userInfo = userInfo.data[0]
  return {
    userInfo:userInfo
  }
}