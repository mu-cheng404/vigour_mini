const util = require("../../common/util")
var isLogIn
const DB = wx.cloud.database()
const _att = DB.collection("attendance")
const _user = DB.collection("user")
const _comment = DB.collection("comment")
Page({
  handleNav: async function (evt) {
    var idx = evt.currentTarget.id
    var att_id = this.data.punchMessageArrays[idx]._id
    if (!isLogIn) {
      const v2 = await util.getUserInfo()
      this.onLoad()
    } else {
      wx.navigateTo({
        url: '../details/details?att_id=' + att_id,
      })
    }

  },
  _handlerLike: function (evt) {
    console.log(evt);
    let id = evt.target.id;
    console.log(id);
    this.setData({
      ['punchMessageArrays[' + id + '].isLike']: !this.data.punchMessageArrays[id].isLike,
    })
  },
  _handlerPunch: async function () {

    wx.switchTab({
      url: '../punchCard/punchCard',
    })

  },
  data: {
    punchMessageArrays: [],
    datearrays: [], //时间数组
    avatarArr: [], //打卡条的头像列表
    nickNameArr: [], //打卡条的昵称列表
    nickNameCom: [], //评论的昵称列表
    commentList: []
  },
  onLoad: async function (options) {
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
        console.log(commentList[i][j]._openid)
        await _user.where({
          _openid: commentList[i][j]._openid
        }).get().then((res) => {
          console.log(res.data[0]._openid)
          this.setData({
            ['nickNameCom[' + i + '][' + j + ']']: res.data[0].nickName
          })
        })
      }
  },
  onShow: function () {
    this.onLoad()
  },
})