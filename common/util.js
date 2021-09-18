const DB = wx.cloud.database()
const _att = DB.collection("attendance")
const _user = DB.collection("user")
const _comment = DB.collection("comment")
const _like = DB.collection("like")
var label = [{
  main: "学习",
  second: ["读书", "练字", "考研", "考证", "考级", "背单词"]
}, {
  main: "生活",
  second: ["早睡", "早起", "健身", "护肤", "心情"]
}, {
  main: "运动",
  second: ["跑步", "行走", "骑行", "瑜伽", "冥想", "动作"]
}, {
  main: "其他",
  second: ["写作", "成长", "工作", "手工", "手账"]
}]

function formatDate(inputTime) {
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;

};

function unLoadWarn() {
  console.log("调用unLoadWarn成功！")
  var temp = wx.getStorageSync("userBaseInfo")
  if (!temp) {
    wx.showModal({
      content: "您还未登录哦，是否前往登录？",
      cancelColor: '#EFEFEF',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: 'pages/personalCenter/personalCenter',
          })
        }
      },
    })
  }
};

function queryLogIn() { //查询是否登录？通过查询user表
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
        name: "getOpenID",
      })
      .then((res) => {
        var openid = res.result.openid
        _user.where({
            _openid: openid
          }).get()
          .then((res) => {
            // console.log(res.data[0])
            if (res.data.length) {
              console.log("该用户已登录！")
              resolve(true)
            } else {
              console.log("该用户还未登录！")
              resolve(false)
            }
          })
          .catch((err) => {
            resolve(err)
          })
      })
      .catch((err) => {
        resolve(err)
      })
  })
}

function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: '用于完善个人信息',
      success: (res) => {
        var data = res.userInfo
        //数据传入服务器中
        _user.add({
          data: {
            nickName: data.nickName,
            avatarUrl: data.avatarUrl,
            gender: data.gender,
            country: data.country,
            province: data.province,
            city: data.city,
            language: data.language,
            label :label
          },
          success(res) {
            console.log("成功获取用户信息并存入！", res)
            resolve()
          },
          fail(res) {
            console.log("用户信息存入云端失败！", res)
            reject()
          }
        })
      },
      fail(res) {
        console.log("获取用户信息失败！", res)
        reject()
      }
    })
  })
}
// 导出
module.exports = {
  formatDate: formatDate,
  unLoadWarn: unLoadWarn,
  queryLogIn: queryLogIn,
  getUserInfo: getUserInfo
}