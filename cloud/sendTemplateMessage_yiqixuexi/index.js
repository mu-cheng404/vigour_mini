

const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
exports.main = async (event, context) => {
  var info = event.info
  //获取用户id
  const wxContext = cloud.getWXContext()
  const touser = info.openid
  const template_id = 'mnsEh9CZLNqarLbeZZJ94RQxXh6rCriQo_gFRuXWmM8'

  
  //发送推送消息
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      "touser": touser,//要发送给谁
      "page": 'pages/homePage/homePage',//点击消息跳转到那个页面
      "template_id": template_id,//模板消息
      data: {//数据
        "name1": {
          "value": info.nickname
        },
        "phrase2": {
          "value": '一起学习'
        },
        "phrase3": {
          "value": '等待回复'
        },
        "time4": {
          "value": info.time
        },
      },
      miniprogramState: 'developer'//跳转的小程序版本
    })
    return result
  } catch (error) {
    return error
  }



}