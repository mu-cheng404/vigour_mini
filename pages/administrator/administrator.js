const DB = wx.cloud.database()

Page({
  deleteLike: function () {
    wx.showModal({
      cancelColor: 'cancelColor',
      content: "确定要删除？",
      success: (res) => {
        console.log(res.cancel)
        if (res.cancel) {

        } else {
          DB.collection("like")
            .where({
              _id : '$_id'
            })
            .remove()
            .then((res) => {
              console.log("删除点赞表数据成功！")
              wx.showToast({
                title: '删除成功！',
              })
            })
            .catch(console.error)
        }
      }
    })
  }

})