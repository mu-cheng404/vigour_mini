const {$Toast} = require('../../dist/base/index');
var app = getApp()
const DB = wx.cloud.database()
const _ = DB.command
const _att = DB.collection("attendance") //打卡表
const _user = DB.collection("user") //用户表
const _sup = DB.collection("supervise") //监督表
const _label = DB.collection("label") //标签表
const $ = DB.command.aggregate //聚合操作符
var label //标签列表
var n //Data维度
var allUserInfo = [] //所有用户信息
var Data //数据向量化结果
var N //数据量
var clusters //聚簇数组
var kmin = 4 //k的最大值
var kmax = 4 //k的最小值
var count = 5 //
var finalClusters = [] //最终的聚簇
var _openid
Page({
  //判断数组相等
  arrayEqual: function (array1, array2) {
    for (var i = 0; i < array1.length; i++) {
      for (var j = 0; j < array1[i].length; j++) {
        if (array1[i][j] != array2[i][j]) return false
      }
    }
    return true
  },
  //计算两个数据之间的距离
  CalcuDistance: function (point1, point2) { //计算向量的欧氏距离
    var n = point1.length //样本维度
    var temp = 0 //中间变量
    for (var i = 0; i < n; i++) {
      temp += (point1[i] - point2[i]) * (point1[i] - point2[i]) //计算每一维的距离
    }
    return Math.sqrt(temp) //计算temp平方根，即向量距离
  },
  //k_means算法
  k_means: function () {
    //从kmin到kmax循环聚簇，选出轮廓系数最大的那个
    for (var k = kmin; k <= kmax; k++) {
      //选k个点作为中心点
      var centerPoints = []
      for (var i = 0; i < k; i++) { //从前面选择初始点
        centerPoints[i] = Data[i].data
      }
      //循环聚类
      while (count--) {
        console.log("循环")
        //存储上一个中心点状态，用来判断是否跳出循环
        var tempCenterPoints = [].concat(centerPoints)
        console.log("tempCenterPoints", tempCenterPoints)
        //初始化clusters
        clusters = []
        for (var i = 0; i < k; i++) {
          clusters[i] = new Array()
        }
        //循环每个点找到与其距离最近的聚簇点，放入一个聚簇中
        for (var i = 0; i < N; i++) {
          var dis = this.CalcuDistance(Data[i].data, centerPoints[0]) //与第一个初始点的距离
          var idx = 0 //聚簇下标值
          for (var j = 1; j < k; j++) {
            var curDis = this.CalcuDistance(Data[i].data, centerPoints[j])
            if (curDis < dis) { //当发现距离更短的点
              idx = j
              dis = curDis
            }
          }
          clusters[idx].push(Data[i])
          console.log(clusters)
        }
        //重新计算每个聚簇的中心点
        for (var i = 0; i < k; i++) {
          var tempPoint = new Array(n).fill(0) //临时中心点
          for (var j = 0; j < clusters[i].length; j++) {
            for (var t = 0; t < n; t++) {
              tempPoint[t] += clusters[i][j].data[t]
            }
          }
          for (var t = 0; t < n; t++) {
            if (tempPoint[t] == 0) {
              tempPoint[t] = 0
            } else {
              tempPoint[t] = parseInt(tempPoint[t] / clusters[i].length)
            }
          }
          centerPoints[i] = tempPoint
        }
        //如果中心点没有发生改变，则跳出循环
        if (this.arrayEqual(centerPoints, tempCenterPoints)) {
          break
        }
      }
      finalClusters = [].concat(clusters)
      console.log(finalClusters)
    }
  },
  //点击监督按钮
  handleSupervise: async function (event) {
    var tapID = event.currentTarget.id //记录选择的id
    var superedID = this.data.selectedInfo[tapID]._openid //记录选择的用户的_openid
    var isSupervise = this.data.selectedInfo[tapID].isSupervise //记录选择的用户是否被监督
    if (isSupervise) {
      wx.showModal({
          cancelColor: 'cancelColor',
          content: "确定不监督ta了吗？"
        })
        .then(async (res) => {
          if (!res.cancel) { //点击确定
            await _sup.where({
              _openid: _openid,
              superedID: superedID
            }).remove().then((res) => {
              $Toast({ //请提示
                content: '取消成功',
                type: 'success'
              })
              this.setData({
                ['selectedInfo[' + tapID + '].isSupervise']: !isSupervise
              })
            }).catch(console.error)
          }
        })
    } else {
      await _sup.add({
        data: {
          superedID: superedID
        }
      }).then((res) => {
        this.setData({
          ['selectedInfo[' + tapID + '].isSupervise']: !isSupervise
        })
      }).catch(console.error)
    }
  },
  data: {
    finalSC: "", //匹配度
    isShow: false, //是否显示加载动画
    isloading: false, //是否显示加载中
    recommendInfo: [], //推荐用户
    selectedInfo: [], //最终的openID、头像和昵称列表
  },
  onLoad: async function (options) {
    //初始化
    finalClusters = []
    clusters = []
    allUserInfo = []
    //显示加载动画
    this.setData({
      isShow: true
    })
    //获取本用户openID
    _openid = app.globalData._openid
    console.log("获取openid", _openid)
    //数据预处理
    var start = new Date().getTime(); //起始时间
    //获取标签
    label = await _label.get()
    label = label.data
    console.log("获取标签", label)
    //确定维度
    n = label.length
    console.log("获取维度", n)
    //获取所有用户信息
    var user_count = await _user.count()
    user_count = user_count.total
    console.log("count=", user_count)
    for (var i = 0; i < user_count; i += 20) {
      let list = await _user.skip(i).get()
      allUserInfo = allUserInfo.concat(list.data)
    }
    console.log("获取用户信息", allUserInfo)
    //确定数据长度
    N = allUserInfo.length
    console.log(N)
    //初始化单个数据条
    Data = []
    for (var i = 0; i < N; i++) {
      Data.push({
        _openid: allUserInfo[i]._openid,
        data: [0, 0, 0, 0],
        avatarUrl: allUserInfo[i].avatarUrl,
        nickName: allUserInfo[i].nickName,
        gender: allUserInfo[i].gender
      })
    }
    //数据处理
    var promiseArr = []
    for (var i = 0; i < N; i++) { //循环openid数组
      //获取单个用户的打卡记录
      promiseArr.push(new Promise(async (resolve, reject) => {
        var i_index = i
        var temp_att = await _att.where({
          _openid: allUserInfo[i_index]._openid
        }).get()
        temp_att = temp_att.data
        console.log("temp_att=", temp_att)

        for (var j = 0; j < temp_att.length; j++) {
          var j_index = j
          var temp_label = temp_att[j_index].topic
          console.log("temp_label", temp_label)
          for (var p = 0; p < n; p++) {
            var p_index = p

            if (label[p_index].second.indexOf(temp_label) > -1) {
              Data[i_index].data[p_index]++
              console.log("Data[" + i_index + "].data[" + p_index + "]=", Data[i_index].data[p_index])
              break
            }
          }
        }
        resolve()
      }))
    }
    await Promise.all(promiseArr)

    //数据清洗
    for (var i = 0; i < N; i++) {
      var tempSum = 0
      for (var p = 0; p < n; p++) {
        tempSum += Data[i].data[p]
      }
      //筛去没有打卡记录的数据
      if (tempSum == 0) {
        console.log("i=", i)
        Data.splice(i, 1)
        console.log("Data=", Data)
        i--, N--
      }
    }
    //清洗后的数据量
    N = Data.length
    //调用k_means算法
    this.k_means()
    console.log("这是最后的："+ JSON.stringify(finalClusters))
    
    //寻找本用户匹配聚簇索引
    var idx 
    for (var i = 0; i < kmin; i++) {
      for (var j = 0; j < finalClusters[i].length; j++) {
        if (finalClusters[i][j]._openid == _openid) {
          idx = i
          finalClusters[i].splice(j, 1)
          break
        }
      }
    }
    //渲染数据
    console.log("idx="+idx)
    this.setData({
      selectedInfo: finalClusters[1],
      recommendInfo: finalClusters[1]
    })
    this.setData({ //显示加载动画
      isShow: false
    })
    var end = new Date().getTime(); //接受时间
    console.log((end - start) + "ms")
  }
})