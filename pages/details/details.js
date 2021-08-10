const DB = wx.cloud.database()
const _ = DB.command
const _att = DB.collection("attendance")
const _like = DB.collection("like")
var id = ""
// pages/details/details.js
Page({
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
  //处理点赞
  handleLike: function () {
    var data = this.data.attendance
    if (this.data.isLike) { //处理页面显示
      this.setData({
        ["attendance" + "." + "praise"]: data.praise - 1,
        isLike: false
      })
      console.log("取消点赞成功！", data.praise)
      DB.collection("like")//在like表中添加数据
      .where({
        liked_id: "1234"
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
        ["attendance" + "." + "praise"]: data.praise + 1,
        isLike: true
      })
      console.log("点赞成功！", data.praise)
      DB.collection("like")//在like表中添加数据
      .add({
        data: {
          like_openID: "1231",
          liked_id: "1231"
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
        _openid: "ohRLL5KG6AXpEKs-ptzsPSOBGpF4"
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
  /**
   * 页面的初始数据
   */
  data: {
    attendance: [],
    isLike: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // _id = options.id
    id = "8937eaa9610d11a902d4ce562d6ba8f1"

    //获取用户打卡信息
    _att.where({
        _id: id
      })
      .get({
        success: (res) => {
          console.log("云端获取该用户打卡信息成功！", res.data[0])
          var date = res.data[0].date.toLocaleDateString()
          var time = res.data[0].date.toLocaleTimeString()
          this.setData({
            attendance: res.data[0],
            ["attendance" + "." + "date"]: date + time
          })


        },
        fail(error) {
          console.log("云端获取该用户打卡信息失败！", error)
        }
      })


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