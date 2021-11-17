const util = require("../../common/util")

const DB = wx.cloud.database()
var _ = DB.command
const _att = DB.collection("attendance")
const _user = DB.collection("user")
const _comment = DB.collection("comment")
const _sup = DB.collection("supervise")
const _like = DB.collection("like")
var _openid //本用户openid
var app = getApp()

var Data = [] //当前打卡信息数组
var count //总打卡数量
var rest_count //数据库中剩余的打卡数量

var hasUserInfo//是否登录
var userInfo//登录信息

var sup_all = []//所有监督信息
Page({
  switchTo: function () {
    this.setData({
      isSwitch: !this.data.isSwitch
    })
    console.log(this.data.isSwitch)
    this.onReachBottom()
  },
  reloading:function (params) {
    this.onReachBottom()
  },
  switchTo1: function () {
    this.setData({
      is1: true,
      is2: false,
      is3: false,
      is4: false,
      is5: false
    })
    console.log(this.data.isSwitch)
  },
  switchTo2: function () {
    this.setData({
      is1: false,
      is2: true,
      is3: false,
      is4: false,
      is5: false
    })
    console.log(this.data.isSwitch)
  },
  switchTo3: function () {
    this.setData({
      is1: false,
      is2: false,
      is3: true,
      is4: false,
      is5: false
    })
    console.log(this.data.isSwitch)
  },
  switchTo4: function () {
    this.setData({
      is1: false,
      is2: false,
      is3: false,
      is4: true,
      is5: false
    })
    console.log(this.data.isSwitch)
  },
  switchTo5: function () {
    this.setData({
      is1: false,
      is2: false,
      is3: false,
      is4: false,
      is5: true
    })
    console.log(this.data.isSwitch)
  },
  handleNav: async function (evt) {
    var idx = evt.currentTarget.id
    var att_id = this.data.punchMessageArrays[idx]._id
      wx.navigateTo({
        url: '../details/details?att_info=' + JSON.stringify(this.data.punchMessageArrays[idx]),
      })
  },
  _handlerLike: async function (evt) {
    //获取点击的id
    var cur_id = evt.currentTarget.id
    var data = this.data.punchMessageArrays[cur_id]

    if (data.islike) { //取消点赞
      //渲染页面
      this.setData({
        ["punchMessageArrays[" + cur_id + "]" + ".praise"]: data.praise - 1,
        ['punchMessageArrays[' + cur_id + ']'+ ".islike"]: 0

      })
      console.log("取消点赞成功！")
      //数据库中点赞数-1
      await _att.doc(data._id).update({
        data:{
          like_list:_.pull(userInfo._openid),
          praise: _.inc(-1)
        }
      })
    } else {//点赞
      //渲染页面
      this.setData({
        ["punchMessageArrays[" + cur_id + "]" + ".praise"]: data.praise + 1,
        ['punchMessageArrays[' + cur_id + ']'+ ".islike"]: 1
      })
      console.log("点赞成功！", data.praise)
      //数据库点赞数+1
      await _att.doc(data._id).update({
        data:{
          like_list:_.push(userInfo._openid),
          praise: _.inc(1)
        }
      })
    }
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
  query_sup:function(supered_id) {
    for(var i = 0;i < sup_all.length;i++){
      if(sup_all[i].superedID == supered_id && sup_all[i]._openid == _openid){
        return 1;
      }
    }
    return 0;
  },
  data: {
    punchMessageArrays: [],
    datearrays: [], //时间数组
    avatarArr: [], //打卡条的头像列表
    nickNameArr: [], //打卡条的昵称列表
    nickNameCom: [], //评论的昵称列表
    commentList: [], //评论列表
    isShow: false, //是否展示加载动画
    isSwitch: false, 
    isSup: [], //监督状态
    hasUserInfo: false,
    is1: false,
    is2: false,
    is3: false,
    is4: false,
    is5: false,
    isAll: true,

    isLoadMore: '', //页底提示是否显示加载中
    isLoadMoreText: "", //页底提示的文字
  },
  onLoad: async function (options) {
    this.setData({is1:true})
    
    //计时
    var start = new Date().getTime();

    //获取openid
    userInfo = app.globalData.userInfo
    hasUserInfo = app.globalData.hasUserInfo
    _openid = userInfo._openid

    //获取总打卡数量
    count = _att.count()
    count = (await count).total
    rest_count = count

    //初次加载10条打卡信息
    if (rest_count < 10) {
      Data = await _att.limit(rest_count).get()
      rest_count = 0
    } else {
      Data = await _att.skip(rest_count - 10).limit(10).get()
      rest_count -= 10
    }
    Data = Data.data.reverse()
    console.log("Data",Data)

    var sup_count = await _sup.count()
    sup_count = sup_count.total

    for(var i = 0;i < sup_count;i+=20){
      var temp_sup = await _sup.skip(i).get()
      temp_sup = temp_sup.data
      sup_all = sup_all.concat(temp_sup)
    }

    console.log("sup_all=",sup_all)
    //查询点赞和监督
    for (var i = 0; i < Data.length; i++) {
      //点赞
      console.log("Data[i].like_list=",Data[i].like_list)
      console.log(Data[i]._id,Data[i].content)
      var temp_like = Data[i].like_list.indexOf(_openid)>-1?1:0
      console.log("temp=",temp_like)
      Data[i].islike = temp_like
      //监督
      Data[i].isSup = this.query_sup(Data[i]._openid)
    
      console.log("监督=",Data[i].isSup = this.query_sup(Data[i]._openid))
      
    }
    this.setData({//渲染页面
      punchMessageArrays: Data
    })
                 
    //结束加载提示
    this.setData({
      isShow: false
    })
    //结束时间
    var end = new Date().getTime();
    console.log((end - start) + "ms")
    
    
  },
  onShow: function () {
    this.onLoad()
  },
  onReady: function () {
    // console.log("onready")
  },
  onHide: function () {
    // console.log("onHide")
  },
  onUnload: function () {},
  onPullDownRefresh: function () {
    
  },
  onReachBottom: async function () {
    //开始加载
    console.log("res=",rest_count)
    if (rest_count == 0) { //判断是否还有库存
      this.setData({
        isLoadMoreText: "已经没有库存了...",
        isLoadMore: false
      })
    } else {
      this.setData({
        isLoadMore: true,
        isLoadMoreText: "正在全力加载中..."
      })
      //继续加载
      if (rest_count < 10) {//判断剩余库存量
        var add_Data = await _att.limit(rest_count).get()
        rest_count = 0
      } else {
        var add_Data = await _att.skip(rest_count - 10).limit(10).get()
        rest_count -= 10
      }
      add_Data = add_Data.data.reverse()
      console.log("add=",add_Data)
      //记录下之前的Data长度
      var init_count = Data.length
      Data = Data.concat(add_Data)
      //查询点赞
      for (var i = init_count; i < Data.length; i++) {
        var temp_like = Data[i].like_list.indexOf(_openid)>-1?1:0
        console.log("temp=",temp_like)
        Data[i].islike = temp_like
        //监督
        Data[i].isSup = this.query_sup(Data[i]._openid)
    
        console.log("监督duduudududdududududdududddddd=",Data[i].isSup = this.query_sup(Data[i]._openid))
      }
      this.setData({
        punchMessageArrays: Data,//渲染页面
        isLoadMore: false//结束加载
      })
    }
  },
})