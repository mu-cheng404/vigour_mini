const util = require("../../common/util")
var isLogIn


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
        }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        isLogIn = await util.queryLogIn()

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

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