  const cloud = require('wx-server-sdk')
  cloud.init()
  const DB = cloud.database()
  const _att = DB.collection("attendance")
  const _user = DB.collection("user")
  exports.main = async (event, context) => {
    const $ = DB.command.aggregate
    var topic = event.topic //查询的类型
    var Res = [] //最后的输出结果
    await _att.aggregate().match({
        topic: topic
      }).group({
        _id: '$_openid',
        count: {
          $sum: 1,
        }
      })
      .sort({
        count: -1
      }).end().then((res) => {
        Res = res.list
      }).catch(console.error)

    for (var i = 0; i < Res.length; i++) {
      await _user.where({
        _openid: Res[i]._id
      }).get().then((res) => {
        Res[i].avatarUrl = res.data[0].avatarUrl
        Res[i].nickName = res.data[0].nickName
        Res[i].gender = res.data[0].gender
      })
    }
    return {
      Res:Res
    }
  }