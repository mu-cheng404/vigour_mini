var S_label = []//标签集
Page({
  _handleDetail: function (evt) {
    var id = evt.currentTarget.id
    console.log(S_label)
    wx.navigateTo({
      url: '../punchEdit/punchEdit?topic=' + S_label[id].label + '&mainText=' + S_label[id].main,
    }) 
  },
  data: {
    S_label: [], //二级标签列表
    isShow: true, //是否显示加载中
  },
  onLoad: async function (options) {
    S_label= JSON.parse(options.label_number)
    console.log(S_label)
    //渲染数据
    this.setData({
      S_label: S_label,
      isShow: false
    })
  },
})