// pages/record/record.js
Page({

  /**
   * 页面的初始数据
   */
  methods:{ _handlerPunch(){}
},
   
  _handlerPunch:function(){
    wx.switchTab({
      url: '../punchCard/punchCard',
    })
  },
  data: {
    imageURL: "cloud://wu-env-5gq7w4mm483966ef.7775-wu-env-5gq7w4mm483966ef-1306826028/images/",
    punchMessageArrays:[{
      avatorSrc:"../../images/avator.jpg",
      nickName:"木木",
      date_year:"2021",
      date_month:"05.04",
      pictureSrc:"../../images/xuexi.png",
      textContent:"才背了30个核心词汇，快要考试了┭┮﹏┭┮，明天加大词量！",
      category:"学习"
    },{
      avatorSrc:"../../images/avator.jpg",
      nickName:"木木",
      date_year:"2020",
      date_month:"10.01",
      pictureSrc:"../../images/yundong.png",
      textContent:"和发哥一起在南苑操场跑了5公里，配速5'06''。风很轻，我们两个都湿透了，发哥的肌肉还是那么好看。",
      category:"跑步"

    },{
      avatorSrc:"../../images/avator.jpg",
      nickName:"木木",
      date_year:"2020",
      date_month:"08.01",
      pictureSrc:"../../images/dushu.png",
      textContent:"记不住啊！《百年孤独》20页里，人名得有20个=_=",
      category:"读书"

    },{
      avatorSrc:"../../images/avator.jpg",
      nickName:"木木",
      date_year:"2020",
      date_month:"07.01",
      pictureSrc:"../../images/zaoshui.png",
      textContent:"党的光辉万丈长！早睡早起做栋梁！",
      category:"早睡"

    },{
      avatorSrc:"../../images/avator.jpg",
      nickName:"木木",
      date_year:"2020",
      date_month:"05.04",
      pictureSrc:"../../images/zaoqi.png",
      textContent:"早起的鸟儿有虫吃^.^",
      category:"学习"

    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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