import {
  Api
} from "../../utils/api";
const api = new Api();
//index.js
const app = getApp()
const cloudPath = 'cloud://avatar-1-9c32fb.6176-avatar-1-9c32fb/logo/'
var videoAd = null;


Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    logoUrl: '',
    x: 40,
    y: 40,
    logoWidth: 250,
    logoHeight: 250,
    designX: 40,
    designY: 40,
    designAvatarWidth: 170,
    designAvatarHeight: 170,
    avatarHeight: 170,
    avatarWidth: 170,
    showModal: true,
    inputShowed: false,
    inputVal: "",
    processing: [],
    hiddenSearchRes: true,
    searchLogoList: []
  },

  avatarChange(e) {
    console.log(e);
    var x = e.detail.x;
    var y = e.detail.y;



    this.setData({
      designX: x,
      designY: y
    });

  },

  avatarScale(e) {
    console.log(e);
    console.log(e);
    var {
      avatarHeight,
      avatarWidth
    } = this.data;
    var x = e.detail.x;
    var y = e.detail.y;
    var scale = e.detail.scale;
    this.setData({
      designX: x,
      designY: y,
      designAvatarHeight: avatarHeight * scale,
      designAvatarWidth: avatarWidth * scale
    });

  },

  selectImage(e) {
    console.log(e);
    let src = e.target.dataset.src;
    this.setData({
      logoUrl: src,
      hiddenSearchRes: true
    });
    app.globalData.logoUrl = src;
  },

  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false,
      hiddenSearchRes: true,
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: "",
      hiddenSearchRes: true,
    });
  },
  inputTyping: function(e) {
    wx.showNavigationBarLoading();
    var _this = this;
    var keyWord = e.detail.value;
    if (keyWord == '') {
      this.setData({
        hiddenSearchRes: true
      });
      wx.hideNavigationBarLoading();
      return;
    }
    console.log(keyWord);
    const db = wx.cloud.database()
    db.collection('c_logo').where({
      name: db.RegExp({
        regexp: keyWord,
      })
    }).limit(10).get({
      fail(res) {
        console.log(res);

      },
      success(res) {
        console.log(res);
        var list = [];
        for (let i = 0; i < res.data.length; i++) {
          const element = res.data[i];
          list.push(cloudPath.concat(element.logo));
        }
        console.log(list);
        // 获取 logo 图片
        wx.cloud.getTempFileURL({
          fileList: list
        }).then(res => {
          let fileList = res.fileList;
          console.log(fileList);
          _this.setData({
            searchLogoList: fileList,
            hiddenSearchRes: false
          });
          wx.hideNavigationBarLoading();
        })
      }
    })
  },

  copyWechatNumber() {
    wx.setClipboardData({
      data: 'zmy1349571206',
      success: (result) => {
        api.showToast('已复制', 'success');
      },
      fail: () => {},
      complete: () => {}
    });
  },


  onLoad: function(options) {
    let _this = this;
    wx.showNavigationBarLoading();
    let logoUrl = app.globalData.logoUrl;
    if (logoUrl == '') {
      // 获取 logo 图片
      wx.cloud.getTempFileURL({
        fileList: [`${cloudPath}1002.png`]
      }).then(res => {
        let fileList = res.fileList;
        // get temp file URL
        console.log(res.fileList)
        let logoUrl = fileList[0].tempFileURL;
        _this.setData({
          logoUrl: logoUrl
        })
        wx.hideNavigationBarLoading();
      }).catch(error => {
        // handle error
        api.showLoading('请求超时！');
        wx.hideNavigationBarLoading();
      })
    } else {
      this.setData({
        logoUrl: logoUrl
      });
    }

    if (options.avatar) {
      this.setData({
        avatarUrl: options.avatar
      });
      return;
    }
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              let avatar = _this.headimgHD(res.userInfo.avatarUrl);
              api.getImageInfo(avatar)
                .then(res => {
                  _this.setData({
                    avatarUrl: res
                  })
                })
            }
          })
        } else {
          api.pathTo('/pages/auth/auth', 'redirect');
        }
      }
    })

    if (wx.createRewardedVideoAd) {
      // 加载激励视频广告
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-97638f5f7c37acab'
      })
      //捕捉错误
      videoAd.onError(err => {
        api.showToast(err.errCode);
        // 正常使用
        // 正常播放结束，下发跳转
        api.pathTo(`/pages/generatePic/generatePic`);
      })
      // 监听广告关闭
      videoAd.onClose((status) => {
        if (status && status.isEnded || status === undefined) {
          // 正常播放结束，下发跳转
          api.pathTo(`/pages/generatePic/generatePic`);
        } else {
          // 播放中途退出，进行提示
          wx.showModal({
            title: '提示',
            content: 'Sorry...您需要看完视频才能生成头像～',
            showCancel: true,
            cancelText: '劳资就不',
            confirmText: '盘它',
            success(res) {
              if (res.confirm) {
                videoAd.load()
                  .then(() => videoAd.show())
                  .catch(err => console.log(err.errMsg))
              }
            }
          })
        }
      })
    }
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  openSearch() {
    api.pathTo('/pages/search/search', 'nav');
  },

  // 上传头像
  uploadAvatar() {
    api.chooseImage()
      .then(res => {
        console.log(res);
        let avatarUrl = res.tempFilePaths[0];
        api.pathTo(`/pages/cropper/cropper?src=${avatarUrl}`, 'redirect')
      });
  },

  // 生成图片
  generatePic() {
    let {
      designX,
      designY,
      logoHeight,
      logoWidth,
      designAvatarHeight,
      designAvatarWidth,
      logoUrl,
      avatarUrl
    } = this.data;

    api.showLoading();
    wx.getImageInfo({
      src: logoUrl,
      success: (result) => {
        console.log(result);
        let logoTempPath = result.path;
        let picParam = {
          x: designX,
          y: designY,
          logoHeight: logoHeight,
          logoWidth: logoWidth,
          avatarHeight: designAvatarHeight,
          avatarWidth: designAvatarWidth,
          logoUrl: logoTempPath,
          avatarUrl: avatarUrl
        }
        app.globalData.picParam = picParam;
        api.hideLoading();
      },
      fail: () => {},
      complete: () => {}
    });

    // 进行提示展示广告
    wx.showModal({
      title: '提示',
      content: '您需要观看一段视频生成头像～',
      confirmText: '盘它',
      cancelText: '劳资就不',
      success(res) {
        if (res.confirm) {
          videoAd.show().catch(err => {
            // 失败重试
            videoAd.load()
              .then(() => videoAd.show())
          })
        }
      }
    })
  },

  onShareAppMessage() {
    return {
      title: '我在这里制作了一个好看到校徽头像，分享给你！',
      path: '/pages/index/index',
      imageUrl: '/images/share_image.jpg'
    }
  },

  headimgHD(imageUrl) {
    console.log('原来的头像', imageUrl);

    imageUrl = imageUrl.split('/'); //把头像的路径切成数组

    //把大小数值为 46 || 64 || 96 || 132 的转换为0
    if (imageUrl[imageUrl.length - 1] && (imageUrl[imageUrl.length - 1] == 46 || imageUrl[imageUrl.length - 1] == 64 || imageUrl[imageUrl.length - 1] == 96 || imageUrl[imageUrl.length - 1] == 132)) {
      imageUrl[imageUrl.length - 1] = 0;
    }

    imageUrl = imageUrl.join('/'); //重新拼接为字符串

    console.log('高清的头像', imageUrl);

    return imageUrl;
  }

})