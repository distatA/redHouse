// pages/user/user.js
const app = getApp();
var common = require("../../utils/common.js");
var wxParser = require('../../wxParser/index.js');
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
      id:options.id,
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
    this.getNew()
  },
// 登陆协议
getNew:function(){
  var that = this;
  wx.request({
    url: app.globalData.URL + '/api/enjoy/file',
    data: {
      id: that.data.id,
    },
    method: 'GET',
    success: function (data) {
      // console.log(data.data)
      if (data.data.code == 200) {
        var article = data.data.data.content
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