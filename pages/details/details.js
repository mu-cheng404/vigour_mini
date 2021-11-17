import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const util = require('../../common/util')
const DB = wx.cloud.database()
const _ = DB.command
const _att = DB.collection("attendance") //打卡表
const _like = DB.collection("like") //点赞表
const _comment = DB.collection("comment") //评论表
const _user = DB.collection("user") //用户表
const _sup = DB.collection("supervise") //监督表
var app = getApp()//app实例
var content //评论内容
var openid //当前用户的openid

var att_info//打卡信息
var userInfo//登录信息
Page({
  //处理弹出框
  showPopup() {
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  //处理监督按钮
  handleSupervise: async function () { 

    var is_done = this.data.att_info.isSup //是否已关注
    await wx.requestSubscribeMessage({
      tmplIds: ['mnsEh9CZLNqarLbeZZJ94RQxXh6rCriQo_gFRuXWmM8'],
      success(res) {
        wx.getSetting({
          withSubscriptions: true,
        }).then(res => {
          console.log(res)
        })
      }
    })
    //发模板消息
    await wx.cloud.callFunction({
      name: "sendTemplateMessage_yiqixuexi",
      data:{
        info:{
          nickname:att_info.nickName,
          openid:att_info._openid,
          name:userInfo.nickName,
          time:util.formatDate(new Date()),
          id:userInfo._openid
        }
      }
    }).then(console.log)
    // if (!is_done) { //若没有关注
      
    //   await _sup.add({
    //       data: {
    //         superedID: att_info._openid
    //       }
    //     })
    //     .then((res) => {
    //       console.log("添加关注数据成功！")
    //       wx.showToast({
    //         title: '已关注小可爱',
    //       })
    //     })
    //     .catch(console.error)
    // } else {
    //   await _sup.where({
    //       _openid: openid,
    //       superedID: att_info._openid
    //     }).remove()
    //     .then((res) => {
    //       console.log("删除关注数据成功！")
    //       wx.showToast({
    //         title: '已取消关注',
    //       })
    //     })
    //     .catch(console.error)
    // }
    // this.setData({
    //   ['att_info'+'.isSup']: !is_done
    // })
  },
  //预览图片
  preivewImage: function (evt) {
    console.log(evt.currentTarget.id)
    var id = evt.currentTarget.id
    var pictures = this.data.att_info.pictures
    wx.previewImage({
      showmenu: true,
      urls: pictures,
      current: pictures[id],
      success(res) {
        console.log("预览成功！", res)
      },
      fail(res) {
        console.log("预览失败！", res)
      }
    })
  },
  //处理打卡条点赞
  handleLike: async function () {
    var data = att_info//打卡信息
    if (data.islike) { //取消点赞
      //渲染页面
      this.setData({
        ["att_info" + ".praise"]: data.praise - 1,
        ['att_info' + ".islike"]: 0

      })
      console.log("取消点赞成功！")
      //数据库中点赞数-1
      await _att.doc(data._id).update({
        data:{
          like_list:_.pull(att_info._openid),
          praise: _.inc(-1)
        }
      })
    } else {//点赞
      //渲染页面
      this.setData({
        ["att_info" + ".praise"]: data.praise + 1,
        ['att_info' + ".islike"]: 1
      })
      console.log("点赞成功！", data.praise)
      //数据库点赞数+1
      await _att.doc(data._id).update({
        data:{
          like_list:_.push(att_info._openid),
          praise: _.inc(1)
        }
      })
    }
  },
  //处理删除打卡条
  _handerDelete: function () {
    wx.showModal({
      cancelColor: 'cancelColor',
      content: "你确定要删掉吗",
      success: async (res) => {
        if (!res.cancel) {
          await _att.doc(att_info._id).remove().then((res) => {
              console.log("打卡表删除成功！")
            })
            .catch(console.error)

          var tempComList = this.data.commentList
          var tempComIDList = []
          for (var i = 0; i < tempComList.length; i++) {
            tempComIDList.push(tempComList._id)
          }
          tempComIDList.push(att_info._id)
          await _like.where({
              liked_id: _.or(tempComIDList)
            }).remove().then((res) => {
              console.log("点赞删除成功！")
            })
            .catch(console.error)
          await _comment.where({
              commented_id: att_info._id
            }).remove().then((res) => {
              console.log("评论表删除成功！")
            })
            .catch(console.error)

          wx.showToast({
            title: '删除成功！',
          }).then((res) => {
            wx.switchTab({
              url: '../punchCard/punchCard',
            })
          })
        }
      }
    })
  },
  //处理评论点赞
  handleLike_comment: function (evt) {
    var currentID = evt.currentTarget.id
    var data = this.data.commentList[currentID]
    if (this.data.isLike_comment[currentID]) { //处理页面显示
      this.setData({
        ["commentList[" + currentID + "]." + "likeNum"]: data.likeNum - 1,
        ['isLike_comment[' + currentID + ']']: false
      })
      console.log("取消点赞成功！", data.praise)
      DB.collection("like") //在like表中删除数据
        .where({
          _openid: openid,
          liked_id: data._id
        })
        .remove({
          success: (res) => {
            console.log("删除like表数据类型成功！")
          },
          fail: (res) => {
            console.log("删除like表数据类型失败！")
          }
        })
    } else {
      this.setData({
        ["commentList[" + currentID + "]." + "likeNum"]: data.likeNum + 1,
        ['isLike_comment[' + currentID + ']']: true
      })
      console.log("点赞成功！", data.likeNum)
      DB.collection("like") //在like表中添加数据
        .add({
          data: {
            liked_id: data._id
          },
          success: (res) => {
            console.log("添加like表数据类型成功！")
          },
          fail: (res) => {
            console.log("添加like表数据类型失败！")
          }
        })
    }

    var like = this.data.isLike_comment[currentID]
    _comment.doc(data._id) //评论表中点赞数修改
      .update({
        data: {
          likeNum: _.inc(like ? 1 : -1)
        },
        success: (res) => {
          console.log("likeNum修改成功！")
        },
        fail: (res) => {
          console.log("likeNum修改失败！")
        }
      })
  },
  //点击评论图标跳转
  handleComment: function () {
    this.setData({
      isFocus: true
    })
  },
  //处理评论
  comment_input: function (evt) { //获取评论内容
    content = evt.detail.value
  },
  //提交评论
  commment_submit: function () {
    //获取当前时间戳
    var timestamp = Date.parse(new Date())
    timestamp = timestamp / 1000
    var Time = util.formatDate((timestamp * 1000)) //转换时间格式
    //整理评论信息
    var temp_comment = {
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl,
      commented_id: att_info._id,
      content: content,
      likeNum: 0,
      time: Time,
      gender:userInfo.gender,
      like_list:[]
    }
    att_info.comment_list.unshift(temp_comment)
    att_info.comment += 1
    console.log("att_info.comment_list.push(temp_comment)=",att_info.comment_list)
    
    //渲染页面
    this.setData({
      att_info:att_info
    })
    //修改数据库信息
    _att.doc(att_info._id).update({
      data:{
        comment:_.inc(1),
        comment_list:_.unshift(temp_comment)
      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    console.log("正在下拉刷新！")
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onLoad()
  },
  //处理分享
  handleShare: function () {
    //跳转到分享页面（携带数据）
    var data = {
      time:att_info.date,//时间
      topic:att_info.topic,//二级标签
      picture:att_info.pictures[0],//第一张图片路径
    }
    wx.navigateTo({
      url: '../share/share?data='+JSON.stringify(data),
    })
  },
  data: {
    show: false, //是否展示评论框
    attendance: [], //打卡信息表
    isLike: false, //打卡信息表是否被点赞
    isLike_comment: [], //评论列表是否被点赞
    commentList: [], //评论列表信息
    hasComment: "", //是否有评论
    avatarArr: [], //评论头像列表
    nickNameArr: [], //评论昵称列表
    userInfo: "", //当前用户信息
    cur_userInfo: "", //打卡条所属用户信息
    super_isShow: "", //是否显示关注按钮
    super_isDone: false, //是否已关注
    isFocus: false, //是否获得焦点

    att_info:"",//打卡信息
  },
  onLoad: async function (options) {
    //获取全局登录信息
    userInfo = app.globalData.userInfo
    this.setData({userInfo:userInfo})
    //获取传递来的打卡信息
    att_info = JSON.parse(options.att_info)
    console.log("att_info=",att_info)
    //渲染页面数据
    this.setData({
      att_info:att_info,
      super_isShow:!(userInfo._openid == att_info._openid)
    })
  },
  onUnload: function () {
    console.log("成功清除缓存！")
    wx.removeStorageSync('temp_att_id')
  },
  onReachBottom: function () {
  },
  onShareAppMessage: function () {
    const {
      info,
      code
    } = that.data;
    return {
      title: info.name,
      path: `/pages/share/index?code=${code}&uid=${wx.getStorageSync('uid')}`,
      imageUrl: info.thumbnail_url
    }
  },
  onShareTimeline: function () {
    const {
      info,
      code
    } = that.data;
    return {
      title: info.name,
      query: `code=${code}&uid=${wx.getStorageSync('uid')}`,
      imageUrl: info.thumbnail_url
    }
  }
})