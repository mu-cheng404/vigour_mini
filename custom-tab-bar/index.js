// index.js
Component({
  data: {
    isShow_index:true,
    isShow_playing:false,
    isShow_me:false,
    selected: 0, //首页
    color: "#8D8D8D",
    selectedColor: "#8D8D8D",
    list: [
      {
        "pagePath": "pages/homePage/homePage",
        "text": "主页",
        "iconPath": "../image/home-page.png",
        "selectedIconPath": "../image/select-home-page.png"
      },
      {
        "pagePath": "pages/punchCard/punchCard",
        "text": "打卡",
        "iconPath": "../image/punchCard.png",
        "selectedIconPath": "../image/select-punchCard.png"
      },
      {
        "pagePath": "pages/personalCenter/personalCenter",
        "text": "我的",
        "iconPath": "../image/person.png",
        "selectedIconPath": "../image/select-person.png"
      }
    ]
  },

  methods: {
    switchTab_index:function(){
      wx.switchTab({
        url:'/pages/homePage/homePage'
      })
      this.setData({
        isShow_index: true,
        isShow_me: false,
        isShow_playing: false
      })
    },

    switchTab_playing: function () {
      wx.switchTab({
        url: '/pages/punchCard/punchCard'
      })
      this.setData({
        isShow_playing: true,
        isShow_index: false,
        isShow_me: false
      })
    },

    switchTab_me: function () {
      wx.switchTab({
        url: '/pages/personalCenter/personalCenter'
      })
      this.setData({
        isShow_me:true,
        isShow_playing: false,
        isShow_index: false
      })
    }
  }
})