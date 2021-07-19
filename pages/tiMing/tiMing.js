// pages/tiMing/tiMing.js
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
    this.jilu()
  },
  // 提现记录
  jilu: function (pageSize=15){
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.request({
          url: app.globalData.URL + '/api/myWallet/cashList',
          data: {
            memberNo: res.data.member_no,
            pageIndex: 1,
            pageSize: pageSize
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (res) {
             console.log(res.data.data.list)
            if (res.data.code == 200) {
              let list = res.data.data.list
              // list.forEach((v) => {
              //   let times = (new Date(v.create_time.replace(/-/g, "/"))).getTime();
              //   v.create_time = common.myTime(times + 28800000)
              // });
             that.setData({
               list,
               pageSize: res.data.data.pageSize,
               total: res.data.data.total
             })
            }
          }
        })
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
    let that = this;
    var total = this.data.total;//总页数
    var pageSize = this.data.pageSize;//当前页
    if (pageSize < total) {
      pageSize = pageSize + 50;
      that.jilu(pageSize)//红人好物 
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