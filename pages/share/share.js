var canvas
var data = {
  time: '2021-09-26 23:58:10',
  topic: '背单词',
  picture: 'cloud://wu-env-5gq7w4mm483966ef.7775-wu-env-5gq7w4mm483966ef-1306826028/user/1632671447000-871.png'
}
Page({
  //保存到相册
  canvasToTempFilePath: function () {

    var width = this.data.canvas_width
    var height = this.data.canvas_height

    console.log("3")
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: width,
      height: height,
      destWidth: width,
      destHeight: height,
      canvas: canvas,
      success(res) {
        console.log("路径是=", res.tempFilePath)
        wx.saveImageToPhotosAlbum({ //保存图片到相册
          filePath: res.tempFilePath,
          success: function () {
            wx.showToast({
              title: "生成图片成功！",
              duration: 2000
            })
          },
          fail: function (err) {
            console.log("添加失败", err)
            if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
              wx.showModal({
                title: '提示',
                content: '需要您授权保存相册',
                showCancel: false,
                success: modalSuccess => {
                  wx.openSetting({
                    success(settingdata) {
                      if (settingdata.authSetting['scope.writePhotosAlbum']) {
                        console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                        wx.saveImageToPhotosAlbum({ //保存图片到相册
                          filePath: res.tempFilePath,
                          success: function () {
                            wx.showToast({
                              title: "生成图片成功！",
                              duration: 2000
                            })
                          }
                        })
                      } else {
                        console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                      }
                    }
                  })
                }
              })
            }
          }
        })
      }
    })
  },
  //对画布进行操作
  changeCanvas: async function (ctx) {

    var width = this.data.canvas_width
    var height = this.data.canvas_height

    // 图片转为临时路径
    var promise1 = await new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: data.picture,
        success: (res) => {
          var imageWid = res.width
          var imageHei = res.height

          var image1 = canvas.createImage()
          image1.src = res.path
          console.log("image1=", image1)
          image1.onload = function () {
            var va = width / height
            var suofang = 0.5
            ctx.drawImage(image1, width * (1 - suofang) / 2, height * 0.25, width * suofang, imageHei * va * suofang)
          }
          resolve()
        },
        fail: (res) => {
          console.log(res)
        }
      })
    })
    var promise2 = await new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: 'cloud://wu-env-5gq7w4mm483966ef.7775-wu-env-5gq7w4mm483966ef-1306826028/important/体验版二维码.png',
        success: (res) => {
          var image1 = canvas.createImage()
          image1.src = res.path

          image1.onload = function () {
            ctx.drawImage(image1, 20, height - 120, 100, 100)
          }
          resolve()
        },
        fail: (res) => {
          console.log(res)
        }
      })
    })
    await Promise.all([promise1, promise2])
    //设置时间
    ctx.fillStyle = "black"
    ctx.font = "20px Arial"
    ctx.fillText(data.time, 20, 20)
    ctx.font = "25px Arial"
    ctx.fillText('我在' + data.topic + '标签下打卡！', 20, 70)
    ctx.fillText('扫码加入~', 120, height - 60)

  },
  data: {
    canvas_width: '', //画板宽度
    canvas_height: '', //画板高度

  },
  onLoad: function (options) {
    data = JSON.parse(options.data)
    console.log("data=",data)
    //获取系统最大屏幕高宽
    wx.getSystemInfo({
      success: (result) => {
        console.log("system=", result)
        this.setData({
          canvas_width: result.screenWidth * 0.8,
          canvas_height: result.screenHeight * 0.8,
        })
      },
    })
    //获取canvas实例
    wx.createSelectorQuery()
      .select('#canvas')
      .fields({
        node: true,
        size: true,
      })
      .exec(res => { //获取完成
        console.log("修改之前=", res[0])

        canvas = res[0].node

        var ctx = canvas.getContext('2d')

        //调整画布大小
        const dpr = wx.getSystemInfoSync().pixelRatio //像素比，一个像素的宽度与高度之比
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)

        ctx.fillStyle = "#fff"
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        console.log(canvas)
        console.log("修改之后=", res[0])
        // 设置 canvas 坐标原点
        // ctx.translate(width / 2, height * 2 / 3);
        this.changeCanvas(ctx)
        
      })
  },
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