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
  navigativeToPlan: async function () {
    wx.navigateTo({
      url: '../recentlyUse/recentlyUse',
    })
    
  },
  data: {
    label: [], //标签集
    hasUserInfo: false,
    isShow:true,//是否显示加载中
  },
  onLoad: async function () {
    userInfo = app.globalData.userInfo
    this.setData({hasUserInfo:true})
    //获取标签数据
    var label = await wx.cloud.database().collection("label").get()
    label = label.data
    this.setData({label:label})

   
    

  },
  onShow: async function () {
    label_number = [] //初始化
  }
})