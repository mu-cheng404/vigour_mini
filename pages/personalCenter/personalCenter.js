const DB = wx.cloud.database()
const util = require('../../common/util.js')
const _att = DB.collection("attendance")
const _user = DB.collection("user")
var userInfo //用户信息
var Pcount //打卡总数
var label = [] //标签
var app = getApp()
var _openid
Page({
  //处理功能跳转
  handleNavi: function (evt) {
    var curId = evt.currentTarget.id //获取功能id
    wx.navigateTo({
      url: this.data.navigateUrl[curId],
    })
  },
  //获取用户信息
  _getUserProfile: async function () {
    await util.getUserInfo()
    _openid = wx.cloud.callFunction({
      name: "getOpenID"
    })
    _openid = (await _openid).result.openid
    userInfo = await _user.where({
      _openid: _openid
    }).get()
    userInfo = userInfo.data[0]

    this._getLabel()
  },
  data: {
    userCode: '', //用户唯一标识符
    userInfo: '', //用户个人信息
    hasUserInfo: "", //是否登录
    showLeft1: false,
    att_list: [],
    label: [], //标签
    Pcount: "", //打卡总数
    functionList: ["个人信息", "打卡记录", "排行榜", "兴趣探索"],
    navigateUrl: ["../basicsDisplay/basicsDisplay", "", "../rank/rank", "../recommend/recommend"]
  },
  _getLabel:async function () {
    app.globalData.userInfo = userInfo
    app.globalData.hasUserInfo = true
    
    this.setData({
      hasUserInfo: true,
      ['navigateUrl[' + 1 + ']']: "../personalPage/personalPage?_openid=" + userInfo._openid
    })

    //获取打卡总数
    Pcount = await _att.where({
      _openid: userInfo._openid
    }).count()
    Pcount = Pcount.total
    //获取标签信息
    var initLabel = await _att.where({
      _openid: userInfo._openid
    }).field({
      topic: true
    }).get()
    initLabel = initLabel.data
    //标签去重
    for (var i = 0; i < initLabel.length; i++) {
      if (label.indexOf(initLabel[i].topic) === -1) {
        label.push(initLabel[i].topic)
      }
    }
    this.setData({
      label: label,
      Pcount: Pcount,
      userInfo: userInfo
    })
  },
  onLoad: async function (options) {
    //全局变量获取userInfo和登录标识hasUserInfo
    if (app.globalData.userInfo) {
      userInfo = JSON.parse(JSON.stringify(app.globalData.userInfo))
      this._getLabel()
    }

  },
  onShow: async function () {
    this.onLoad()
  }
})