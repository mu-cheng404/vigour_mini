const {
  $Toast
} = require('../../dist/base/index');
var _openid = "ohRLL5DhHDRScbpZ9HL9mnlhLwSU"
var app = getApp()
const Max = Number.POSITIVE_INFINITY
const Min = Number.NEGATIVE_INFINITY
const DB = wx.cloud.database()
const _ = DB.command
const _att = DB.collection("attendance") //打卡表
const _like = DB.collection("like") //点赞表
const _comment = DB.collection("comment") //评论表
const _user = DB.collection("user") //用户表
const _sup = DB.collection("supervise") //监督表
const _label = DB.collection("label") //标签表
const $ = DB.command.aggregate //聚合操作符
var label //标签列表
var n //Data维度
var openidArr = [] //用户openID列表
var Data = [] //数据向量化结果
var N //数据量
var clusters //聚簇数组
var kmin = 4 //k的最大值
var kmax = 4 //k的最小值
var count = 5 //
var finalClusters = [] //最终的聚簇
var finalSC = Min //最终的最大轮廓系数
var finalK = 0 //最终的k值
Page({

  arrayEqual: function (array1, array2) {

    for (var i = 0; i < array1.length; i++) {
      for (var j = 0; j < array1[i].length; j++) {
        if (array1[i][j] != array2[i][j]) return false
      }

    }
    return true
  },
  CalcuDistance: function (point1, point2) { //计算向量的欧氏距离
    var n = point1.length //样本维度
    var temp = 0 //中间变量
    for (var i = 0; i < n; i++) {
      temp += (point1[i] - point2[i]) * (point1[i] - point2[i]) //计算每一维的距离
    }
    // console.log("point1=", point1)
    // console.log("point2=", point2)
    // console.log("距离计算结果为：", Math.sqrt(temp))
    return Math.sqrt(temp) //计算temp平方根，即向量距离
  },

  k_means: function () {

    for (var k = kmin; k <= kmax; k++) { //从kmin到kmax循环聚簇，选出轮廓系数最大的那个
      //选k个点作为中心点
      var centerPoints = []

      for (var i = 0; i < k; i++) { //从前面选择初始点
        centerPoints.push(Data[i].data)
        // console.log("123")
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
        }

        // console.log("聚簇为", clusters)
        //重新计算每个聚簇的中心点
        for (var i = 0; i < k; i++) {
          var tempPoint = new Array(n).fill(0) //临时中心点
          for (var j = 0; j < clusters[i].length; j++) {
            for (var t = 0; t < n; t++) {
              tempPoint[t] += clusters[i][j].data[t]
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
      this.setData({
        finalSC: (tempSC * 100).toFixed(1) + "%"
      })
    }

  },

  SC: function () { //计算轮廓系数
    var a = [] //凝聚度
    var b = [] //分离度
    var sc = [] //轮廓系数
    for (var i = 0; i < clusters.length; i++) { //遍历每个簇
      for (var j = 0; j < clusters[i].length; j++) { //簇中的每个点
        var tempA = 0 //每个点的临时凝聚度
        for (var J = 0; J < clusters[i].length; J++) { //遍历本簇中所有其他点，计算平均距离
          tempA += this.CalcuDistance(clusters[i][j].data, clusters[i][J].data)
        }
        tempA = parseInt(tempA / clusters[i].length)
        var tempb = 0 //每个点的临时分离度
        var tempB = Max //每个点的最终最短分离度
        for (var I = 0; I < clusters.length; I++) { //遍历本簇外的其他簇，求最近平均距离
          if (I != i && clusters[I].length != 0) {
            for (var J = 0; J < clusters[I].length; J++) { //求平均距离
              tempb += this.CalcuDistance(clusters[i][j].data, clusters[I][J].data)

            }
            tempb = parseInt(tempb / clusters[I].length)
            tempB = Math.min(tempB, tempb)
          }
        }
        sc.push((tempB - tempA) / Math.max(tempA, tempB))
      }
    }
    console.log("轮廓系数数组=", sc)
    var SCave = 0 //平均轮廓系数
    for (var i = 0; i < sc.length; i++) {
      SCave += sc[i]
    }
    // console.log("轮廓系数=", SCave / sc.length)
    return SCave / sc.length
  },
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
    selectedInfo: [
      //   {
      //   avatar: "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJ5zfjAwianjJuiby7NEeEqzNScTia2B05ib570NYnialGruibGAoC1VX6gIRNsRXfdwf103U6cbNrsoBEg/132",
      //   nickName: "fzy",
      //   _openid: "ohRLL5C5HAdcOX8K6LIZ35agNgwo",
      //   isSupervise: false
      // }, {
      //   avatar: "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJ5zfjAwianjJuiby7NEeEqzNScTia2B05ib570NYnialGruibGAoC1VX6gIRNsRXfdwf103U6cbNrsoBEg/132",
      //   nickName: "fzy",
      //   _openid: "ohRLL5C5HAdcOX8K6LIZ35agNgwo",
      //   isSupervise: true
      // }, {
      //   avatar: "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJ5zfjAwianjJuiby7NEeEqzNScTia2B05ib570NYnialGruibGAoC1VX6gIRNsRXfdwf103U6cbNrsoBEg/132",
      //   nickName: "fzy",
      //   _openid: "ohRLL5C5HAdcOX8K6LIZ35agNgwo",
      //   isSupervise: false
      // }, {
      //   avatar: "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJ5zfjAwianjJuiby7NEeEqzNScTia2B05ib570NYnialGruibGAoC1VX6gIRNsRXfdwf103U6cbNrsoBEg/132",
      //   nickName: "fzy",
      //   _openid: "ohRLL5C5HAdcOX8K6LIZ35agNgwo",
      //   isSupervise: false
      // }, 
    ], //最终的openID、头像和昵称列表
  },
  changeGroup: function () {
    wx.showModal({
        cancelColor: 'cancelColor',
        content: "这个功能还不支持，因为肝不动了...",
        confirmText: "体谅ta",
        cancelText: "体谅ta"
      })
      .then((res) => {
        $Toast({ //请提示
          content: '谢谢你你真好'
        })
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () { //测试用的onload避免太长加载时间
    this.setData({ //显示加载动画
      isShow: false
    })
  },
  onLoad: async function (options) { //正常使用的onload
    this.setData({ //显示加载动画
      isShow: true
    })
    //获取本用户openID
    await wx.cloud.callFunction({
        name: "getOpenID",
      })
      .then((res) => {
        _openid = res.result.openid
      })
    // /*
    //数据预处理
    var start = new Date().getTime(); //起始时间
    //获取标签
    await _label.get().then((res) => {
      label = res.data
      n = label.length
    })
    //获取所有用户openid
    await _user.aggregate().group({
        _id: "$_openid"
      }).end().then(async (res) => {
        //数据初始化
        openidArr = [] //openid数组
        for (var i = 0; i < res.list.length; i++) {
          openidArr.push(res.list[i]._id)
        }
        N = openidArr.length //数据长度
        Data = [] //数据集（final）

        var singleData = new Array(N)
        for (var i = 0; i < N; i++) {
          singleData[i] = new Array()
          for (var j = 0; j < n; j++) {
            singleData[i][j] = 0
          }
        }

        //数据处理
        var promiseArr = []
        var index = 0
        for (var i = 0; i < N; i++) { //循环openid数组
          //获取单个用户的打卡记录
          promiseArr.push(new Promise((resolve, reject) => {
            _att.where({
              _openid: openidArr[i]
            }).get().then((res) => {
              // console.log(index)
              // console.log("找到用户打卡信息！", res.data)
              for (var j = 0; j < res.data.length; j++) { //遍历res.data
                for (var p = 0; p < n; p++) { //遍历维数，填充数据
                  // console.log("当前标签为：", res.data[j].topic)
                  // console.log("当前标签集=", label[p].second)
                  if (label[p].second.indexOf(res.data[j].topic) > -1) {
                    // console.log("我进来了")
                    // console.log("singleData[i][p]=",singleData)
                    singleData[index][p]++
                    // console.log("找到啦！")
                    break
                  }
                }
              }
              index++
              resolve()
            }).catch(console.error)
          }))
        }
        await Promise.all(promiseArr)
        // console.log("singleData=", singleData)

        //数据清洗
        for (var i = 0; i < N; i++) {
          var tempSum = 0
          for (var p = 0; p < n; p++) {
            tempSum += singleData[i][p]
          }
          // console.log(tempSum)
          if (tempSum != 0) { //筛去没有打卡记录的数据
            // console.log("符合要求！")
            Data.push({
              id: openidArr[i],
              data: singleData[i]
            })
          }
        }
        N = Data.length //清洗后的数据量
      })
      .catch(console.error)


    console.log(Data)

    this.k_means()
    console.log("当k= " + finalK + "时,轮廓系数=" + finalSC)
    console.log(finalClusters)

    var idx //寻找本用户匹配聚簇
    var jdx //本用户所处聚簇第几个？
    var selectedInfo = [] //临时数据
    for (var i = 0; i < finalClusters.length; i++) {
      for (var j = 0; j < finalClusters[i].length; j++) {
        if (finalClusters[i][j].id == _openid) {
          idx = i
          jdx = j
          break
        }
      }
    }
    console.log("本用户属于第" + idx + "个聚簇")
    for (var i = 0; i < finalClusters[idx].length; i++) {
      if (i != jdx) {
        var tempID = finalClusters[idx][i].id
        var tempAvatar
        var tempNickName
        var tempisSupervise = false
        var tempGender = ""
        await _user.where({
          _openid: tempID
        }).get().then((res) => {
          tempNickName = res.data[0].nickName
          tempAvatar = res.data[0].avatarUrl
          tempGender = res.data[0].gender
        })
        await _sup.where({
          _openid: _openid,
          superedID: tempID
        }).count().then((res) => {
          if (res.total) {
            tempisSupervise = true
          }
        })
        selectedInfo.push({
          _openid: tempID,
          avatar: tempAvatar,
          nickName: tempNickName,
          isSupervise: tempisSupervise,
          gender: tempGender,
          details: finalClusters[idx][i].data
        })
      }
    }
    this.setData({
      selectedInfo: selectedInfo
    })
    console.log("最终数据是！！！", selectedInfo)
    // */
    this.setData({ //显示加载动画
      isShow: false
    })

    var end = new Date().getTime(); //接受时间
    console.log((end - start) + "ms")
  }
})