const DB = wx.cloud.database()
const _user = DB.collection("user")
const util = require('../../common/util.js')
const _att = DB.collection("attendance")
var openID //用户openid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userCode: '', //用户唯一标识符
    userInfo: '', //用户个人信息
    hasUserInfo: false, //是否登录
    showLeft1: false,
    att_list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {

    openID = options._openid //获取openid
    _user.where({
        _openid: openID
      }).get()
      .then((res) => {
        console.log("获取用户信息成功！", res)
        this.setData({
          userInfo: res.data[0],
        })
        //获取该用户所有打卡信息并展示
        _att.where({
            _openid: openID
          })
          .get()
          .then((res) => {
            console.log("获取该用户打卡数据成功！", res.data)
            this.setData({
              att_list: res.data.reverse()
            })
          })
          .catch(console.error)
      })
      .catch(console.error)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    //云函数获取openid





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