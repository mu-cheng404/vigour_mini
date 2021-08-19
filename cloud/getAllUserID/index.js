const cloud = require('wx-server-sdk')
cloud.init()
const DB = cloud.database()
const _user = DB.collection("user")
exports.main = async (event, context) => {
  var allUserID = []
  const $ = DB.command.aggregate
  await _user.aggregate().replaceRoot({
      newRoot: {
        _openid: "$_openid"
      }
    })
    .end().then((res) => {
      allUserID = res.list
    })
    .catch(console.error)

  return {
    allUserID: allUserID,
  }
}