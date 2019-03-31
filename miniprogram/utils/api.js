

// 基础类
/**
 * 基础方法库
 */
class Api {

  /**
   * 跳转到指定的路径
   * @param {string} path 跳转路径
   * @param {string} type 跳转类型
   */
  pathTo(path, type = 'nav') {
    if (type == 'nav') {
      wx.navigateTo({
        url: path
      });
    } else if (type == 'tab') {
      wx.switchTab({
        url: path
      });
    } else if (type == 'redirect') {
      wx.redirectTo({
        url: path
      });
    } else if (type == 'relaunch') {
      wx.reLaunch({
        url: path
      });
    } else if (type == 'navBack') {
      wx.navigateBack({
        delta: 1
      });
    }
  }

 
  /**
   * 显示toast
   * @param {string} title toast标题
   * @param {string} type toast类型
   * @param {number} duration toast时长
   * @param {boolean} mask 是否显示遮罩
   */
  showToast(title, type = 'none', duration = 2000, mask = false) {
    wx.showToast({
      title: title,
      icon: type,
      duration: duration,
      mask: mask
    });
  }

  /**
   * 显示加载中
   * @param {string} title 标题
   */
  showLoading(title = '加载中...', mask=true) {
    wx.showLoading({
      title: title,
      mask: true
    });
  }

  /**
   * 隐藏loading
   */
  hideLoading() {
    wx.hideLoading();
  }

  /**
   * 显示模态框
   * @param {string} title 模态框标题
   * @param {string} content 模态框内容
   * @param {boolean} showCancel 是否显示取消按钮
   * @param {string} cancelText 取消文字 
   * @param {string} cancelColor 取消文字颜色
   * @param {string} confirmText 确认文字
   * @param {string} confirmColor 确认文字颜色
   */
  showModal(title, content, showCancel = true, cancelText = '取消',
    cancelColor = '#888888', confirmText = '确认', confirmColor = '#ed712d') {
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: title,
        content: content,
        showCancel: showCancel,
        cancelText: cancelText,
        cancelColor: cancelColor,
        confirmText: confirmText,
        confirmColor: confirmColor,
        success: (res) => {
          resolve(res);
        },
        fail: () => {
          reject('failed')
        }
      });
    });
  }

  /**
   * 修改导航栏背景颜色
   * @param {string} backColor 背景颜色
   */
  setNaviBarColor(frontColor, backColor) {
    wx.setNavigationBarColor({
      frontColor: frontColor,
      backgroundColor: backColor,
      animation: {
        duration: 300,
        timingFunc: 'linear'
      }
    });
  }

  /**
   * 选择相册图库或者拍照
   * @param {string} target 选择打开方式 
   * @param {number} count 选择图库的数量
   */
  chooseImage(count=1) {
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: count,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'], // 'album','camera'
        success: (res) => {
          resolve(res);
        },
        fail: () => {
          reject('取消选图');
        },
        complete: () => {}
      });
    });
  }

  

  /**
   * 设置缓存
   * @param {string} key 键值
   * @param {object} data 存储数据对象
   */
  setStorage(key, data) {
    return new Promise((resolve, reject) => {
      wx.setStorage({
        key: key,
        data: data,
        success: (res) => {
          resolve(res);
        },
        fail: () => {
          reject('fail');
        },
        complete: () => {}
      });
    });
  }


  /**
   * 从本地缓存中异步获取指定 key 的内容
   * @param {string} key 本地缓存中指定的 key
   */
  getStorage(key) {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key: key,
        success: (res) => {
          resolve(res);
        },
        fail: (res) => {
          reject(res);
        },
        complete: () => {}
      });
    });
  }


  /**
   * 获得图片信息
   * @param {string} src 图片url
   */
  getImageInfo(src) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: src,
        success: (res) => {
          resolve(res);
        },
        fail: () => {
          reject('fail')
        },
        complete: () => {}
      });
    });
  }

  /**
   * 保存画布为临时图片
   * @param {string} canvasId 画布id
   * @param {string} fileType 文件格式
   * @param {number} quality 图片质量
   */
  saveCanvas(canvasId, fileType = 'jpg', quality = 1.0) {
    return new Promise((resolve, reject) => {
      wx.canvasToTempFilePath({
        canvasId: canvasId,
        fileType: fileType,
        quality: quality,
        success: (res) => {
          resolve(res);
        },
        fail: () => {
          reject('save canvas failed');
        },
        complete: () => {}
      }, this);
    });
  }

  /**
   * 保存图片至手机相册
   * @param {string} filePath 图片路径
   */
  saveImage(filePath) {
    return new Promise((resolve, reject) => {
      wx.saveImageToPhotosAlbum({
        filePath: filePath,
        success: (res) => {
          resolve(res);
        },
        fail: () => {
          reject('save image failed');
        },
        complete: () => {

        }
      });
    });
  }


  /**
   * 拨打电话 
   * @param {string} telNumber 电话号码
   */
  makePhoneCall(telNumber) {
    wx.makePhoneCall({
      phoneNumber: telNumber
    });
  }


  /**
   * 封装网络请求，使用Promise简化回调
   * @param {object} param 
   */
  request(param, url, method = "GET") {
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: param,
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: method,
        dataType: 'json',
        responseType: 'text',
        success: (res) => {
          resolve(res)
        },
        fail: () => {
          reject('请求超时')
        },
        complete: () => {}
      });
    });
  }


  /**
   * 上传文件
   */
  uploadFile(url, filePath, name, formData) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: url,
        filePath: filePath,
        name: name,
        formData: formData,
        success: (res) => {
          resolve(res);
        },
        fail: () => {
          reject('请求超时');
        },
        complete: () => {}
      });
    });
  }

  // 获取图片临时路径;
  getImageInfo(src) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: src,
        success: (res)=>{
          resolve(res.path);
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    });
  }

};



export {
  Api
};