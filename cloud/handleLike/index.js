// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB = wx.cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("123123213123123")
  const wxContext = cloud.getWXContext()
  const _ = DB.command
  var openid = wxContext.OPENID //用户openid
  var id = "123123" //被点赞的id
  var like = true //点赞、取消点赞

  DB.collection("attendance")
    .where({
      _openid: openid
    })
    .update({
      data: {
        praise: _.inc(like ? 1 : -1)
      },
      success: (res) => {
        console.log("praise修改成功！", res)
      },
      fail: (res) => {
        console.log("praise修改失败！", res)

      }
    })

  DB.collection("like")
    .add({
      data: {
        like_openID: openid,
        liked_id: id
      },
      success: (res) => {
        console.log("添加like表数据类型成功！", res)
      },
      fail: (res) => {
        console.log("添加like表数据类型失败！", res)
      }


    })
  return 123
}