const att = wx.cloud.database().collection("attendance")
const user = wx.cloud.database().collection("user")
const like = wx.cloud.database().collection("like")
const comment = wx.cloud.database().collection("comment")
const $ = wx.cloud.database().command.aggregate

Page({
  deletetest: function (params) {
    att.where({
      content: '测试'
    }).remove()
    console.log("完成")
  },
  user: async function (params) {
    var user_info = []
    var count = user.count()
    count = (await count).total
    var init_label = [{
      main: "学习",
      second: ["读书", "练字", "考研", "考证", "考级", "背单词"],
      title: ["计划", "计划", "计划", "计划", "计划", "计划"],
      plan: ["", "", "", "", "", ""]
    }, {
      main: "生活",
      second: ["早睡", "早起", "健身", "护肤", "心情"],
      title: ["计划", "计划", "计划", "计划", "计划"],
      plan: ["", "", "", "", ""]

    }, {
      main: "运动",
      second: ["跑步", "行走", "骑行", "瑜伽", "冥想", "动作"],
      title: ["计划", "计划", "计划", "计划", "计划", "计划"],
      plan: ["", "", "", "", "", ""]

    }, {
      main: "其他",
      second: ["写作", "成长", "工作", "手工", "手账"],
      title: ["计划", "计划", "计划", "计划", "计划"],
      plan: ["", "", "", "", ""]

    }]
    for (var i = 0; i < count; i += 20) {
      var temp = await user.skip(i).get()
      temp = temp.data
      user_info = user_info.concat(temp)
    }
    console.log(user_info)

    for (var i = 0; i < user_info.length; i++) {

      await user.doc(user_info[i]._id).update({
        data: {
          label: init_label
        }
      })
      console.log("修改成功")
    }
  },
  sendMessage_yiqixuexi: async function (evt) {
    console.log(evt)
    await wx.requestSubscribeMessage({
      tmplIds: ['mnsEh9CZLNqarLbeZZJ94RQxXh6rCriQo_gFRuXWmM8'],
      success(res) {
        wx.getSetting({
          withSubscriptions: true,
        }).then(res => {
          console.log(res)
        })
      }
    })
    //发模板消息
    await wx.cloud.callFunction({
      name: "sendTemplateMessage_yiqixuexi",
    }).then(console.log)
  },
  sendMessage_dianzan: function (evt) {
    console.log(evt)
    wx.requestSubscribeMessage({
      tmplIds: ['biICdUOmgqKaKzs-P6f4rt70L4t8g_ww83mFvPUPU3g'],
      success(res) {
        wx.getSetting({
          withSubscriptions: true,
        }).then(res => {
          console.log(res)
        })
      }
    })
    wx.cloud.callFunction({
      name: "sendTemplateMessage_dianzan",

    }).then(console.log)
  },
  sendMessage_liuyan: function (evt) {
    wx.cloud.callFunction({
      name: "sendTemplateMessage",
      data: {
        nickName: '',
        relation: '一起学习',
        state: '',
        time: ''
      }
    }).then(console.log)
  },
  onLoad: async function (params) {
    // var count = await att.count()
    // count = count.total
    // console.log("count=",count)


    // var att_info = [] //存储查询结果(顺序)
    // for (var i = 0; i < count; i += 20) {
    //   let list = await att.skip(i).get()
    //   att_info = att_info.concat(list.data)
    // }

    // console.log("att_info=",att_info)

    // for(var i = 0;i < att_info.length;i++)
    // {
    //   if(!att_info.gender){
    //     var user_info = await user.where({
    //       _openid : att_info[i]._openid
    //     }).get()
    //     user_info = user_info.data[0]

    //     await att.doc(att_info[i]._id).update({
    //       data:{
    //         gender:user_info.gender
    //       }
    //     })

    //   }
    // }

    //给评论加上昵称和头像
    // var count = await comment.count()
    // count = count.total
    // console.log("count=",count)


    // var comment_info = [] //存储查询结果(顺序)
    // for (var i = 0; i < count; i += 20) {
    //   let list = await comment.skip(i).get()
    //   comment_info = comment_info.concat(list.data)
    // }

    // console.log("comment_info=",comment_info)

    // for(var i = 0;i < comment_info.length;i++)
    // {
    //   if(!comment_info.nickName){
    //     var user_info = await user.where({
    //       _openid : comment_info[i]._openid
    //     }).get()
    //     user_info = user_info.data[0]

    //     await comment.doc(comment_info[i]._id).update({
    //       data:{
    //         avatarUrl:user_info.avatarUrl,
    //         nickName:user_info.nickName,
    //         gender:user_info.gender
    //       }
    //     })
    //     console.log("成功！")
    //   }
    // }




    //给打卡条加上点赞列表
    // var count = await att.count()
    // count = count.total
    // console.log("count=",count)


    // var att_info = [] //存储查询结果(顺序)
    // for (var i = 0; i < count; i += 20) {
    //   let list = await att.skip(i).get()
    //   att_info = att_info.concat(list.data)
    // }

    // console.log("att_info=",att_info)

    // for(var i = 0;i < att_info.length;i++)
    // { 
    //   var like_list = await like.where({liked_id:att_info[i]._id}).get()
    //   like_list = like_list.data
    //   console.log(like_list)
    //   var like_list2 = []
    //   for(var j = 0; j <like_list.length;j++){
    //     like_list2[j]=like_list[j]._openid
    //   }
    //   console.log(like_list2)
    //   await att.doc(att_info[i]._id).update({
    //     data:{
    //       like_list:like_list2
    //     }
    //   })
    //   console.log("成功!")
    // }

    // // 给评论加上点赞列表
    // var count = await comment.count()
    // count = count.total
    // console.log("count=",count)


    // var comment_info = [] //存储查询结果(顺序)
    // for (var i = 0; i < count; i += 20) {
    //   let list = await comment.skip(i).get()
    //   comment_info = comment_info.concat(list.data)
    // }

    // console.log("comment_info=",comment_info)

    // for(var i = 0;i < comment_info.length;i++)
    // { 
    //   var like_list = await like.where({liked_id:comment_info[i]._id}).get()
    //   like_list = like_list.data
    //   console.log(like_list)
    //   var like_list2 = []
    //   for(var j = 0; j <like_list.length;j++){
    //     like_list2[j]=like_list[j]._openid
    //   }
    //   console.log(like_list2)
    //   await comment.doc(comment_info[i]._id).update({
    //     data:{
    //       like_list:like_list2
    //     }
    //   })
    //   console.log("成功!")
    // }

    // 给打卡条加上评论列表
    // var count = await att.count()
    // count = count.total
    // console.log("count=",count)


    // var att_info = [] //存储查询结果(顺序)
    // for (var i = 0; i < count; i += 20) {
    //   let list = await att.skip(i).get()
    //   att_info = att_info.concat(list.data)
    // }

    // console.log("att_info=",att_info)

    // for(var i = 0;i < att_info.length;i++)
    // { 
    //   var comment_list = await comment.where({commented_id:att_info[i]._id}).get()
    //   comment_list = comment_list.data
    //   console.log(comment_list)

    //   await att.doc(att_info[i]._id).update({
    //     data:{
    //       comment_list:comment_list
    //     }
    //   })
    //   console.log("成功!")
    // }



  }


})