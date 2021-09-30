const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
exports.main = async (event, context) => {
  //获取用户id
  const wxContext = cloud.getWXContext()
  const touser = wxContext.OPENID
  const template_id = 'mnsEh9CZLNqarLbeZZJ94RQxXh6rCriQo_gFRuXWmM8'

  //发送推送消息
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      "touser": touser,//要发送给谁
      "page": '/page/loading/loading',//点击消息跳转到那个页面
      "template_id": template_id,//模板消息
      data: {//数据
        "name1": {
          "value": '你真帅'
        },
        "phrase2": {
          "value": '我知道'
        },
        "phrase3": {
          "value": '不你不知道'
        },
        "time4": {
          "value": '15:01'
        },
      },
      miniprogramState: 'developer'//跳转的小程序版本
    })
    return result
  } catch (error) {
    return error
  }



}