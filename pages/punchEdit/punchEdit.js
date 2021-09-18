const util = require("../../common/util")
const {$Toast} = require('../../dist/base/index');
var topic = '' //主题
var picturesURL = [] //图片最终路径
var video = '' //音频
var content = '' //内容
var location = '' //地点
const DB = wx.cloud.database()
const _att = DB.collection("attendance") //打卡表
var _openid //
var Pcount //
var mainText//打卡主标签
Page({
  //读取正文内容
  _contentInput: function (evt) {
    content = evt.detail.value
  },
  //选择地点
  _chooseLocation: function () {
    wx.chooseLocation({
      success: res => {
        location = res.name, //赋值
          this.setData({
            location: location
          })
        console.log("成功获取地点信息!")
      },
      fail(res) {
        console.log("获取地点信息失败！")
      }
    })
  },
  //提交-在此处决定权限
  _handlerform: async function (evt) {

    //获取临时路径列表
    var fileList = this.data.fileList
    if (content.length === 0 && fileList.length === 0) {
      $Toast({
        content: '还未输入任何内容！',
        type: 'error'
      });
    } else //若符合要求
    {
      this.setData({
        isShow: true
      })
      var timestamp = Date.parse(new Date())
      var Time = util.formatDate((timestamp)) //转换时间格式
      var start = new Date().getTime(); //起始时间
      if (fileList.length != 0) {
        //上传图片至服务器
        var promiseArr = []
        for (var key in fileList) {
          promiseArr.push(new Promise((reslove, reject) => {
            wx.cloud.uploadFile({
              cloudPath: "user/" + timestamp + "-" + Math.floor(Math.random() * 1000) + ".png", // 上传至云端的路径
              filePath: fileList[key].url, // 小程序临时文件路径
              success: res => {
                // console.log("上传图片成功！",res.fileID)// 返回文件 ID
                wx.showLoading({ //显示加载提示框 不会自动关闭 只能wx.hideLoading关闭
                  title: "图片上传中", //提示框显示的提示信息
                  mask: true, //显示透明蒙层，防止触摸。为true提示的时候不可以对屏幕进行操作，不写或为false
                  success: function () {
                    wx.hideLoading() //让提示框隐藏、消失
                  }
                })
                picturesURL.push(res.fileID)
                console.log("上传成功！", picturesURL)
                reslove()
              },
              fail(res) {
                console.log("上传失败！", res)
                reject(res)
              }
            })
          }))
        }
        //图片上传成功
        await Promise.all(promiseArr)
      }
      //导入数据库
      _att.add({
        data: {
          date: Time,
          parseDate:timestamp,
          topic: topic,
          pictures: picturesURL,
          video: video,
          content: content,
          location: location,
          praise: 0,
          comment: 0,
          main:mainText
        },
        success(res) {
          console.log("数据库添加成功!", res)
          wx.switchTab({
            url: '../punchCard/punchCard',
          })
        },
        fail(res) {
          console.log("数据库添加失败!", res)
        }
      })
      this.setData({
        isShow: true
      })
      var end = new Date().getTime(); //接受时间
      console.log((end - start) + "ms")
    }
  },
  data: {
    pictures: [],
    hint: "",
    topic: "",
    year: "",
    month: "",
    location: "",
    imageURL: "cloud://wu-env-5gq7w4mm483966ef.7775-wu-env-5gq7w4mm483966ef-1306826028/images/",
    fileList: [],
    Pcount: "", //该主题下的总打卡次数
    isShow: false
  },
  onLoad: async function (options) {
    picturesURL = []
    console.log("onLoad", picturesURL)
    mainText = options.mainText
    console.log("main",mainText)
    //获取时间
    var date = new Date().toLocaleDateString().concat(new Date().toLocaleTimeString());
    //获取主题渲染导航栏
    topic = options.topic
    wx.setNavigationBarTitle({
      title: topic,
    })

    //获取openid
    _openid = await wx.cloud.callFunction({
      name: "getOpenID"
    })
    _openid = _openid.result.openid

    //获取该主题下的打卡次数
    Pcount = await _att.where({
      _openid: _openid,
      topic: topic
    }).count()
    Pcount = Pcount.total
    //渲染页面数据
    this.setData({
      Pcount: Pcount
    })
  },
  onShow:function() {
  },
  onChange(e) {
    const {
      file,
      fileList
    } = e.detail
    if (file.status === 'uploading') {
      this.setData({
        progress: 0,
      })
      wx.showLoading()
    } else if (file.status === 'done') {
      this.setData({
        imageUrl: file.url,
      })
    }

    // Controlled state should set fileList
    this.setData({
      fileList
    })
  },
  onSuccess(e) {
  },
  onFail(e) {
  },
  onComplete(e) {
    wx.hideLoading()
  },
  onProgress(e) {
    this.setData({
      progress: e.detail.file.progress,
    })
  },
  onPreview(e) {
    const {
      file,
      fileList
    } = e.detail
    wx.previewImage({
      current: file.url,
      urls: fileList.map((n) => n.url),
    })
  },
  onRemove(e) {
    const {
      file,
      fileList
    } = e.detail
    wx.showModal({
      content: '确定删除？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            fileList: fileList.filter((n) => n.uid !== file.uid),
          })
        }
      },
    })
  },
})