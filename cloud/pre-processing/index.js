const cloud = require('wx-server-sdk')
cloud.init()
const DB = cloud.database()
const _ = DB.command
const _att = DB.collection("attendance") //打卡表
const _user = DB.collection("user") //用户表
const _label = DB.collection("label")//标签表
const $ = DB.command.aggregate //聚合操作符
var openidArr //所有用户的openID
var N //数据量
var n//数据维度
var Data //数据处理结果
var label//标签列表
exports.main = async (event, context) => {
  await _label.get().then((res)=>{
    label= res.data[0].label
    n = label.length
  })
  await _user.aggregate().group({
      _id: "$_openid"
    }).end().then(async (res) => {
      openidArr = [] //所有用户openid的数组
      for (var i = 0; i < res.list.length; i++) { //初始化_openid数组
        openidArr.push(res.list[i]._id)
      }
      N = openidArr.length //N初始化
      Data = [] //初始化数据集
      for (var i = 0; i < openidArr.length; i++) { //处理Data
        var singleData = [] //单个用户，单个数据
        for (var j = 0; j < n; j++) {
          await _att.where({
            _openid: openidArr[i],
            topic: label[j]
          }).count().then((res) => {
            singleData.push(res.total)
          })
        }
        Data.push({
          id: openidArr[i],
          data: singleData
        })
      }
    })
    .catch(console.error)
  return {
    Data: Data
  }
}