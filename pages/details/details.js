import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const util = require('../../common/util.js')
const DB = wx.cloud.database()
const _ = DB.command
const _att = DB.collection("attendance")
const _like = DB.collection("like")
const _comment = DB.collection("comment")
var comment = {
  avatarUrl: "",
  commented_id: "",
  content: "",
  likeNum: "",
  nickName: "",
  time: "",
}
var att_id = "" //打卡条id
var cur_openid //现在打卡条所属的openid
var openid //当前用户的openid
// pages/details/details.js
Page({
  //处理弹出框
  showPopup() {
    console.log("click成功！")
    this.setData({
      show: true
    });
  },
  onClose() {
    console.log("关闭成功！")

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
      console.log("取消点赞成功！", data.praise)
      DB.collection("like") //在like表中删除数据
        .where({
          _openid: openid,
          liked_id: att_id
        })
        .remove({
          success: (res) => {
            console.log("删除like表数据成功！", res)
          },
          fail: (res) => {
            console.log("删除like表数据失败！", res)
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
            console.log("添加like表数据类型成功！", res)
          },
          fail: (res) => {
            console.log("添加like表数据类型失败！", res)
          }
        })
    }

    var like = this.data.isLike
    DB.collection("attendance") //打卡信息表中点赞数修改
      .where({
        _openid: cur_openid
      })
      .update({
        data: {
          praise: _.inc(like ? 1 : -1)
        },
        success: (res) => {
          console.log("praise修改成功！", res)
        },
        fail: (res) => {
          console.log("praise修改失败！", res)

        }
      })

  },
  //处理评论点赞
  handleLike_comment: function (evt) {
    var currentID = evt.currentTarget.id
    console.log("正在给第" + currentID + "个评论点赞")
    var data = this.data.commentList[currentID]
    if (this.data.isLike_comment[currentID]) { //处理页面显示
      this.setData({
        ["commentList[" + currentID + "]." + "likeNum"]: data.likeNum - 1,
        ['isLike_comment[' + currentID + ']']: false
      })
      console.log("取消评论点赞成功！", data.praise)
      DB.collection("like") //在like表中删除数据
        .where({
          _openid: openid,
          liked_id: data._id
        })
        .remove({
          success: (res) => {
            console.log("删除like表数据类型成功！", res)
          },
          fail: (res) => {
            console.log("删除like表数据类型失败！", res)
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
            console.log("添加like表数据类型成功！", res)
          },
          fail: (res) => {
            console.log("添加like表数据类型失败！", res)
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
          console.log("likeNum修改成功！", res)
        },
        fail: (res) => {
          console.log("likeNum修改失败！", res)

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
    let value = evt.detail.value
    console.log(evt.detail.value)
    comment.content = value
  },
  commment_submit: function () { //提交
    //获取当前时间戳
    var timestamp = Date.parse(new Date())
    timestamp = timestamp / 1000
    var Time = util.formatDate((timestamp * 1000)) //转换时间格式
    var user = wx.getStorageSync("userBaseInfo")
    var att = this.data.attendance
    comment.avatarUrl = user.avatarUrl
    comment.commented_id = att._id
    comment.likeNum = 0
    comment.nickName = user.nickName
    comment.time = Time
    console.log("现在comment=", comment)

    _comment //添加评论信息到数据库
      .add({
        data: {
          avatarUrl: comment.avatarUrl,
          commented_id: comment.commented_id,
          content: comment.content,
          likeNum: comment.likeNum,
          nickName: comment.nickName,
          time: comment.time
        },
      })
      .then((res) => {
        console.log("添加评论信息成功！", res)
        Dialog.alert({ //评论成功弹窗
          message: '评论成功！',
          "confirm-button-color": "#04BE02"
        }).then(() => {
          // on close
        });
        this.setData({
          show: false,
          ['attendance' + '.' + 'comment']: this.data.attendance.comment + 1
        })
        _att.doc(id)
          .update({
            data: {
              comment: DB.command.inc(1)
            }
          })
          .then(console.log)
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
    // setTimeout(() => {
    //   _comment //通过被评论的id寻找
    //     .where({
    //       commented_id: att_id
    //     })
    //     .get()
    //     .then((res) => {
    //       console.log(res)
    //       this.setData({
    //         commentList: res.data
    //       })
    //       console.log("云端更新数据成功", this.data.commentList)
    //       wx.hideNavigationBarLoading() //完成停止加载
    //       wx.stopPullDownRefresh() //停止下拉刷新
    //     })
    //     .catch((error) => {
    //       console.log("云端更新数据失败", error)
    //     })

    // }, 2000)
    this.onLoad()
  },
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    attendance: [],
    isLike: false,
    isLike_comment: [],
    commentList: []
  },
  onLoad: function (options) {
    //获得跳转而来的打卡条id
    if (wx.getStorageSync('temp_att_id')) {
      att_id = wx.getStorageSync('temp_att_id')
    } else {
      att_id = options.att_id 
      wx.setStorageSync('temp_att_id', options.att_id)
    }

    //获取用户打卡信息
    _att.doc(att_id)
      .get(
        //   {
        //   success:(res)=>{
        //     console.log(res)
        //   },
        //   fail:(res)=>{
        //     console.log(res)
        //   }
        // }
      )
      .then((res) => {
        console.log("云端获取该用户打卡信息成功！", res.data)
        cur_openid = res.data._openid //获取本打卡条主人的openid
        this.setData({
          attendance: res.data,
        })
        _comment
          .where({
            commented_id: att_id
          })
          .get()
          .then((res) => {
            console.log(res)
            this.setData({
              commentList: res.data
            })
            for (var i = 0; i < res.data.length; i++) {
              var commentLike
              var commentID = res.data[i]._id
              _like
                .where({
                  liked_id: commentID,
                  _openid: cur_openid
                })
                .get()
                .then((res) => {
                  console.log("查询成功！", i)
                  commentLike = res ? true : false
                  console.log("第" + i + "个评论", commentLike)
                  this.setData({
                    ['isLike_comment[' + i + ']']: commentLike //////////////////////////////////////////
                  })
                })
                .catch(console.log(err))
              console.log(i)
            }
            console.log("云端获取评论信息成功", this.data.commentList)

            wx.cloud.callFunction({
                name: "getOpenID"
              })
              .then((res) => {
                console.log("成功执行openid云函数获取openid", res.result.openid)
                openid = res.result.openid
              })


          })
          .catch((error) => {
            console.log("云端获取评论信息失败", error)
          })

      })
      .catch((res) => {
        console.log("云端获取该用户打卡信息失败！", res)
      })


  },
  onReady: function () {},
  onShow: function () {

  },
  onHide: function () {
  },
  onUnload: function () {
    console.log("成功清除缓存！")
    wx.removeStorageSync('temp_att_id')
  },
  onReachBottom: function () {
    console.log("正在上拉刷新！")
    wx.showNavigationBarLoading() //在标题栏中显示加载

    // setTimeout(() => {
    //   _comment
    //     .where({
    //       commented_id: att_id
    //     })
    //     .get()
    //     .then((res) => {
    //       console.log(res)
    //       this.setData({
    //         commentList: res.data
    //       })
    //       console.log("云端更新数据成功", this.data.commentList)
    //       wx.hideNavigationBarLoading() //完成停止加载
    //       wx.stopPullDownRefresh() //停止下拉刷新
    //     })
    //     .catch((error) => {
    //       console.log("云端更新数据失败", error)
    //     })

    // }, 2000)
    this.onLoad()
  },
  onShareAppMessage: function () {

  }
})