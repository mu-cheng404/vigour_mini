const util = require("../../common/util")
var isLogIn
const DB = wx.cloud.database()
var _ = DB.command
const _att = DB.collection("attendance")
const _user = DB.collection("user")
const _comment = DB.collection("comment")
var _openid //本用户openid
Page({
  handleNav: async function (evt) {
    var idx = evt.currentTarget.id
    var att_id = this.data.punchMessageArrays[idx]._id
    if (!isLogIn) {
      const v2 = await util.getUserInfo()
      this.onLoad()
    } else {
      // console.log("跳转啦阿拉啦啦啦")
      wx.navigateTo({
        url: '../details/details?att_id=' + att_id,
      })
    }

  },
  _handlerLike: function (evt) {
    var cur_id = evt.currentTarget.id
    var data = this.data.punchMessageArrays[cur_id]
    if (this.data.isLike_comment[cur_id]) { //处理页面显示
      this.setData({
        ["punchMessageArrays[" + cur_id + "]" + ".praise"]: data.praise - 1,
        ['isLike_comment[' + cur_id + ']']: false
      })
      console.log("取消点赞成功！")
      DB.collection("like") //在like表中删除数据
        .where({
          _openid: _openid,
          liked_id: data._id
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
        ["punchMessageArrays[" + cur_id + "]" + ".praise"]: data.praise + 1,
        ['isLike_comment[' + cur_id + ']']: true
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

    var like = this.data.isLike_comment[cur_id]
    _att.doc(data._id).update({ //打卡信息表中点赞数修改
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
  _handlerPunch: async function () {
    var tempTopic
    _att.where({
      _openid: _openid
    }).get().then((res) => {
      var templength = res.data.length
      tempTopic = res.data[templength - 1].topic
      console.log(tempTopic)
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

    })

  },
  data: {
    punchMessageArrays: [],
    datearrays: [], //时间数组
    avatarArr: [], //打卡条的头像列表
    nickNameArr: [], //打卡条的昵称列表
    nickNameCom: [], //评论的昵称列表
    commentList: [], //评论列表
    isLike_comment: [], //打卡条点赞初态
    isload: false //页面是否已加载
  },
  onLoad: async function (options) {
    // console.log("onLoad")
    this.setData({
      isload: true
    })
    wx.showLoading({
      title: '加载中...',
      mask: true,
      success: async (res) => {
        isLogIn = await util.queryLogIn()
        console.log(isLogIn)
        await _att.get().then(res => {
          console.log("获取所有用户打卡数据成功", res)
          this.setData({
            punchMessageArrays: res.data.reverse()
          })
        })

        await wx.cloud.callFunction({
            name: "queryName_avatar",
            data: {
              dataArr: this.data.punchMessageArrays
            }
          }).then((res) => {
            console.log("获取昵称和头像成功！")
            this.setData({
              avatarArr: res.result.avatarArr,
              nickNameArr: res.result.nickNameArr
            })
          })
          .catch(console.error)
        await wx.cloud.callFunction({
          name: "getOpenID",
          success(res) {
            _openid = res.result.openid
          }
        })
        await wx.cloud.callFunction({ //查询页面初始点赞状态：用云函数突破20条限制
          name: "queryCommentLikeState",
          data: {
            comData: this.data.punchMessageArrays, //被点赞的对象ID（数组）
            cur_openid: _openid, //点赞人ID 
            length: this.data.punchMessageArrays.length //数组长度
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
        
        wx.hideLoading({
          success: async (res) => {
            var commentList = [] //评论数据
        var punchList = this.data.punchMessageArrays

        for (var i = 0; i < punchList.length; i++) {
          await _comment.where({
            commented_id: punchList[i]._id
          }).get().then((res) => {
            commentList.push(res.data)
          })
        }
        this.setData({
          commentList: commentList
        })
        console.log(commentList)
        for (var i = 0; i < commentList.length; i++)
          for (var j = 0; j < commentList[i].length; j++) {
            await _user.where({
              _openid: commentList[i][j]._openid
            }).get().then((res) => {
              this.setData({
                ['nickNameCom[' + i + '][' + j + ']']: res.data[0].nickName
              })
            })
          }
          },
        })
      }
    })
  },
  onShow: function () {
    // console.log("onShow")
    

  },
  onReady: function () {
    // console.log("onready")
  },
  onHide: function () {
    // console.log("onHide")

  },
  onUnload: function () {
    // console.log("onUnload")
    this.setData({
      isload: false
    })

  },
  onPullDownRefresh:function () {
    if (this.data.isload)
      this.onLoad()
  }
})