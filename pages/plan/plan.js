var app = getApp()//获取app实例
var userInfo//获取用户登录信息
var _openid//用户openid
var label//用户打卡标签数组
var convert_label = []//数组转换为对象
Page({

  //设置模板
  setModel:function(evt) {
    //获取id
    var id = evt.currentTarget.id
    console.log("点击第"+id+"个")
    //定位该标签
    var mainIndex//大标题下标
    var secondIndex//二级标题下标
    for(var i = 0; i < label.length;i++){
      if(label[i].main==convert_label[id].main){
        mainIndex = i
      }
      for(var j = 0;j < label[i].plan.length;j++){
        if(label[i].second[j] == convert_label[id].second){
          secondIndex = j;
          break;
        }
      }
    }
    console.log("i=",mainIndex+" j="+secondIndex)
    //获取跳转参数
    var data = {
      topic:convert_label[id].second,//二级标题
      secondIndex:secondIndex,//二级标签对应下标
      main : convert_label[id].main,//主标签
      mainIndex : mainIndex,//主标签对应下标
      title : convert_label[id].title,//附属标题
    }
    
    //跳转到punchEdit页面
    wx.navigateTo({ 
      url: '../setModel/setModel?data='+ JSON.stringify(data),
    })
  },
  //点击直接打卡
  punch:function(params) {
    
  },
  //修改计划
  changePlan:function(params) {
    
  },
  //新增计划
  addPlan:function(params) {
    
  },
  //删除计划
  deletePlan:function(params) {
    
  },

  //页面数据
  data: {
    label_info:[],//页面信息：包括主标签、二级标签、计划、附属标题、模板（整个打卡信息）
  },
  //生命周期函数-加载
  onLoad: async function (options) {
    //全局获取数据
    userInfo = app.globalData.userInfo
    _openid = userInfo._openid
    label = userInfo.label
    //获取标签信息
    var index = 0
    console.log("label=",label)
    for(var i = 0; i < label.length;i++){
      for(var j = 0; j < label[i].plan.length;j++){
        //筛选出设置了计划的那部分
        if(label[i].plan[j]){
          var temp_data = {
            main:label[i].main,
            second:label[i].second[j],
            title : label[i].title[j],
            plan: label[i].plan[j]
          }
          convert_label[index ++] = temp_data
        }
      }
    }
    console.log("con=",convert_label)
    //展示
    this.setData({label_info:convert_label})
  },
})