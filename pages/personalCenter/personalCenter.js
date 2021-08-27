const DB = wx.cloud.database()
const _user = DB.collection("user")
const util = require('../../common/util.js')
const _att = DB.collection("attendance")
var userInfo //用户信息
var _openid //用户openid
var Pcount //打卡总数
var label = [] //标签
Page({
  //处理功能跳转
  handleNavi: function (evt) {
    var curId = evt.currentTarget.id //获取功能id
    wx.navigateTo({
      url: this.data.navigateUrl[curId],
    })
  },
  //遮罩层
  toggleLeft1: function () {
    this.setData({
      showLeft1: !this.data.showLeft1
    });
  },
  //获取用户信息
  _getUserProfile: async function () {
    await util.getUserInfo()
    this.setData({
      hasUserInfo: true
    })
    this.onShow()
  },
  //跳转->意见反馈页面
  _handler_advise: function () {
    wx.navigateTo({
      url: '../opinion/opinion',
    })
  },
  //跳转->基本资料页面
  _handler_basics: function () {
    wx.navigateTo({
      url: '../basicsDisplay/basicsDisplay',
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    userCode: '', //用户唯一标识符
    userInfo: '', //用户个人信息
    hasUserInfo: false, //是否登录
    showLeft1: false,
    att_list: [],
    label: [], //标签
    Pcount: "", //打卡总数
    functionList: ["个人信息", "排行榜", "推荐好友", "关于我们"],
    navigateUrl: ["../basicsDisplay/basicsDisplay", "../rank/rank", "../recommend/recommend", "../about/about"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {

    //获取openid
    _openid = await wx.cloud.callFunction({
      name: "getOpenID"
    })
    _openid = _openid.result.openid
    //获取用户信息
    userInfo = await _user.where({
      _openid: _openid
    }).get()
    userInfo = userInfo.data[0]
    //判断是否以登录
    if (userInfo) {
      this.setData({
        hasUserInfo: true
      })
    }
    //获取打卡总数
    Pcount = await _att.where({
      _openid: _openid
    }).count()
    Pcount = Pcount.total
    //获取标签信息
    var initLabel = await _att.where({
      _openid: _openid
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {

      this.getTabBar().setData({
        isShow_me: true,
        isShow_playing: false,
        isShow_index: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})