// pages/hSeen/hSeen.js
var common = require("../../utils/common.js");
var amapFile = require('../../utils/amap-wx.js');
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
      shopId: options.shopId
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
    this.getSeens()
  },
  // 围观人数
  getSeens: function () {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        common.ajaxGet(
          '/api/house/listLook',
          {
            spu_no: that.data.shopId,
            pageIndex: 1,
            pageSize: 20
          },
          function (data) {
            console.log(data)
            if (data.code == 200) {
              that.setData({
                totalPeople: data.data.total,//总围观数
                listLook: data.data.list
              })
            }
          }
        )
      },
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var total = that.data.total;//总个数
    var pageSize = that.data.pageSize;//当前页个数
    if (pageSize < total) {

      pageSize = pageSize + 50;
      that.getSeens(pageSize)//红人好物 
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