const DB = wx.cloud.database()
const _user = DB.collection("user")
const _ = DB.command
var add_label //新标签
var doc //记录Id
var mainText
var main //标签序号
Page({
  _getContent: function (evt) {
    add_label = evt.detail.detail.value
    console.log(add_label)
  },
  _handleAdd: function (evt) {
    //标签表中添加二级标签
    _user.where({ 
      _id: doc,
      'label.main': mainText
    }).update({data:{
      'label.$.second':_.push(add_label),
      'label.$.title':_.push('计划'),
      'label.$.plan':_.push(""),
      'label.$.templateID':_.push("")
    }})
    .then((res) => {
      console.log("添加成功！", res)
      wx.navigateTo({
        url: '../secondLabel/secondLabel?main='+main,
      })
    })
  },
  onLoad: function (options) {
    doc = options.doc
    mainText = options.mainText
    main = options.main
    console.log(doc)
    console.log(mainText)
  }
})