const util = require("../../common/util")
var isLogIn
const DB = wx.cloud.database()
var _ = DB.command
const _att = DB.collection("attendance")
const _user = DB.collection("user")
const _comment = DB.collection("comment")
const _sup = DB.collection("supervise")
var _openid //本用户openid
Page({
  switchTo: function () {
    this.setData({
      isSwitch: !this.data.isSwitch
    })
    console.log(this.data.isSwitch)
  },
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
  recommendNav: function () {
    wx.showModal({
        cancelColor: 'cancelColor',
        content: "这个功能可能要加载十几秒哦，确定跳转吗？",
        cancelText: "算了吧",
        confirmText: "是的确定"
      })
      .then((res) => {
        if (!res.cancel) {
          wx.navigateTo({
            url: '../recommend/recommend',
          })
        }
      }).catch(console.error)
  },
  data: {
    punchMessageArrays: [],
    datearrays: [], //时间数组
    avatarArr: [], //打卡条的头像列表
    nickNameArr: [], //打卡条的昵称列表
    nickNameCom: [], //评论的昵称列表
    commentList: [], //评论列表
    isLike_comment: [], //打卡条点赞初态
    isShow: false, //是否展示加载动画
    isSwitch: false, //是否展示监督
    isSup :[],//监督状态
  },
  onLoad: async function (options) {

    //显示加载动画
    this.setData({
      isShow: true
    })
    //计时
    var start = new Date().getTime();

    //获取openid
    await wx.cloud.callFunction({
      name: "getOpenID",
      success(res) {
        _openid = res.result.openid
      }
    })

    //检查是否已登录
    isLogIn = util.queryLogIn()
    console.log(isLogIn)

    //获取总打卡数量
    var count = _att.count()
    count = (await count).total

    //查询所有打卡信息
    var Data = [] //存储查询结果(顺序)
    for (var i = 0; i < count; i += 20) {
      let list = await _att.skip(i).get()
      Data = Data.concat(list.data)
    }
    var VData = [].concat(Data).reverse() //存储查询结果(逆序)
    console.log("获取所有用户打卡数据成功", Data)

    //修改页面数据
    this.setData({
      punchMessageArrays: Data.reverse()
    })

    //获取所有头像和昵称
    wx.cloud.callFunction({
        name: "queryName_avatar",
        data: {
          dataArr: VData
        }
      }).then((res) => {
        console.log("获取昵称和头像成功！")
        this.setData({
          avatarArr: res.result.avatarArr,
          nickNameArr: res.result.nickNameArr
        })
        console.log(this.data.nickNameArr)
      })
      .catch(console.error)

    //查询页面初始点赞状态：用云函数突破20条限制
    wx.cloud.callFunction({
      name: "queryCommentLikeState",
      data: {
        comData: VData, //被点赞的对象ID（数组）
        cur_openid: _openid, //点赞人ID 
        length: Data.length //数组长度
      },
      success: (res) => {
        console.log("查询点赞初始状态成功")
        this.setData({
          isLike_comment: res.result
        })
      },
      fail: (res) => {
        console.log("这个云函数调用失败", res)
      }
    })
    //结束加载提示
    this.setData({
      isShow: false
    })
    // //查询监督状态 wxml第七行
    // for (var i = 0; i < Data.length; i++) {
    //   var Scount = await _sup.where({
    //     _openid: _openid,
    //     superedID: Data[i]._openid
    //   }).count()
    //   Scount = Scount.total
    //   Data[i].isSupervise = Scount
    // }
    // console.log(Data)

    //查询监督状态 wxml第七行
    var promiseArr =[]
    var isSup = []
    var index = 0
    for(var i = 0;i < Data.length;i++){
      promiseArr.push(new Promise(async (resolve,reject)=>{
        var Scount = await _sup.where({
          _openid: _openid,
          superedID: Data[i]._openid
        }).count()
        Scount = Scount.total
        isSup[index] = Scount
        index++
        resolve()
      }))
    }
    await Promise.all(promiseArr).then((res)=>{console.log("isSup",isSup)}).catch(console.error)
    //渲染数据
    this.setData({isSup:isSup})
    //结束时间
    var end = new Date().getTime(); 
    console.log((end - start) + "ms")

  },
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        isShow_playing: true,
        isShow_index: false,
        isShow_me: false
      })
    }
  },
  onReady: function () {
    // console.log("onready")
  },
  onHide: function () {
    // console.log("onHide")
  },
  onUnload: function () {},
  onPullDownRefresh: function () {
    this.onLoad()
  },
  onReachBottom: async function () {},
})