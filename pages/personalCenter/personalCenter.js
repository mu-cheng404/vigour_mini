const DB = wx.cloud.database().collection("user")

Page({
  _getUserProfile(){
    
    var _this = this
    //获取用户基本信息
    wx.getUserProfile({
      //用于显示给用户的提示信息
      desc: '用于完善个人信息',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        //存入缓存
        try{
          wx.setStorageSync('userBaseInfo', this.data.userInfo)
        }catch(e){
          console.log(e)
        }
        //数据传入服务器中
        DB.add({
          data:{
            nickName: this.data.userInfo.nickName,
            avatarUrl: this.data.userInfo.avatarUrl,
            gender: this.data.userInfo.gender,
            country: this.data.userInfo.country,
            province: this.data.userInfo.province,
            city: this.data.userInfo.city,
            language: this.data.userInfo.language,
          },
          success(res){
            console.log("success add!", res)
          },
          fail(res){
            console.log("fail add!", res)
          }
        })
      },
      fail(res){
        console.log("fail to get userInfo", res)
      }
    })
    
    
    
  },
  //跳转->打卡记录页面
  _handler_punchRecord: function () {
    wx.navigateTo({
      url: '../record/record',
    })
  },
  //跳转->意见反馈页面
  _handler_advise: function () {
    wx.navigateTo({
      url: '../opinion/opinion',
    })
  },
  //跳转->基本资料页面
  _handler_basics: function () {
    wx.navigateTo({
      url: '../basicsDisplay/basicsDisplay',
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    imageURL: "cloud://wu-env-5gq7w4mm483966ef.7775-wu-env-5gq7w4mm483966ef-1306826028/images/",
    userCode: '',//用户唯一标识符
    userInfo: '',//用户个人信息
    hasUserInfo: false //是否登录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //读取缓存中的基本信息
    try {
      var info = wx.getStorageSync('userBaseInfo')
      if (info) {//若存在，则复制给data
        // Do something with return value
        this.setData({
          userInfo: info,
          hasUserInfo: true
        })
      }
    } catch (e) {
      // Do something when catch error
    }
    
   
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