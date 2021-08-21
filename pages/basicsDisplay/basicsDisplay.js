const util = require('../../common/util.js')
var openid
const DB = wx.cloud.database()
const _user = DB.collection("user")
const _att = DB.collection("attendance")
var initpath //头像初始路径、用来判断是否修改了头像
Page({
  data: {
    userInfo: "",
    is_link: true,
    button_info: true
  },
  //处理头像
  changeImage: function () {
    wx.chooseImage({ //选择图片
        count: 1, //最多可以选择的图片张数
        sizeType: ['original', 'compressed'], //所选的图片的尺寸,原图/压缩图
        sourceType: ['album', 'camera'], //选择图片的来源,从相册选图  / 使用相机
      })
      .then((res) => {
        var temp = res.tempFilePaths
        this.setData({ //修改页面数据
          ["userInfo.avatarUrl"]: temp[0]
        })

      })
      .catch(console.error)
  },
  //处理表单
  handleChange: async function (event) {
    var val = event.detail.value
    console.log(val)
    val.gender = val.gender == "男" ? 1 : 0 //性别格式化
    console.log("修改之后", val)
    if (initpath != this.data.userInfo.avatarUrl || val.nickName != this.data.userInfo.nickName || val.gender != this.data.userInfo.gender || val.province != this.data.userInfo.province) //控制条件，若需修改表单这里也需要修改
    {
      if (val.nickName == "" || val.nickName == " " || val.nickName.length) {
        wx.showToast({
          title: '昵称不能为空！',
          icon: "error"
        })
      } else {
        // // console.log("修改",val)
        // if (initpath != this.data.userInfo.avatarUrl) {
        //   var timestamp = Date.parse(new Date()) //生成时间戳
        //   var fileID = initpath //图片上传后的id
        //   await wx.cloud.uploadFile({ //上传图片
        //       cloudPath: "user/" + timestamp + Math.floor(Math.random() * 1000) + ".png", // 上传至云端的路径
        //       filePath: this.data.userInfo.avatarUrl, // 小程序临时文件路径
        //     })
        //     .then((res) => {
        //       console.log("上传图片成功", res.fileID)
        //       fileID = res.fileID
        //     })
        //     .catch(console.error)
        // }
        // await _user.where({
        //     _openid: openid
        //   })
        //   .update({
        //     data: {
        //       avatarUrl: fileID,
        //       nickName: val.nickName,
        //       gender: val.gender,
        //       province: val.province
        //     }
        //   })
        //   .then((res) => {
        //     console.log("修改个人信息成功！")
        //     wx.showToast({
        //       title: '修改成功！',
        //     })
        //   })
      }
    } else {
      this.setData({
        is_link: !this.data.is_link,
        button_info: !this.data.button_info
      })
    }

  },
  onLoad: function (options) {


    // wx.cloud.callFunction({
    //   name: "getOpenID",
    // })
    // .then((res)=>{
    //   var openid = res.result.openid
    //   wx.cloud.database().collection("user").where({_openid:openid}).get()
    //   .then((res)=>{
    //     console.log("获取状态成功！",res.data.lenth)
    //     if(res.data.length){
    //       return true
    //     }else return false
    //   })
    // })


    wx.cloud.callFunction({ // 获取openID
        name: "getOpenID",
      })
      .then((res) => {
        console.log("获取OpenID成功！", res.result.openid)
        openid = res.result.openid

        _user.where({ //获取用户信息
            _openid: openid
          }).get()
          .then((res) => {
            console.log("获取用户信息成功！", res.data[0].nickName)
            initpath = res.data[0].avatarUrl
            this.setData({
              userInfo: res.data[0]
            })
          })
          .catch(console.error)
      })
      .catch(console.error)
  },
})