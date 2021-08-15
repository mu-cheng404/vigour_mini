const app = getApp()
const util = require("../../common/util")
Page({
  testAsync: async function () {
    return "hello async";
  },

  onLoad: async function () {
    wx.cloud.database().collection("attendance")
      .where({
        _openid: "ohRLL5DhHDRScbpZ9HL9mnlhLwSU"
      })
      .get()
      .then((res) => {
        console.log(res.data[0])
      })
      .catch(console.error)
  }
})