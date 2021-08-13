// pages/homePage/homePage.js
const DB = wx.cloud.database()
const _att = DB.collection("attendance")
Page({
  _handlerLike: function (evt) {
    console.log(evt);
    let id = evt.target.id;
    console.log(id);
    this.setData({
      ['punchMessageArrays[' + id + '].isLike']: !this.data.punchMessageArrays[id].isLike,
    })
  },
  _handleTap: function () {
    wx.navigateTo({
      url: '../remarks/remarks',
    })
  },
  _handlerPunch: function () {
    wx.switchTab({
      url: '../punchCard/punchCard',
    })

  },
  /**
   * 页面的初始数据
   */
  data: {
    punchMessageArrays: [],
    datearrays: [],

  },


  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {


    try {
      var info = wx.getStorageSync('userBaseInfo')
      if (info) { //若存在，则复制给data
        // Do something with return value
        this.setData({
          userInfo: info,
          hasUserInfo: true
        })
      }
    } catch (e) {
      // Do something when catch error
    }
    _att.get().then(res => {
      console.log("获取所有用户打卡数据成功",res)
      this.setData({
        punchMessageArrays: res.data.reverse()
      })
      // for (var i = 0; i < res.data.length; i++) {
      //   this.setData({
      //     ["datearrays[" + i + "]"]: res.data[i].date.toLocaleDateString().concat(res.data[i].date.toLocaleTimeString())
      //   })
      // }
    })





  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad()
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