Page({
  testasync: function () {
    wx.cloud.callFunction({
      name: "test",
      data:{
        a : 1,
        b : 2
      },
      success:(res)=>{
        console.log(res)
      }
    })
  },
})