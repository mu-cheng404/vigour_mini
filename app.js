//imageURL:  cloud://wu-env-5gq7w4mm483966ef.7775-wu-env-5gq7w4mm483966ef-1306826028/images/
 
App({

  globalData: {
    label: ["早起", "学习", "运动", "读书", "早睡", "健康", "喝水"],
    _openid: "", //用户openid
    userInfo: "", //用户信息
    hasUserInfo: false, //是否登录
  },
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: async function () {
    var start = new Date().getTime()
    //云开发环境的初始化
    await wx.cloud.init({
      env: "wu-env-5gq7w4mm483966ef"
    })
    //获取用户openid
    var tempID = await wx.cloud.callFunction({
      name: "getOpenID"
    })
    tempID = tempID.result.openid
    this.globalData._openid = tempID
    console.log("全局获取openid成功")
    //获取用户信息
    var tempUserInfo = await wx.cloud.callFunction({
      name: "getUserInfo",
      data:{
        _openid :this.globalData._openid
      }
    })
    tempUserInfo = tempUserInfo.result.userInfo
    this.globalData.userInfo = tempUserInfo
    if(!this.globalData.userInfo){
      wx.switchTab({
        url: '/pages/personalCenter/personalCenter',
      })
    }else{
      this.globalData.hasUserInfo = true
      console.log("this.globalData.hasUserInfo",this.globalData.hasUserInfo)
    }
    console.log("全局获取userInfo成功")
    var end = new Date().getTime()
    console.log((end-start)+'ms')
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  }
})