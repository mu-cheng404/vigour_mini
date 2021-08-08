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
    _handerTap: function (evt) {
        wx.navigateTo({
            url: '../punchEdit/punchEdit?type='+evt.currentTarget.id,
            success: (result) => {

            },
            fail: () => {},
            complete: () => {}
        });
    },
    /**
     * 页面的初始数据
     */
    data: {
        imageURL: "cloud://wu-env-5gq7w4mm483966ef.7775-wu-env-5gq7w4mm483966ef-1306826028/images/",
        punchCategoryArray: [{
            pictureSrc: "../../images/zaoqi.png",
            categoryText: "早起",
        }, {
            pictureSrc: "../../images/xuexi.png",
            categoryText: "学习",
        }, {
            pictureSrc: "../../images/yundong.png",
            categoryText: "运动",
        }, {
            pictureSrc: "../../images/dushu.png",
            categoryText: "读书",
        }, {
            pictureSrc: "../../images/zaoshui.png",
            categoryText: "早睡",
        }, {
            pictureSrc: "../../images/jiankang.png",
            categoryText: "健康",
        }, {
            pictureSrc: "../../images/heshui.png",
            categoryText: "喝水",
        }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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