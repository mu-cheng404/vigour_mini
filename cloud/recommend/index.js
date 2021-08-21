const cloud = require('wx-server-sdk')
cloud.init()
var _openid = "ohRLL5DhHDRScbpZ9HL9mnlhLwSU"
const Max = Number.POSITIVE_INFINITY
const Min = Number.NEGATIVE_INFINITY
const DB = cloud.database()
const _ = DB.command
const _att = DB.collection("attendance") //打卡表
const _like = DB.collection("like") //点赞表
const _comment = DB.collection("comment") //评论表
const _user = DB.collection("user") //用户表
const _sup = DB.collection("supervise") //监督表
const $ = DB.command.aggregate //聚合操作符
var label //标签列表
var n //Data维度
var openidArr = [] //用户openID列表
var Data = [] //数据向量化结果
var N //数据量
var clusters //聚簇数组
var kmin = 3 //k的最大值
var kmax = 3 //k的最小值

function arrayEqual(array1, array2) {

  for (var i = 0; i < array1.length; i++) {
    for (var j = 0; j < array1[i].length; j++) {
      if (array1[i][j] != array2[i][j]) return false
    }
  }
  return true
}

function CalcuDistance(point1, point2) { //计算向量的欧氏距离
  var n = point1.length //样本维度
  var temp = 0 //中间变量
  for (var i = 0; i < n; i++) {
    temp += (point1[i] - point2[i]) * (point1[i] - point2[i]) //计算每一维的距离
  }
  // console.log("point1=", point1)
  // console.log("point2=", point2)
  // console.log("距离计算结果为：", Math.sqrt(temp))
  return Math.sqrt(temp) //计算temp平方根，即向量距离
}

function k_means() {
  var finalClusters = [] //最终的聚簇
  var finalSC = Min //最终的最大轮廓系数
  var finalK = 0 //最终的k值
  for (var k = kmin; k <= kmax; k++) { //从kmin到kmax循环聚簇，选出轮廓系数最大的那个
    //选k个点作为中心点
    var centerPoints = []

    for (var i = 0; i < k; i++) { //从前面选择初始点
      centerPoints.push(Data[i])
      console.log("123")
    }
    // for(var i = 0 ;i < k ; i++){//随机选取初始点
    //     centerPoints.push(Data[Math.round(Math.random() * (N-1))])
    // }

    while (true) {
      console.log("中心点为：", centerPoints)
      console.log("123")
      var tempCenterPoints = [].concat(centerPoints) //存储上一个中心点状态

      clusters = [] //聚类结果
      for (var i = 0; i < k; i++)
        clusters[i] = new Array()

      //循环每个点找到与其距离最近的聚簇点，放入一个聚簇中
      for (var i = 0; i < N; i++) {
        var dis = this.CalcuDistance(Data[i], centerPoints[0]) //与第一个初始点的距离
        var idx = 0 //聚簇下标值
        for (var j = 1; j < k; j++) {
          var curDis = this.CalcuDistance(Data[i], centerPoints[j])
          if (curDis < dis) { //当发现距离更短的点
            idx = j
            dis = curDis
          }
        }
        clusters[idx].push(Data[i])
      }

      // console.log("聚簇为", clusters)
      //重新计算每个聚簇的中心点
      for (var i = 0; i < k; i++) {
        var tempPoint = new Array(n).fill(0) //临时中心点
        for (var j = 0; j < clusters[i].length; j++) {
          for (var t = 0; t < n; t++) {
            tempPoint[t] += clusters[i][j][t]
          }
        }

        for (var t = 0; t < n; t++) {
          tempPoint[t] = parseInt(tempPoint[t] / clusters[i].length)
        }
        centerPoints[i] = tempPoint
      }
      if (this.arrayEqual(centerPoints, tempCenterPoints)) {
        break
      } //如果中心点没有发生改变，则跳出循环
    }
    var tempSC = this.SC() //获取轮廓系数
    console.log("轮廓系数为：", tempSC)
    if (tempSC > finalSC) { //当遇到更大的轮廓系数时
      finalSC = tempSC
      finalClusters = [].concat(clusters)
      finalK = k
    }
  }
  console.log("当k= " + finalK + "时,轮廓系数=" + finalSC)
  console.log(finalClusters)
  return finalClusters
}

function SC() { //计算轮廓系数
  var a = [] //凝聚度
  var b = [] //分离度
  var sc = [] //轮廓系数
  for (var i = 0; i < clusters.length; i++) { //遍历每个簇
    for (var j = 0; j < clusters[i].length; j++) { //簇中的每个点
      var tempA = 0 //每个点的临时凝聚度
      for (var J = 0; J < clusters[i].length; J++) { //遍历本簇中所有其他点，计算平均距离
        tempA += this.CalcuDistance(clusters[i][j], clusters[i][J])
      }
      tempA = parseInt(tempA / clusters[i].length)
      var tempb = 0 //每个点的临时分离度
      var tempB = Max //每个点的最终最短分离度
      for (var I = 0; I < clusters.length; I++) { //遍历本簇外的其他簇，求最近平均距离
        if (I != i && clusters[I].length != 0) {
          for (var J = 0; J < clusters[I].length; J++) { //求平均距离
            tempb += this.CalcuDistance(clusters[i][j], clusters[I][J])

          }
          tempb = parseInt(tempb / clusters[I].length)
          // console.log("clusters[I].length", clusters[I].length)
          // if(clusters[I].length == 0){
          //   console.log("clusters",clusters)
          // }
          // console.log("tempb", tempb)
          tempB = Math.min(tempB, tempb)
        }
      }
      sc.push((tempB - tempA) / Math.max(tempA, tempB))
      // console.log("tempA", tempA)
      // console.log("tempB", tempB)
      // console.log("(tempB - tempA) / Math.max(tempA, tempB)", (tempB - tempA) / Math.max(tempA, tempB))
    }
  }
  console.log("轮廓系数数组=", sc)
  var SCave = 0 //平均轮廓系数
  for (var i = 0; i < sc.length; i++) {
    SCave += sc[i]
  }
  // console.log("轮廓系数=", SCave / sc.length)
  return SCave / sc.length
}
exports.main = async (event, context) => {
  label = ["早起", "学习", "运动", "读书", "早睡", "健康", "喝水"] //获取标签列表
  n = label.length //维度初始化
  //数据预处理
  await _user.aggregate().group({
      _id: "$_openid"
    }).end().then(async (res) => {
      openidArr = [] //所有用户openid的数组
      for (var i = 0; i < res.list.length; i++) { //初始化_openid数组
        openidArr.push(res.list[i]._id)
      }
      N = openidArr.length //N初始化
      Data = [] //初始化数据集
      for (var i = 0; i < openidArr.length; i++) { //处理Data
        var singleData = [] //单个用户，单个数据
        for (var j = 0; j < n; j++) {
          await _att.where({
            _openid: openidArr[i],
            topic: label[j]
          }).count().then((res) => {
            singleData.push(res.total)
          })
        }
        Data.push(singleData)
      }
      console.log(Data)
      wx.setStorageSync('Data', Data)
    })
    .catch(console.error)

  return {
    clusters: k_means()
  }
}