import { Api } from "../../utils/api";
const api = new Api();
//Page Object
var app = getApp();
Page({
  data: {
    buttonLoading: false,
  },

  /**
   *
   * @param {object} e 事件对象
   */
  bindGetUserInfo: function (e) {
    if (!e.detail.userInfo) {
      api.showToast('您取消了授权');
      return;
    }
    wx.setStorageSync('userInfo', e.detail.userInfo)
    this.onGetOpenid();
  },

  onGetOpenid: function () {
    let _this = this;
    _this.setData({
      buttonLoading: true
    });
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        // 提示授权成功
        api.showToast('授权成功', 'success');
        _this.setData({
          buttonLoading: false
        });
        api.pathTo('/pages/index/index', 'redirect');
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        // 授权失败
        api.showToast('授权失败，请检查网络！');
        _this.setData({
          buttonLoading: false
        });
      }
    })
  },
}); 