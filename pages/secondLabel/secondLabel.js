const DB = wx.cloud.database()
const _user = DB.collection("user")
const _ = DB.command
var main //主标签
var mainText //主标签文字
var add_label //新增标签
var doc //个人信息ID
var S_label //二级标签
var fushu_title = []//附属标题
var _openid //openid
Page({
  //处理删除
  handerDelete: function (evt) {
    var id = evt.currentTarget.id
    S_label.splice(id, 1)
    _user.where({
        _id: doc,
        'label.main': mainText
      }).update({
        data: {
          'label.$.second': S_label
        }
      })
      .then((res) => {
        console.log("删除成功！", res)
        this.setData({
          S_label: S_label
        })
      })
  },
  //处理开始点击
  _handleTouchStart: function (evt) {
    console.log(evt.timeStamp)
    this.setData({
      start_time: evt.timeStamp
    })
  },
  //处理结束点击
  _handleTouchEnd: function (evt) {
    this.setData({
      end_time: evt.timeStamp
    })
  },
  //处理点击跳转
  _handleDetail: function (evt) {
    var id = evt.currentTarget.id
    var touchTime = this.data.end_time - this.data.start_time
    if (touchTime < 400) {
      if (this.data.isDelete) {
        this.setData({
          isDelete: false
        })
      } else {
        wx.navigateTo({ 
          url: '../punchEdit/punchEdit?topic=' + S_label[id]+'&mainText='+mainText+'&fushu_title='+fushu_title[id],
        })
      }
    } else {
      this.setData({
        isDelete: true
      })
    }
  },
  //处理自定义标签
  _handleAdd: function (evt) {
    wx.navigateTo({
      url: '../addLabel/addLabel?doc=' + doc + '&mainText=' + mainText + '&main=' + main,
    })
  },
  data: {
    S_label: [], //二级标签列表
    isShow: true, //是否显示加载中
    isDelete: false, //是否显示删除按钮
    start_time: 0, //触摸开始时间
    end_time: 0, //触摸结束时间
  },
  onLoad: async function (options) {
    
    console.log("secondLabel的onLoad")
    //获取传递来的主标签
    main = options.main
    console.log("main", main)
    //云函数获取openid
    _openid = await wx.cloud.callFunction({
      name: "getOpenID"
    })
    _openid = _openid.result.openid
    //从数据库中请求二级标签列表
    var Data = await _user.where({
      _openid: _openid
    }).get()
    console.log(Data)
    S_label = Data.data[0].label[main].second
    fushu_title = Data.data[0].label[main].title
    console.log("fushu =",fushu_title)
    doc = Data.data[0]._id
    //设置导航栏文字
    mainText = Data.data[0].label[main].main
    wx.setNavigationBarTitle({
      title: mainText,
    })
    //渲染数据
    this.setData({
      S_label: S_label,
      isShow: false
    })
  },
})