import { Api } from "../../utils/api";
const api = new Api();
// pages/generatePic/generatePic.js
const app =  getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    actions: [
      {
        name: '保存小程序二维码'
      },
      {
        name: '分享小程序至群聊',
        openType: 'share'
      }
    ]
  },


  onClose() {
    this.setData({ show: false });
  },

  onCancel() {
    this.setData({ show: false });
  },

  onSelect(event) {
    console.log(event.detail.name);
    let _this = this;
    switch(event.detail.name) {
      case '保存小程序二维码':
        wx.cloud.downloadFile({
          fileID: 'cloud://avatar-1-9c32fb.6176-avatar-1-9c32fb/qr_code/WechatIMG175.png', // 文件 ID
          success: res => {
            // 返回临时文件路径
            let tempPath = res.tempFilePath
            console.log(tempPath);
            wx.saveImageToPhotosAlbum({
              filePath: tempPath,
              success(res) {
                // const savedFilePath = res.savedFilePath;
                api.showToast('保存成功', 'success');
                console.log(res);
                _this.onCancel()
              }
            })
          },
          fail: console.error
        })
        break;
      default:
        _this.onCancel()
        break;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    api.showLoading();
    console.log(app.globalData.picParam);
    let  {x,y,logoHeight, logoWidth, avatarHeight, avatarWidth, logoUrl, avatarUrl} = app.globalData.picParam;
    this.setData({
      canvasWidth: logoWidth,
      canvasHeight: logoHeight
    });
    const ctx = wx.createCanvasContext('avatarPic');
    ctx.drawImage(logoUrl, 0, 0, logoWidth, logoHeight);
    ctx.draw();
    ctx.save(); // 先保存状态 已便于画完圆再用
    ctx.beginPath(); //开始绘制
    //先画个圆
    ctx.arc(x + avatarWidth / 2, y + avatarHeight / 2 , avatarWidth / 2, 0, Math.PI * 2, false);
    ctx.clip();//画了圆 再剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内
    ctx.drawImage(avatarUrl, x, y, avatarWidth, avatarHeight);
    ctx.draw(true);
    

    api.hideLoading();
  },

  downloadPic() {
    api.saveCanvas('avatarPic')
      .then(res => {
        return api.saveImage(res.tempFilePath);
      })
      .then(res => {
        api.showToast('保存成功', 'success');
      });
  },

  share() {
    this.setData({
      show: true,
    });
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
  
 
  onShareAppMessage() {
    return {
      title: '我在这里制作了一个好看到校徽头像，你也来看看吧！',
      path: '/pages/index/index',
    }
  },
})