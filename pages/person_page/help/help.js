// pages/home_page/help/help.js
const app = getApp();
var common = require("../../../utils/common.js");
var wxParser = require('../../../wxParser/index.js');
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
    this.getReason()  // 客户电话
    this.getWnti()// 常见问题
  },
  // 常见问题
  getWnti: function () {
    var that = this;
    common.ajaxGet(
      '/api/enjoy/file', { id: 9 },
      function (res) {
        if (res.code == 200) {
          var article = res.data.content
          console.log(article)
          if (article) {
            wxParser.parse({
              bind: 'article',
              html: article,
              target: that
            });
          }  

        }
      }
    )
  },
  // 客户电话
  getReason: function () {
    var that = this;
    common.ajaxPost(
      '/api/itemAndDetail/getItemDetail', { itemName: '客服热线' },
      function (res) {
        if (res.code == 200) {
          that.setData({
            phone: res.data[0].item_detail
          })

        }
      }
    )
  },
  // 拨打电话
  calling: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})