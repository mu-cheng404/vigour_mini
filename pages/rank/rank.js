const DB = wx.cloud.database()
const _att = DB.collection("attendance")
const _user = DB.collection("user")
Page({
  data: {
    isShow:true,
    current: '所有',
    current_scroll: '所有',
    infoList: [],
    barList: ["所有", "学习", "生活", "运动", "其他"], //导航栏列表
  },

  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key
    });
  },

  handleChangeScroll: async function ({detail}){
    console.log(detail)
    await this.getPunchNumber(detail.key)
    this.setData({
      current_scroll: detail.key
    });
  },
  getPunchNumber: async function (main) {
    this.setData({
      isShow:true
    })
    var tempInfoList = wx.getStorageSync(main)
    if (tempInfoList) {
      console.log("调用了缓存！")
      this.setData({
        infoList: tempInfoList
      })
    } else {
      await wx.cloud.callFunction({
          name: "getPunchNumber",
          data: {
            main: main == "所有" ? undefined : main
          }
        }).then((res) => {
          this.setData({
            infoList: res.result.Res
          })
          wx.setStorageSync(main, res.result.Res)
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
})