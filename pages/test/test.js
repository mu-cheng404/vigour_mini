Page({

    data: {
        fileList: [{
                uid: 0,
                status: 'uploading',
                url: 'http://cdn.skyvow.cn/qrcode.jpg',
            },
            {
                uid: 1,
                status: 'done',
                url: 'http://cdn.skyvow.cn/qrcode.jpg',
            },
            {
                uid: 2,
                status: 'error',
                url: 'http://cdn.skyvow.cn/qrcode.jpg',
            }
        ],
    },
    onLoad: function () {
        // console.log("已加载")
        // wx.cloud.database().collection("user").where({}).update({
        //     data: {
        //         label: [{
        //             main: "学习",
        //             second: ["读书", "练字", "考研", "考证", "考级", "背单词"]
        //         }, {
        //             main: "生活",
        //             second: ["早睡", "早起", "健身", "护肤", "心情"]
        //         }, {
        //             main: "运动",
        //             second: ["跑步", "行走", "骑行", "瑜伽", "冥想", "动作"]
        //         }, {
        //             main: "其他",
        //             second: ["写作", "成长", "工作", "手工", "手账"]
        //         }]
        //     }
        // }).then((res) => {
        //     console.log("添加完成", res)
        // })
    },
    onChange(e) {
        // console.log('onChange', e)
        const {
            file,
            fileList
        } = e.detail
        if (file.status === 'uploading') {
            this.setData({
                progress: 0,
            })
            wx.showLoading()
        } else if (file.status === 'done') {
            this.setData({
                imageUrl: file.url,
            })
        }

        // Controlled state should set fileList
        this.setData({
            fileList
        })
    },
    onSuccess(e) {
        // console.log('onSuccess', e)
    },
    onFail(e) {
        // console.log('onFail', e)
    },
    onComplete(e) {
        // console.log('onComplete', e)
        wx.hideLoading()
    },
    onProgress(e) {
        // console.log('onProgress', e)
        this.setData({
            progress: e.detail.file.progress,
        })
    },
    onPreview(e) {
        // console.log('onPreview', e)
        const {
            file,
            fileList
        } = e.detail
        wx.previewImage({
            current: file.url,
            urls: fileList.map((n) => n.url),
        })
    },
    onRemove(e) {
        const {
            file,
            fileList
        } = e.detail
        wx.showModal({
            content: '确定删除？',
            success: (res) => {
                if (res.confirm) {
                    this.setData({
                        fileList: fileList.filter((n) => n.uid !== file.uid),
                    })
                }
            },
        })
    },
})