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
 function unLoadWarn(){
  console.log("调用unLoadWarn成功！")
 var temp = wx.getStorageSync("userBaseInfo")
 if(!temp){
   wx.showModal({
     content:"您还未登录哦，是否前往登录？",
     cancelColor: '#EFEFEF',
     success(res){
       if(res.confirm){
         wx.navigateTo({
           url: 'pages/personalCenter/personalCenter',
         })
       }
     },
   })
 }
};
 // 导出
 module.exports = {
  formatDate: formatDate,
  unLoadWarn:unLoadWarn
 }

 