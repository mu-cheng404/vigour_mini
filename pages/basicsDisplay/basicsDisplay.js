var app = getApp()
var userInfo //用户信息
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
        console.log("选择修改后的头像成功")
        this.setData({ //修改页面数据
          ["userInfo.avatarUrl"]: temp[0]
        })
      })
      .catch(console.error)
  },
  //处理表单
  handleChange: async function (event) {
    //获取表单数据(可修改)
    userInfo.nickName = event.detail.value.nickName
    userInfo.gender = event.detail.value.gender == "男" ? 1 : 0
    userInfo.province = event.detail.value.province
    //控制表单提交条件
    if (userInfo.avatarUrl != this.data.userInfo.avatarUrl || userInfo.nickName != this.data.userInfo.nickName || userInfo.gender != this.data.userInfo.gender || userInfo.province != this.data.userInfo.province) {
      //昵称非空
      if (userInfo.nickName == "" || userInfo.nickName == " " || userInfo.nickName.length == 0) {
        wx.showToast({
          title: '昵称不能为空！',
          icon: "error"
        })
      } else {
        //判断是否修改头像
        if (userInfo.avatarUrl != this.data.userInfo.avatarUrl) {
          var timestamp = Date.parse(new Date()) //生成时间戳
          await wx.cloud.uploadFile({ //上传图片
              cloudPath: "user/" + timestamp + Math.floor(Math.random() * 1000) + ".png", // 上传至云端的路径
              filePath: this.data.userInfo.avatarUrl, // 小程序临时文件路径
            })
            .then((res) => {
              console.log("上传图片成功")
              userInfo.avatarUrl = res.fileID
            })
            .catch(console.error)
        }
        //云函数修改user数据
        await wx.cloud.callFunction({
          name: "updateUser",
          data:{
            change_userInfo:userInfo
          }
        })
        //修改全局变量
        app.globalData.userInfo = userInfo
        await wx.showToast({
          title: '修改成功',
        })    
        
      }
    } else {
      this.setData({
        is_link: !this.data.is_link,
        button_info: !this.data.button_info
      })
    }
  },
  onLoad: function (options) {
    //全局获取userInfo
    userInfo = JSON.parse(JSON.stringify(app.globalData.userInfo))
    console.log(userInfo)
    this.setData({
      userInfo: JSON.parse(JSON.stringify(userInfo))
    })
  },
})