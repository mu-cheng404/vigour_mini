const util = require("../../common/util")
var isLogIn
const DB = wx.cloud.database()
var _ = DB.command
const _att = DB.collection("attendance")
const _user = DB.collection("user")
const _comment = DB.collection("comment")
const _sup = DB.collection("supervise")
var _openid //本用户id 
var superedID = [] //监督的用户列表
var Att_list = []
// pages/punchCard/punchCard.js
Page({
    _handlerMore: function () {
        wx.navigateTo({
            url: '../moreSignIn/moreSignIn',
        })
    },
    _handlerSearch: function () {
        wx.navigateTo({
            url: '../search/search',
        })
    },
    _hander_superviseList: function () {
        wx.navigateTo({
            url: '../superviseList/suoerviseList',
        })
    },
    _handerTap: async function (evt) {
        if (!isLogIn) {
            const v2 = await util.getUserInfo()
            this.onLoad()
        } else {
            // console.log(evt.currentTarget.id)
            wx.navigateTo({
                url: '../punchEdit/punchEdit?type=' + evt.currentTarget.id,
                success: (result) => {},
                fail: () => {},
                complete: () => {}
            })
        }
    },
    /**
     * 页面的初始数据
     */
    data: {
        imageURL: "cloud://wu-env-5gq7w4mm483966ef.7775-wu-env-5gq7w4mm483966ef-1306826028/images/",
        punchCategoryArray: [{ 
            pictureSrc: "cloud://wu-env-5gq7w4mm483966ef.7775-wu-env-5gq7w4mm483966ef-1306826028/images/zaoqi.png",
            categoryText: "早起",
        }, {
            pictureSrc: "cloud://wu-env-5gq7w4mm483966ef.7775-wu-env-5gq7w4mm483966ef-1306826028/images/xuexi.png",
            categoryText: "学习",
        }, {
            pictureSrc: "cloud://wu-env-5gq7w4mm483966ef.7775-wu-env-5gq7w4mm483966ef-1306826028/images/yundong.png",
            categoryText: "运动",
        }, {
            pictureSrc: "cloud://wu-env-5gq7w4mm483966ef.7775-wu-env-5gq7w4mm483966ef-1306826028/images/dushu.png",
            categoryText: "读书",
        }, {
            pictureSrc: "cloud://wu-env-5gq7w4mm483966ef.7775-wu-env-5gq7w4mm483966ef-1306826028/images/zaoshui.png",
            categoryText: "早睡",
        }, {
            pictureSrc: "cloud://wu-env-5gq7w4mm483966ef.7775-wu-env-5gq7w4mm483966ef-1306826028/images/jiankang.png",
            categoryText: "健康",
        }, {
            pictureSrc: "cloud://wu-env-5gq7w4mm483966ef.7775-wu-env-5gq7w4mm483966ef-1306826028/images/heshui.png",
            categoryText: "喝水",
        }],
        isNull: false, //监督列表是否为空
        att_list: [], //打卡条列表
        avatarArr: [], //头像列表
        nickNameArr: [], //昵称列表
        isShow: true, //是否展示加载状态
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.setData({
            isShow: true
        })
        isLogIn = await util.queryLogIn()
        await wx.cloud.callFunction({ //获取用户id
                name: "getOpenID"
            })
            .then((res) => {
                console.log("获取openid", res.result.openid)
                _openid = res.result.openid
            })
            .catch(console.error)

        console.log("我想要清空数组！", superedID.length)
        if (superedID.length) {
            console.log("我进来了", superedID.length)
            superedID.length = 0
        } //每次加载首先清空现有数组
        if (Att_list.length) Att_list.length = 0

        await _sup.where({ //获取监督列表的openID
            _openid: _openid
        }).get().then((res) => {
            console.log("获取监督列表成功！", res)
            for (var i = 0; i < res.data.length; i++) {
                superedID.push(res.data[i].superedID)
            }
            console.log("获取监督列表openid")
        })
        for (var i = 0; i < superedID.length; i++) { //获取打卡条信息
            await _att.where({
                _openid: superedID[i]
            }).get().then((res) => {

                for (var j = 0; j < res.data.length; j++) {
                    Att_list.push(res.data[j])
                }
            })
        }
        console.log("获取打卡条信息")
        this.setData({
            att_list: Att_list.reverse()
        })

        await wx.cloud.callFunction({ //获取所有评论的头像和昵称集合
                name: "queryName_avatar",
                data: {
                    dataArr: Att_list
                }
            })
            .then((res) => {
                console.log("获取评论的昵称和头像成功！")
                this.setData({
                    avatarArr: res.result.avatarArr,
                    nickNameArr: res.result.nickNameArr
                })

            })
            .catch(console.error)

        this.setData({
            isShow: false
        })


    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.setData({
            att_list: [],
            nickNameArr: [],
            avatarArr: []
        })
        this.onLoad()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        console.log("分享函数被点击");
        let shareObj = {
            title: "校园打卡驿站",
            path: "../punchCard/punchCard",
            imageUrl: "../../images/shareImage.jpg",
        }
        return shareObj;
    }
})