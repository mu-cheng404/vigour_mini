
const util = require("../../common/util")
var isLogIn
const DB = wx.cloud.database()
var _ = DB.command
const _att = DB.collection("attendance")
const _user = DB.collection("user")
const _comment = DB.collection("comment")
var _openid //本用户openid
Page({
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
    label: [{
      main: ["学习", "study"],
      iconSrc: "../../image/theme-study.png",
      placement: "topRight",
      second: ["专修", "读书", "练字", "考研", "考证", "考级"]
    }, {
      main: ["生活", "life"],
      iconSrc: "../../image/theme-life.png",
      placement: "topLeft",
      second: ["早睡", "早起", "健身", "考研", "护肤", "心情", "喝水"]
    }, {
      main: ["运动", "sports"],
      placement: "bottomRight",
      iconSrc: "../../image/theme-sports.png",
      second: ["跑步", "行走", "骑行", "瑜伽", "冥想", "动作"]
    }, {
      main: ["其它", "others"],
      placement: "bottomLeft",
      iconSrc: "../../image/theme-others.png",
      second: ["写作", "成长", "工作", "手工", "手账", "其它"]
    }]

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
})