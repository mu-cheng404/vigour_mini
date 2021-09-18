const cloud = require('wx-server-sdk')
cloud.init()
const DB = cloud.database()
const _user = DB.collection("user")
exports.main = async (event, context) => {
  var allUserID = await _user.field({
    _openid:true
  }).get()
  allUserID = allUserID.data
  return {
    allUserID: allUserID,
  }
}