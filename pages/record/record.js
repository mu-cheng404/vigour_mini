import { $wuxCalendar } from '../../miniprogram_npm/wux-weapp/index'
var util = require('../../common/util.js')

const DB = wx.cloud.database()
const _att = DB.collection("attendance")

var app = getApp()//app实例
var userInfo //登录信息

var all_info= []//所有打卡信息
Page({
    data: {
        value1: [],
        show_info:[]//展示的信息
    },
    onLoad:async function(options) {
      var current_time = util.formatDate(new Date()).slice(0,10);
      
      $wuxCalendar().open({
        closeOnSelect:false,
        maxDate:current_time,
        onChange:(values, displayValues)=>{
          var select_date = displayValues//选择的日期
          var show_info = []
          for(var i = 0;i < all_info.length;i++){
            if(select_date == all_info[i].date.slice(0,10)){
              show_info.push(all_info[i])
            }
          }
          this.setData({show_info:show_info})
        }
      })
      //初始化
      all_info = []
      //获取登录信息
      userInfo = app.globalData.userInfo
      //获取数量
      var count = await _att.where({_openid:userInfo._openid}).count()
      count = count.total
      
      //获取数据
      for(var i = 0;i < count;i+=20){
        var temp_info = await _att.where({_openid:userInfo._openid}).skip(i).get()
        temp_info = temp_info.data
        all_info=all_info.concat(temp_info)
      }


    }
})