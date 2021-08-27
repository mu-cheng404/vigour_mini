const DB = wx.cloud.database()

Page({
  deleteLike: async function () {

    // for (var a = 0; a < 1; a++){
    DB.collection("attendance").where({
      _openid: "ohRLL5KG6AXpEKs-ptzsPSOBGpF4",
      topic: "练字"
    }).remove().then((res) => {
      console.log("hahha ", res)
    })
    // }
  }

})