// pages/search/search.js
import {Api} from '../../utils/api';
const api = new Api();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchHistoryList: [],
    isSearch: false,
    keyWord: '',
    curPage: 1,
  },

  /**
   * 通过关键词来搜索
   */
  search: function (keyWord, sign=1) {
    api.showLoading('加载中...', false);
    let _this = this;
    var goodsList = _this.data.goodsList;
    if (!goodsList) {
      goodsList = [];
    }
    var haveSame = false;
    // 将关键字插入搜索历史缓存
    var historyList = _this.data.searchHistoryList;
    for (let i = 0; i < historyList.length; i++) {
      if (keyWord == historyList[i]) {
        haveSame = true;
      }      
    }
    if (!haveSame) {
      historyList.push(keyWord);
    }
    api.setStorage('searchHistory', historyList)
      .then(res => {
        // 更新数据
        _this.setData({
          searchHistoryList: historyList,
          isSearch: true,
          keyWord: keyWord,
        });
      });
    
  },

  
  /**
   * 删除搜索记录
   */
  deleteHistroy: function () {
    let _this = this;
    var list = [];
    api.showModal('提示', '确认删除搜索记录？', true, '取消', 
      '#888888', '确定', '#f74a50')
      .then(res => {
        if (res.confirm) {
          _this.setData({
            searchHistoryList: list
          });
          return api.setStorage('searchHistory', list);
        }
      })
  },

  /**
   * 监听输入值
   */
  onInput: function (e) {
    var keyWord = api.getInputContent(e);
    console.log(e);
    
  },

  /**
   * 输入框搜索
   */
  onSearch: function (e) {
    this.searchByKeyWord(api.getInputContent(e));
  },

  /**
   * 清空内容
   */
  onClear: function () {
    let _this = this;
    _this.setData({
      isSearch: false,
      curPage: 1,
      pageSize: 20,
      hasMore: true,
      goodsList: []
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      hasChecked: getApp().globalData.hasChecked
    })
    let _this = this;
    // 获取搜索历史，如果没有缓存，则初始化缓存
    api.getStorage('searchHistory')
      .then(res => {
        _this.setData({
          searchHistoryList: res.data
        });
      })
      .catch(res => {
        // 初始化缓存
        let searchHistoryList = [];
        api.setStorage('searchHistory', searchHistoryList);
      });
    
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let {hasMore, keyWord, isSearch} = this.data;
    if (hasMore && isSearch) {
      let curPage = this.data.curPage + 1;
      this.setData({
        curPage: curPage
      });
      this.searchByKeyWord(keyWord);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})