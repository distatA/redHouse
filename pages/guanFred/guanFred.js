// pages/guanFred/guanFred.js
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
      shopId: options.spu
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
    this.getRedList() //官方红人
  },
  //官方红人
  getRedList: function (pageSize=50) {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        common.ajaxGet(
          '/api/enjoy/officeList',
          {
            spu_no: that.data.shopId,
            pageIndex: 1,
            pageSize: pageSize,
            member_no: res.data.member_no
          },
          function (data) {
            console.log(data)
            if (data.code == 200) {
              that.setData({
                redList: data.data.list
              })
            }
          }
        )
      },
    })
  },
  // 拨打电话
  callings: function (e) {
    var phone = e.currentTarget.id;
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  // 关注
  guanZhu: function (e) {
    // console.log(e)
    var that = this;
    var flag = e.currentTarget.id;
    var member = e.currentTarget.dataset.id;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        console.log(res.data.member_no);
        wx.request({
          url: app.globalData.URL + 'api/redAndOfficeGroup/follow',
          data: {
            member_no_me: res.data.member_no,
            member_no_other: member,
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(flag)
            if (res.data.code == 200 && flag == 0) {
              wx.showToast({
                title: '关注成功',
              })
            } else if (res.data.code == 200 && flag == 1) {
              wx.showToast({
                title: '取消关注',
                icon: 'none'
              })
            } else if (res.data.code == 500) {
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              })
            }
            that.getRedList()//红人列表
          }
        })
      },
    })
  },
  // 红人店铺
  redShop: function (e) {
    // console.log(e)
    var member = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/redHome/redHome?member=' + member,
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