const DB = wx.cloud.database()
const _user = DB.collection("user") //打卡表

const citys = {
  学习: ["读书", "练字", "考研", "考证", "考级", "背单词"],
  生活: ["早睡", "早起", "健身", "护肤", "心情"],
  运动: ["跑步", "行走", "骑行", "瑜伽", "冥想", "动作"],
  其他: ["写作", "成长", "工作", "手工", "手账"],
};
var main = ['学习', '生活', '运动', '其他']

var label = [{
  main: "学习",
  second: ["读书", "练字", "考研", "考证", "考级", "背单词"],
  title: ["计划", "计划", "计划", "计划", "计划", "计划"],
  plan: ["读书30天", "", "", "", "", "六级"],
  templateID: ["", "", "", "", "", ""],
}, {
  main: "生活",
  second: ["早睡", "早起", "健身", "护肤", "心情"],
  title: ["计划", "计划", "计划", "计划", "计划"],
  plan: ["", "", "", "", ""],
  templateID: ["", "", "", "", "", ""],

}, {
  main: "运动",
  second: ["跑步", "行走", "骑行", "瑜伽", "冥想", "动作"],
  title: ["计划", "计划", "计划", "计划", "计划", "计划"],
  plan: ["", "", "", "", "", ""],
  templateID: ["", "", "", "", "", ""],

}, {
  main: "其他",
  second: ["写作", "成长", "工作", "手工", "手账"],
  title: ["计划", "计划", "计划", "计划", "计划"],
  plan: ["", "", "", "", ""],
  templateID: ["", "", "", "", "", ""],
}]
var input_value = '' //输入的内容
var I //main下标
var J //second下标

var templateID //设置完模板的返回的ID
var userInfo

var app = getApp()
Page({
  setModel: async function () {
    //跳转到punchEdit页面
    wx.navigateTo({
      url: '../setModel/setModel?templateID=' + label[I].templateID[J] + '&mainIndex=' + I + '&secondIndex=' + J,
    })
  },
  input: function (evt) {
    var value = evt.detail.value
    input_value = value
  },
  //点击确认
  confirm: async function () {
    //已经得到了模板ID和计划，更新到user表
    label[I].plan[J] = input_value
    label[I].templateID[J] = templateID
    await _user.doc(userInfo._id).update({
      data: {
        label: label
      }
    })
    wx.showModal({
      cancelColor: 'cancelColor',
      content: "编辑成功，是否返回？",
      success: res => {
        if (res.confirm) {
          wx.navigateTo({
            url: '../plan/plan',
          })
        } else {
          this.onLoad()
        }
      }
    })

  },
  //选择器
  onChange(event) {

    var value = event.detail.value
    var index = event.detail.index
    var picker = event.detail.picker
    console.log(event.detail)
    for (var i = 0; i < 4; i++) {
      if (main[i] == value[0]) {
        I = i;
        break;
      }
    }
    console.log(label[I].second)
    for (var i = 0; i < label[I].second.length; i++) {
      if (label[I].second[i] == value[1]) {
        J = i;
        break;
      }
    }

    picker.setColumnValues(1, citys[value[0]]);
    console.log(I, J, label[I].plan[J])
    this.setData({
      planText: label[I].plan[J]
    })
  },
  data: {
    columns: [{
        values: Object.keys(citys),
        className: 'column1',
      },
      {
        values: citys['学习'],
        className: 'column2',
        defaultIndex: 2,
      },
    ],
  },
  onLoad: function (options) {
    //标签列表
    //获取返回来的模板ID
    templateID = options.templateID ? options.templateID : ''
    // userInfo = app.globalData.userInfo//正常
    userInfo = wx.getStorageSync('userInfo')//调试
    console.log(userInfo)
    label = userInfo.label

  }
})