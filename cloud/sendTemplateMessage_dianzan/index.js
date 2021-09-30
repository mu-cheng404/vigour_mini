const cloud = require('wx-server-sdk')
cloud.init({
  env: 'wu-env-5gq7w4mm483966ef'
})
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      "touser": cloud.getWXContext().OPENID, // 通过 getWXContext 获取 OPENID
      "page": '/pages/homePage/homePage.wxml',
      data: {
        thing1: {
          value: '399'
        },
        thing2: {
          value: '20'
        },
        thing3: {
          value: '腾讯部'
        },
        time4: {
          value: '2021年12月21日 12:32'
        },
        thing5: {
          value: '号'
        }
      },
      "templateId": 'biICdUOmgqKaKzs-P6f4rt70L4t8g_ww83mFvPUPU3g',
      miniprogramState: 'developer',//跳转的小程序版本
      "emphasisKeyword": 'thing1.DATA'
    })
    // result 结构
    // { errCode: 0, errMsg: 'openapi.templateMessage.send:ok' }
    return result
  } catch (err) {
    // 错误处理
    // err.errCode !== 0
    return err
  }
}

