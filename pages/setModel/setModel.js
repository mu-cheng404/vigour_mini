const util = require("../../common/util")
const {
  $Toast
} = require('../../dist/base/index');
// var topic = '' //主题
var picturesURL = [] //图片最终路径
// var video = '' //音频
// var content = '' //内容
// var fushu_content = ''//附属内容
// var fushu_title=''//附属标题
// var location = '' //地点
const DB = wx.cloud.database()
const _user = DB.collection("user") //打卡表
const _template = DB.collection("template") //模板表

const _att = DB.collection("attendance") //打卡表
const app = getApp()

var data
var mainIndex, secondIndex
var userInfo //用户信息

var templateID //模板ID
var page //从哪个页面跳转过来
Page({
  //读取正文内容
  _contentInput: function (evt) {
    data.content = evt.detail.value
  },
  //读取附属内容
  _inputFushu: function (evt) {
    data.fushu_content = evt.detail.value
  },
  //选择地点
  _chooseLocation: function () {
    wx.chooseLocation({
      success: res => {
        data.location = res.name, //赋值
          this.setData({
            data: data
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
    if (data.content.length === 0 && fileList.length === 0) {
      $Toast({
        ['data.content']: '还未输入任何内容！',
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
      data.picture = data.picture.contact(picturesURL); //更新data

      console.log("data终极版本：", data)
      //上传模板到数据库
      if (templateID) {
        await _template.doc(templateID).update({
          data: {
            content: data.content,
            fushu_title: data.fushu_title,
            fushu_content: data.fushu_content,
            picture: data.picture,
            location: data.location,
            topic: data.topic,
            main: data.main
          }
        })
      } else {
        var add_template = await _template.add({
          data: {
            content: data.content,
            fushu_title: data.fushu_title,
            fushu_content: data.fushu_content,
            picture: data.picture,
            location: data.location,
            topic: data.topic,
            main: data.main
          }
        })
        templateID = add_template._id
        console.log("add_template=", add_template)
      }

      //携带模板ID返回
      if (page == "plan") {
        wx.navigateTo({
          url: '../plan/plan?templateID='+templateID,
        })
      }
      if(page == "editPlan"){
        wx.navigateTo({
          url: '../editPlan/editPlan?templateID='+templateID,
        })
      }
      //更新用户表中对应的模板id
      /*
      var temp_label = await _user.doc(userInfo._id).get()
      temp_label = temp_label.data.label

      var i_index;
      var j_index;
      for (var i = 0; i < 4; i++) { //找到main下标
        if (temp_label[i].main = data.main) {
          i_index = i;
          break;
        }
      }
      j_index = temp_label[i_index].second.indexOf(data.topic) //找到topic下标
      console.log(i_index, j_index)
      temp_label[i_index].templateID[j_index] = add_template._id //添加temp_label中对应的模板ID
      console.log("1")
      await _user.doc(userInfo._id).update({ //更新user表
        data: {
          label: temp_label
        }
      })
      console.log("2")
      userInfo.label = temp_label //修改全局变量
      this.setData({
        isShow: false
      })
      // 跳转到plan页面
      */
      
    }
  },
  data: {
    data: "", //模型数据
    isShow: false,
    fileList: ""
  },
  onLoad: async function (options) {
    //获取跳转数据
    templateID = options.templateID
    mainIndex = options.i
    secondIndex = options.j
    page = options.page
    // 从template表中获取
    if (templateID) {
      data = await _template.doc(templateID).get()
      data = data.data
    } else {
      data = {
        fushu_title: "计划", //附属标题
        fushu_content: convert_label[id].plan, //附属内容
        content: "", //正文
        picture: [], //图片路径
        location: "", //地点
        topic: convert_label[id].second, //二级标题
        main: convert_label[id].main, //主标签
      }
    }

    console.log("data=", data)

    //获取主题渲染导航栏和附属标题
    this.setData({
      data: data
    })
    wx.setNavigationBarTitle({
      title: data.topic,
    })

    //全局获取用户信息
    userInfo = app.globalData.userInfo
    console.log("userInfo=", userInfo)
  },
  onShow: function () {
    this.onLoad()
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
  onSuccess(e) {},
  onFail(e) {},
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