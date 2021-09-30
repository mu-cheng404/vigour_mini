const util = require("../../common/util")

var userInfo//用户登录信息
var app = getApp()//app实例
Page({
  _switchToHomePage:function(params) {
    wx.switchTab({url: '/pages/homePage/homePage'})
    // wx.navigateTo({
    //   url: '/pages/plan/plan',
    // })
  },
  _getUserInfo:async function(params) {
    await util.getUserInfo()
    userInfo = await wx.cloud.callFunction({name: "getUserInfo",})
    userInfo = userInfo.result.userInfo
    
    app.globalData.userInfo = userInfo//赋给全局变量
    app.globalData.hasUserInfo = true,
    this._switchToHomePage()
  },
  data:{
    isShow:true,
  },
  onLoad: async function(options) {
    var start = new Date().getTime()
    //获取用户openid
   
    //获取用户信息
    userInfo = await wx.cloud.callFunction({name: "getUserInfo",})
    userInfo = userInfo.result.userInfo
    console.log(userInfo)
    app.globalData.userInfo = userInfo//赋给全局变量
    
    if(!userInfo){
      this.setData({isShow:false})
    }else{
      app.globalData.hasUserInfo = true,
      this._switchToHomePage()
    }
    var end = new Date().getTime()
    console.log((end-start)+'ms')
  }
})