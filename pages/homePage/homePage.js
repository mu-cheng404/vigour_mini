
const util = require("../../common/util")
var isLogIn
const DB = wx.cloud.database()
var _ = DB.command
const _att = DB.collection("attendance")
const _user = DB.collection("user")
const _comment = DB.collection("comment")
var _openid //本用户openid
Page({
  _handelNavi:function(evt) {
    var id = evt.currentTarget.id
    wx.navigateTo({
      url: '../secondLabel/secondLabel?main='+id,
    })
  },
  _handleDetail: function (evt) {
    var id = evt.currentTarget.id
    var main = id[0]
    var second = id.substr(1)
    wx.navigateTo({
      url: '../punchEdit/punchEdit?topic=' + this.data.label[main].second[second],
    })
  },
  _handlerPunch: async function () {
    var tempTopic
    _att.where({
      _openid: _openid
    }).get().then((res) => {
      var templength = res.data.length
      tempTopic = res.data[templength - 1].topic
      console.log(tempTopic)
      if (tempTopic) {
        wx.showModal({
          cancelColor: 'cancelColor',
          content: "要继续上一次：" + tempTopic + "的打卡吗",
          success(res) {
            if (!res.cancel) { //确定
              wx.navigateTo({
                url: '../punchEdit/punchEdit?type=' + tempTopic
              })
            } else { //取消
              wx.switchTab({
                url: '../punchCard/punchCard',
              })
            }
          }
        })
      } else {
        wx.switchTab({
          url: '../punchCard/punchCard',
        })
      }
    })
  },
  data: {
    visible: true,
    placement: ["topRight", "topLeft", "bottomRight", "bottomLeft"], //气泡框的位置
    label: []
  },
  hide() {
    this.setData({
      visible: false,
    })
  },
  onChange(e) {
    console.log('onChange', e)
    this.setData({
      visible: e.detail.visible,
    })
  },
  onLoad: async function(){
    //获取标签数据
    var label = await wx.cloud.database().collection("label").get()
    label = label.data
    //渲染页面
    this.setData({label:label})
  }
})