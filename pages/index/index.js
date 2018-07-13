//index.js
//获取应用实例
const app = getApp()


Page({
  data: {
      avatarUrl: "https://zouxiaoming.xyz:8443/images/152799490334logo.png",
      buttonSize: 'default',
      loadingHidden: true,
      downloadLoadingHidden:true
  },
  
  onLoad: function () {
    
  },
  openAlbum: function () {
      var that = this;
      wx.chooseImage({
          success: function(res) {
              var tempFilePaths = res.tempFilePaths;
              that.setData({
                  loadingHidden: false
              });
              wx.uploadFile({
                  url: 'https://zouxiaoming.xyz:8443/avatar_change/saveHeaderPic',
                  filePath: tempFilePaths[0],
                  name: 'file',
                  success: function(res) {
                      var data = JSON.parse(res.data);
                      var avatar_url = 'https://zouxiaoming.xyz:8443/avatar_change/images/' + data.url;
                      that.setData({
                          loadingHidden: true,
                          avatarUrl: avatar_url
                      });
                      wx.showToast({
                          title: '图片上传成功',
                          icon: 'succes',
                          duration: 2000,
                          mask: true
                      });
                  },
                  fail: function() {
                      wx.showToast({
                          title: '图片上传失败',
                          icon: 'none',
                          duration: 2000,
                          mask: true
                      });
                  }
                  
              })
          },
      })
  },
  // 导出图片
  exportPic: function () {
      var that = this;
      this.setData({
          downloadLoadingHidden: false
      })
      wx.downloadFile({
          url: this.data.avatarUrl,
          success: function(res) {
              console.log(res);
              wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: function(res) {
                      console.log('success');
                      that.setData({
                          downloadLoadingHidden: true
                      });
                      wx.showToast({
                          title: '保存成功',
                          icon: 'succes',
                          duration: 2000,
                          mask: true
                      });
                  }
              })
          },
          fail: function() {
                  wx.showToast({
                      title: '图片下载失败',
                      icon: 'none',
                      duration: 2000,
                      mask: true
                  });
          }
      })
  }
    
})
