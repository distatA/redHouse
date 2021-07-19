// pages/huoseOrder/huoseOrder.js
const app = getApp();
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search: '',
    menuList: [{
      name: "全部", num: 0
    },
    {
      name: "待付款", num: 10
    },
    {
      name: "待使用", num: 20
    },
    {
      name: "已成功", num: 50
    },
    ], 
    tabScroll: 0,
    currentTab: 0,
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
// 菜单点击切换
  clickMenu: function (e) {
    var current = e.currentTarget.dataset.current //获取当前tab的index
    var type = e.currentTarget.id;
    var oLeft = e.currentTarget.offsetLeft;
    // if (oLeft > 200) {
    //   this.setData({
    //     left: oLeft - 70,
    //   })
    // } else {
    //   this.setData({
    //     left: 0,
    //   })
    // }
    if (this.data.currentTab == current) {
      return false
    } else {
      this.setData({ currentTab: current })
    }

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