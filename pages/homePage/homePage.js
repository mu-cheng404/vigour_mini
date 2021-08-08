// pages/homePage/homePage.js
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
    imageURL: "cloud://wu-env-5gq7w4mm483966ef.7775-wu-env-5gq7w4mm483966ef-1306826028/images/",
    punchMessageArrays: [{
      avatorSrc: "../../images/avatar28_1.jpg",
      nickName: "Sera",
      date_year: "2021",
      date_month: "05.06",
      // title:"第一个",
      textContent: "我在飘雪之际虔诚信仰，祝愿每个人都充满晨光般的希望。",
      isLike: "false",
      isPicture: false,
      pictureSrc: "../../images/accessimage1.jpg",
      location:"",
      type:"早起",
    }, {
      avatorSrc: "../../images/avatar28_2.jpg",
      nickName: "医美·运动生理学",
      date_year: "2021",
      date_month: "04.29",
      // title:"第二个",
      textContent: "周一到周三每天一小时专业书籍学习。",
      isLike: false,
      isPicture: true,
      pictureSrc: "../../images/picture28_1.jpg",
      location:"",
      type:"学习"
    }, {
      avatorSrc: "../../images/avatar28_3.jpg",
      nickName: "φ(*￣0￣)满甜哒·跑步、跳绳",
      date_year: "2021",
      date_month: "04.29",
      // title:"第二个",
      textContent: "体能训练一小时",
      isLike: false,
      isPicture: true,
      pictureSrc: "../../images/picture28_2.jpg",
      location:"",
      type:"运动"
    }, {
      avatorSrc: "../../images/avatar28_4.jpg",
      nickName: "人生如戏",
      date_year: "2021",
      date_month: "04.27",
      // title:"第三个",
      textContent: "《幻夜》事情越来越复杂了，特别好奇新海美东这个女生，她背后究竟隐藏着什么秘密？明天再接着看看。",
      isLike: false,
      isPicture: false,
      pictureSrc: "",
      location:"",
      type:"读书"
    }, {
      avatorSrc: "../../images/avatar28_5.jpg",
      nickName: "胖胖",
      date_year: "2021",
      date_month: "04.25",
      // title:"第四个",
      textContent: "请允许我跌进你的梦里",
      isLike: false,
      isPicture: false,
      pictureSrc: "",
      location:"",
      type:"早睡"
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var message = wx.getStorageSync('message')
    console.log(message);
    if (message) {
      this.data.punchMessageArrays.push(message)
      console.log(this.data.punchMessageArrays)
      this.setData({
        punchMessageArrays: this.data.punchMessageArrays
      })
      wx.removeStorageSync('message')
    }
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