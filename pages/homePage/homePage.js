const DB = wx.cloud.database()
const _att = DB.collection("attendance")
const _ = DB.command
var app = getApp()
var userInfo //用户信息
var label_number = [] //标签下的打卡数量
Page({
  //处理主标签跳转
  _handelNavi: function (evt) {
    var id = evt.currentTarget.id
    wx.navigateTo({
      url: '../secondLabel/secondLabel?main=' + id,
    })
  },
  //处理快捷打卡按钮
  _handlerPunch: async function () {

    console.log("111")
    //全局变量获取用户信息
    userInfo = app.globalData.userInfo
    console.log(userInfo)
    console.log(userInfo.label)
    console.log(userInfo.label.length)
    //获取各个标签下的打卡数据
    var label = userInfo.label
    var promiseArr = []
    for (var i = 0; i < label.length; i++) {
      for (var j = 0; j < label[i].second.length; j++) {
        promiseArr.push(new Promise(async (resolve, reject) => {
          console.log(i)
          console.log(j)
          console.log(label[i].second[j])
          var I = i,
            J = j
          var temp_count = await _att.where({
            _openid: userInfo._openid,
            topic: label[I].second[J]
          }).count()
          temp_count = temp_count.total
          console.log("temp_count", temp_count)
          if (temp_count != 0) {
            console.log("I=", I, "J=", J)
            label_number.push({
              main: label[I].main,
              label: label[I].second[J],
              number: temp_count
            })
          }
          resolve()
        }))
      }
    }
    await Promise.all(promiseArr)
    //按打卡数量排序
    var compare = function (num1, num2) {
      return num2.number - num1.number
    }
    label_number = label_number.sort(compare)
    //渲染页面

    if (label_number) {
      wx.navigateTo({
        url: '../common_label/commen_label?label_number=' + JSON.stringify(label_number),
      })
    }
  },
  data: {
    label: [], //标签集
    isShow: true,
    hasUserInfo: false
  },
  onLoad: async function () {
    //获取标签数据
    var label = await wx.cloud.database().collection("label").get()
    label = label.data
    //渲染页面
    this.setData({
      label: label
    })
    setTimeout(async () => {
      this.setData({
        hasUserInfo: app.globalData.hasUserInfo,
        isShow: false
      })
    }, 2000);
  },
  onShow: async function () {
    label_number = [] //初始化
  }
})