const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  //获取修改后的userinfo
  var change_userInfo = event.change_userInfo
  return await cloud.database().collection("user").doc(change_userInfo._id).update({
    data:{
      avatarUrl:change_userInfo.avatarUrl,
      city:change_userInfo.city,
      country:change_userInfo.country,
      gender:change_userInfo.gender,
      label:change_userInfo.label,
      nickName:change_userInfo.nickName,
    }
  })
}