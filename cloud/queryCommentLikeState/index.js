const cloud = require('wx-server-sdk')
cloud.init()
const DB = cloud.database()
const _like = DB.collection("like")

exports.main = async (event, context) => {
  var comData = event.comData//评论数据
  var length = event.length
  var cur_openid = event.cur_openid//当前用户id 
  var isLike_comment = [] //结果数组

  for (var i = 0; i < length; i++) {
    console.log("这是第" + i + "个循环中")
    var commentLike //暂时点赞状态
    var commentID = comData[i]._id //评论id
    await _like.where({
        liked_id: commentID,
        _openid: cur_openid
      })
      .get()
      .then((res) => {
        console.log("查询成功！", res)
        commentLike = res.data.length ? true : false
        console.log("第" + i + "个评论", commentLike)
        isLike_comment[i] = commentLike
      })
      .catch((error) => {
        console.log("查询失败！", res)
      })
  }
  return isLike_comment
}