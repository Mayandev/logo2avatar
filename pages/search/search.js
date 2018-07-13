/**
 * TODO:onload中加载所有正在进行的活动，在Typing中进行过滤，不用一遍一遍查询服务器
 */
var config = require('../../config.js');
Page({
    data: {
        showModal : true,
        inputShowed: false,
        inputVal: "",
        processing:[]
    },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        var that = this;
        that.setData({
            inputVal: e.detail.value
        });
        // 
        wx.request({
            url: config.url + '/avatar_change/search',
            method: 'POST',
            data:{
                'name': e.detail.value
            },
            success: function (res) {
                console.log(res);
                that.setData({
                    processing: res.data
                });

            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // var that = this;
        // wx.request({
        //     url: config.url + '/activity/getall',
        //     method: 'POST',
        //     success: function (res) {
        //         that.setData({
        //             processing: res.data.processing
        //         });
        //     }
        // })
    },
});