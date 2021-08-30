const DB = wx.cloud.database()

Page({
  deleteLike: async function () {
    DB.collection("attendance").where({
      _openid: "ohRLL5KG6AXpEKs-ptzsPSOBGpF4",
      topic: "练字"
    }).remove().then((res) => {
      console.log("hahha ", res)
    })
  },
  deleteTest: function (params) {
    DB.collection("attendance").where({
      content: "测试"
    }).remove().then((res) => {
      console.log("完成！",res)
    })
  }


})