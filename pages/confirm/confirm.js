var userInfo //yonghuxinxi 
var app = getApp()
const DB = wx.cloud.database()
const _sup = DB.collection("supervise") //监督表
var SuperedID = ""

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
   await DB.collection("user").where({
     _openid:options.SuperedID
   }).get().then(res => {
    console.log(res.data)
   
    this.setData({
      
        nickName:res.data[0].nickName
      
    })
   })
   var nickName=this.data.nickName
    wx.showModal({
      title:'是否同意来自'+nickName+'一起学习的请求',
      success(res) {
        if(res.confirm){
          _sup.add({
            data:{
              superedID:options.SuperedID
            }
          }).then(res => {
            console.log("成功")
            
          }).catch(console.error)
        }
        else if(res.cancel){
          wx.redirectTo({
            url: '../homepage/homepage',

          })
        }
      }
    })
 
  },
accept(){
   _sup.add({
    data: {
      superedID: "",
      openid:userInfo._openid
    }
  })
  .then((res) => {
    console.log("添加关注数据成功！")
    wx.showToast({
      title: '已同意申请',
    })
  })
  .catch(console.error)

},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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