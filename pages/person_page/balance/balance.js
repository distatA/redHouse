// pages/person_page/balance/balance.js
const app = getApp();
var common = require("../../../utils/common.js");
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
    this.myWallet()// 账户余额 
  },
// 账户余额 
  myWallet:function(){
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.request({
          url: app.globalData.URL + '/api/myWallet/details',
          data: {
            member_no: res.data.member_no,
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (data) {
           console.log(data.data)
            if (data.data.code==200){
             that.setData({
               balance: data.data.data.wallet.balance,//账户余额
               earnings: data.data.data.this_month_Money,//本月收益
               forecast: data.data.data.preMoney,//预估收益
             })
           }else if(data.data.code==401){
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
        })
      },
      fail: function () {
        // wx.hideLoading()
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
  },
// 提现 
tiXian:function(){
  var balance = this.data.balance;
  wx.navigateTo({
    url: '/pages/tiXian/tiXian?balance=' + balance,
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