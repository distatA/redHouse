// pages/cardorder/cardorder.js
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
      id : options.id,
      img : options.img,
      name : options.name,
      first: options.first,
      present : options.present,
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

  },
  // 微信支付
  weiPay: common.throttle(function (e) {
    var that = this;
    var orderArr = [];

    // wx.showLoading({
    //   title: "加载中",
    //   mask: true
    // });
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        common.ajaxGet('/api/myCard/create',
          {
            member_no: res.data.member_no,
            id: that.data.id,
          },
          function (data) {
            wx.hideLoading();
            if (data.code == 200) {
              //  调用微信支付
             
              let result = data.data;
              console.log(result)
              if (result) {
                wx.requestPayment({
                  'timeStamp': result.timeStamp,
                  'nonceStr': result.nonceStr,
                  'package': result.packageValue,
                  'signType': result.signType,
                  'paySign': result.paySign,
                  'success': function (res) {
                    console.log(res);
                    wx.navigateTo({
                      url: '/pages/paySucceed/paySucceed?payment=' + that.data.payment + '&numbers=' + that.data.numbers + '&spu=' + that.data.spu + '&status=' + that.data.status,
                    })
                  },
                  
                })
              }

            } else {
              wx.showToast({
                title: '支付失败',
                icon: 'none',
              })
             
            }

          })
      }
    })
  }, 1000),
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
  onShareAppMessage: function () {

  }
})