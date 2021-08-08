var date = '' //日期和时间
var topic = '' //主题
var pictures = [] //图片临时路径
var picturesURL = [] //图片最终路径
var video = '' //音频
var content = '' //内容
var location = '' //地点
var praise = 0 //点赞数
const DB = wx.cloud.database().collection("attendance")
Page({
  //读取正文内容
  _contentInput: function (evt) {

    console.log(evt.detail.value)
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
        console.log("get location successfully!", res.name)
        console.log
      },
      fail(res) {
        console.log("get location unsuccessfully!", res)
      }
    })
  },
  //选择图像
  _selectImage: function () {
    //判断已选图片是否超过三张
    if (pictures.length == 3) {
      wx.showToast({
        title: '三张已经够啦！',
        icon: 'error',
        duration: 2000
      })

    } else {
      wx.chooseImage({
        count: 3, //最多可以选择的图片张数
        sizeType: ['original', 'compressed'], //所选的图片的尺寸,原图/压缩图
        sourceType: ['album', 'camera'], //选择图片的来源,从相册选图	/	使用相机
        success: res => { // tempFilePath可以作为img标签的src属性显示图片
          pictures = res.tempFilePaths //赋值
          this.setData({
            pictures: pictures
          })
          console.log("选择图片成功!", pictures)
        },
        fail(res) {
          console.log("选择图片失败!", res)
        }
      })
    }
  },
  //对图片进行操作
  preivewImage: function (evt) {
    console.log(evt.currentTarget.id)
    var id = evt.currentTarget.id
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
  //删除选定图像
  deleteImage: function (evt) {
    var id = evt.currentTarget.id
    pictures.splice(id, 1)
    this.setData({
      pictures: pictures
    })
    console.log("删除成功！")
  },
  //获取录音
  _selectVideo: function () {

  },
  //提交-在此处决定权限
  _handlerform: function (evt) {

    if (content.length < 20) {
      this.setData({
        hint: '字数需超过20字！'
      })
    } else //若符合要求
    {
      //检查数据
      console.log(date)
      console.log(topic)
      console.log("图片最终路径：", picturesURL)
      console.log(video)
      console.log(content)
      console.log(location)
      console.log(praise)


      // //获取OpenID
      // var id
      // wx.cloud.callFunction({
      //   name:"getOpenID",
      //   success(res){
      //     console.log("成功获取OpenID",res)
      //     id = res.result.openid
      //   },
      //   fail(res){
      //     console.log("获取openID失败",res)
      //   }
      // })


      //上传图片至服务器
      var promiseArr = []
      var timestamp = Date.parse(new Date()) //生成时间戳
      for (var key in pictures) {
        promiseArr.push(new Promise((reslove, reject) => {
        
          wx.cloud.uploadFile({
            cloudPath: "user/" + timestamp + "-" + Math.floor(Math.random() * 1000) + ".png", // 上传至云端的路径
            filePath: pictures[key], // 小程序临时文件路径
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

      Promise.all(promiseArr).then((values) => { //图片上传成功
        //导入数据库
        DB.add({
          data: {
            date: date,
            topic: topic,
            pictures: picturesURL,
            video: video,
            content: content,
            location: location,
            praise: praise
          },
          success(res) {
            console.log("数据库添加成功!", res)
          },
          fail(res) {
            console.log("数据库添加失败!", res)
          }
        })
      }).catch(err => {
        console.log("上传错误！", err)
      })


    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    pictures: [],
    hint: "",
    type: "学习",
    year: "",
    month: "",
    location: "",
    imageURL: "cloud://wu-env-5gq7w4mm483966ef.7775-wu-env-5gq7w4mm483966ef-1306826028/images/"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取时间
    date = new Date();
    var Y = date.getFullYear(); //年
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1); //月
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); //日
    //时
    // var h = date.getHours();
    // //分
    // var m = date.getMinutes();
    // //秒
    // var s = date.getSeconds();
    this.setData({
      'year': Y,
      'month': M + '.' + D,
      type: options.type
    })
    //赋值类型
    topic = options.type
    console.log(options.type)

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})