import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const util = require('../../common/util.js')
const DB = wx.cloud.database()
const _ = DB.command
const _att = DB.collection("attendance") //打卡表
const _like = DB.collection("like") //点赞表
const _comment = DB.collection("comment") //评论表
const _user = DB.collection("user") //用户表
var content //评论内容
var att_id = "" //打卡条id
var cur_openid //现在打卡条所属用户的openid
var openid //当前用户的openid
var user //用户信息
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
  //预览图片
  preivewImage: function (evt) {
    console.log(evt.currentTarget.id)
    var id = evt.currentTarget.id
    var pictures = this.data.attendance.pictures
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
  handleLike: function () {
    var data = this.data.attendance
    if (this.data.isLike) { //处理页面显示
      this.setData({
        ["attendance" + "." + "praise"]: data.praise - 1,
        isLike: false
      })
      console.log("取消点赞成功！")
      DB.collection("like") //在like表中删除数据
        .where({
          _openid: openid,
          liked_id: att_id
        })
        .remove({
          success: (res) => {
            console.log("删除like表数据成功！")
          },
          fail: (res) => {
            console.log("删除like表数据失败！")
          }
        })
    } else {
      this.setData({
        ["attendance" + "." + "praise"]: data.praise + 1,
        isLike: true
      })
      console.log("点赞成功！", data.praise)
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

    var like = this.data.isLike
    _att.doc(att_id).update({ //打卡信息表中点赞数修改
      data: {
        praise: _.inc(like ? 1 : -1)
      },
      success: (res) => {
        console.log("praise修改成功！", att_id)
      },
      fail: (res) => {
        console.log("praise修改失败！", res)
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
      show: true
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

    _comment //添加评论信息到数据库
      .add({
        data: {
          // avatarUrl: comment.avatarUrl,
          commented_id: att_id,
          content: content,
          likeNum: 0,
          // nickName: comment.nickName,
          time: Time
        },
      })
      .then((res) => {
        console.log("添加评论信息成功！", res)
        Dialog.alert({ //评论成功弹窗
          message: '评论成功！',
          "confirm-button-color": "#04BE02"
        }).then(() => {
          // on close
        }).catch(console.error)
        this.setData({
          show: false,
          ['attendance' + '.' + 'comment']: this.data.attendance.comment + 1
        })
        _att.doc(att_id)
          .update({
            data: {
              comment: _.inc(1)
            }
          })
          .then((res) => {
            console.log("该打卡条评论数量修改成功！")
          })
          .catch(console.error)
      })
      .catch((res) => {
        console.error
      })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    console.log("正在下拉刷新！")
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onLoad()
  },
  data: {
    show: false, //是否展示评论框
    attendance: [], //打卡信息表
    isLike: false, //打卡信息表是否被点赞
    isLike_comment: [], //评论列表是否被点赞
    commentList: [], //评论列表信息
    avatarArr: [], //评论头像列表
    nickNameArr: [], //评论昵称列表
    userInfo: "" //当前用户信息
  },
  onLoad: function (options) {
    wx.cloud.callFunction({ //获取本用户openid
        name: "getOpenID"
      })
      .then((res) => {
        openid = res.result.openid
        //获取用户信息
        _user.where({
          _openid: openid
        }).get().then((res) => {
          this.setData({
            userInfo: res.data[0]
          })
        })
      })

    //获得跳转而来的打卡条id
    if (wx.getStorageSync('temp_att_id')) {
      att_id = wx.getStorageSync('temp_att_id')
    } else {
      att_id = options.att_id
      wx.setStorageSync('temp_att_id', options.att_id)
    }

    //获取用户打卡信息
    _att.doc(att_id)
      .get()
      .then(async (res) => {
        console.log("云端获取该用户打卡信息成功！", res.data)
        cur_openid = res.data._openid //获取本打卡条主人的openid
        this.setData({
          attendance: res.data,
        })

        await _like
          .where({
            _openid: openid,
            liked_id: att_id
          }).get()
          .then((res) => {
            console.log("成功查询点赞信息", res.data.length)
            this.setData({
              isLike: res.data.length ? true : false
            })
          })
          .catch(console.error)
        //获取该打卡条所有评论信息
        _comment.where({
            commented_id: att_id
          }).get()
          .then(async (res) => {

            this.setData({//评论基本信息
              commentList: res.data.reverse()
            })

            await wx.cloud.callFunction({ //获取所有评论的头像和昵称集合
                name: "queryName_avatar",
                data: {
                  dataArr: res.data
                }
              })
              .then((res) => {
                console.log("获取评论的昵称和头像成功！")
                this.setData({
                  avatarArr: res.result.avatarArr,
                  nickNameArr: res.result.nickNameArr
                })
              })
              .catch(console.error)

            await wx.cloud.callFunction({ //查询页面初始点赞状态：用云函数突破20条限制
              name: "queryCommentLikeState",
              data: {
                comData: res.data,
                cur_openid: openid,
                length: res.data.length
              },
              success: (res) => {
                this.setData({
                  isLike_comment: res.result
                })
              },
              fail: (res) => {
                console.log("这个云函数调用失败", res)
              }
            })
          })
          .catch(console.error)
      })
      .catch((res) => {
        console.log("云端获取该用户打卡信息失败！", res)
      })
  },
  onUnload: function () {
    console.log("成功清除缓存！")
    wx.removeStorageSync('temp_att_id')
  },
  onReachBottom: function () {
    console.log("正在上拉刷新！")
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onLoad()
  },
})