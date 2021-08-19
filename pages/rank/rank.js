const DB = wx.cloud.database()
const _att = DB.collection("attendance")
const _user = DB.collection("user")
var allUserID = [] //所有用户的ID
Page({

  data: {
    isShow:true,
    current: '所有',
    current_scroll: '所有',
    infoList: [],
    barList: ["所有", "早起", "学习", "运动", "读书", "早睡", "健康"], //导航栏列表
  },

  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key
    });
  },

  handleChangeScroll: async function ({
    detail
  }) {
    console.log(detail)
    await this.getPunchNumber(detail.key)
    this.setData({
      current_scroll: detail.key
    });
  },
  getPunchNumber: async function (topic) {
    this.setData({
      isShow:true
    })
    var tempInfoList = wx.getStorageSync(topic)
    if (tempInfoList) {
      console.log("调用了缓存！")
      this.setData({
        infoList: tempInfoList
      })
    } else {
      await wx.cloud.callFunction({
          name: "getPunchNumber",
          data: {
            topic: topic == "所有" ? undefined : topic
          }
        }).then((res) => {
          this.setData({
            infoList: res.result.Res
          })
          wx.setStorageSync(topic, res.result.Res)
        })
        .catch(console.error)
    }
    this.setData({
      isShow:false
    })
  },
  onLoad: async function (options) {
    await this.getPunchNumber("所有")
  },
  onUnload: function () {
    console.log("排行榜页面被卸载了！！！！")
    wx.clearStorage({
      success: (res) => {
        console.log("成功清除缓存！")
      },
    })
  },

  onPullDownRefresh: async function () {
    
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