const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var _openid = wxContext.OPENID
  
  //uesr表中获取用户信息
  var userInfo = await cloud.database().collection("user").where({_openid: _openid}).get()
  userInfo = userInfo.data[0]

  return {userInfo:userInfo}
}