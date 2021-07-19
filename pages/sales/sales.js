// pages/sales/sales.js
const app = getApp();
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type ? options.type: 0,//1 预估收益
    })
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
    this.getShare()//分销
  },
//分销
  getShare: function (pageSize=50){
  var that =this;
 
  if(that.data.type ==1 ){
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
      
        common.ajaxGet(
          '/api/myWallet/myForeCast',
          {
            member_no: res.data.member_no,
            searchName: that.data.searchValue != undefined ? that.data.searchValue : '',
            pageIndex: 1,
            pageSize: pageSize,
          },
          function (data) {
            console.log('52',data)
            if (data.code == 200) {
              that.setData({
                shareList: data.data.list,
                pageSize: data.data.pageSize,
                total: data.data.total
              })
            }else if(data.code==401){
              wx.clearStorageSync()//清除本地缓存
              wx.showModal({
                content: '登陆超时，请重新登陆',
                success(res) {
                  if (res.confirm) {
                    wx.switchTab({
                      url: '/pages/personal/personal',
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          }
        )
      },
      fail: function () {
  
        wx.showModal({
          content: '您尚未登陆，请先登陆',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/personal/personal',
              })
            } else if (res.cancel) {
              wx.navigateBack({

              })
            }
          }
        })
      }
    })
  }else{
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.hideLoading();
        common.ajaxGet(
          '/api/myShare/myShareList',
          {
            member_no: res.data.member_no,
            searchName: that.data.searchValue != undefined ? that.data.searchValue : '',
            pageIndex: 1,
            pageSize: pageSize,
          },
          function (data) {
            console.log(data)
            if (data.code == 200) {
              that.setData({
                shareList: data.data.list,
                pageSize: data.data.pageSize,
                total: data.data.total
              })
            }
          }
        )
      },
      fail: function () {
        wx.hideLoading()
        wx.showModal({
          content: '您尚未登陆，请先登陆',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/personal/personal',
              })
            } else if (res.cancel) {
              wx.navigateBack({

              })
            }
          }
        })
      }
    })
  }
 
},
//输入框
  getInputValue:function(e){
    // console.log(e)
    this.setData({
      searchValue: e.detail.value
    })
  },
// 搜索
  toSearch:function(){
    this.getShare()//分销
  },
  searchHandle:function(){
    this.toSearch()
  },
//取消
  cancel:function(){
    this.getShare()
    var that = this;
    that.setData({
      searchValue:''
    })
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
    this.getShare()//分销
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    var total = this.data.total;//总页数
    var pageSize = this.data.pageSize;//当前页
    if (pageSize < total) {
      pageSize = pageSize + 50;
      that.getShare(pageSize)//红人好物 
    } else {
      wx.showToast({
        title: "我是有底线的",
        icon: "none"
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})