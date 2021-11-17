var app = getApp() //获取app实例
var userInfo //获取用户登录信息
var _openid //用户openid
var label //用户打卡标签数组

const DB = wx.cloud.database()
const _template = DB.collection("template") //模板表
const util = require("../../common/util")
const _att = DB.collection("attendance")
const $ = DB.command.aggregate
const _ = DB.command
var list_with_info = [] //包含打卡信息的列表
Page({
  //导入最近的计划
  getRecentPlan: async function () {
    var length = list_with_info.length
    for (var i = 0; i < length; i++) {
      var record = await _att.aggregate().match({
        _openid: _openid,
        topic: list_with_info[i]._id,
        fushu_content: _.neq('')
      }).sort({
        parseDate: -1,
      }).limit(1).end()
      record = record.list[0]
      console.log(record)
      list_with_info[i].plan = record.fushu_content
      list_with_info[i].main = record.main
    }
    console.log(list_with_info)
    this.toRenderPage()
    
  },

  //处理点击打卡操作
  punch: function (evt) {
    var id = evt.target.id
    console.log(id)
    console.log(list_with_info)
    var topic = list_with_info[id]._id
    var mainText = list_with_info[id].main
    var plan = list_with_info[id].plan
    wx.navigateTo({
      url: '../punchEdit/punchEdit?topic=' + topic + '&mainText=' + mainText + '&fushu_title=计划'+'&plan='+plan,
    })
  },

  //渲染数据
  toRenderPage: function () {
    this.setData({
      label_info: list_with_info
    })
  },
  //页面数据
  data: {
    label_info: [],
    isComplated:false
  },


  //获得所有有记录的标签，按打卡次数排序
  //返回带有记录的
  getPunchList: async function () {
    //get label plan 
    list_with_info = await _att.aggregate().match({
        _openid: _openid
      }).sortByCount('$topic')
      .end()
    list_with_info = list_with_info.list
    this.toRenderPage();
  },


  //生命周期函数-加载
  onLoad: async function (options) {
    //全局获取数据
    userInfo = app.globalData.userInfo
    _openid = userInfo._openid
    await this.getPunchList()
    await this.getRecentPlan()

    this.setData({
      isComplated:true
    })

  },
  onShow: function () {
    this.onLoad()
  }
})