// pages/phone/phone.js
const app = getApp();
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone: options.phone ? options.phone :''
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
  // 手机号码
  getphoneValue: function (e) {
    this.setData({
      phones: e.detail.value
    })
  },
  // 验证码
  getcode:function(e){
    this.setData({
      code: e.detail.value
    })
  },
  // 确定
  sure:function(e){
    var that = this;
    common.ajaxGet('/api/myMessage/valityMobile',
      {
        mobile: that.data.phones,
        code: that.data.code,
      },
      function (data) {
        if (data.code == 200) {
          
          wx.navigateTo({
            url: '/pages/myNews/myNews?phone=' + that.data.phones + '&type=' + 2,
          }) 
        }else{
          wx.showToast({
            title: data.message,
            icon:'none'
          })
        }
      })
    
  },
  // 发送验证码
  getNum() {
    var that = this;
    var phones = that.data.phones;
    if (phones) {
      if (common.check_phone(phones)) {
        wx.getStorage({
          key: 'idNum',
          success: function (res) {
            wx.showLoading({
              title: '验证码发送中...',
            });
            // console.log(res)
            common.ajaxGet('/api/sms/sendCode',
              {
                mobile: phones,
                tplCode: 'SMS_172975116',
              },
              function (data) {
                if (data.code == 200) {
                  wx.hideLoading();
                  // 60秒倒计时
                  var time = 60;
                  let down = setInterval(() => {
                    time -= 1;
                    if (time >= 0) {
                      that.setData({
                        time: time
                      })
                    } else if (time < 0) {
                      that.setData({
                        time: 0
                      })
                    }
                  }, 1000);
                  wx.showToast({
                    title: data.data,
                  })
                }
              })
          },
       
        })
      } else {
        wx.showToast({
          title: '手机号有误',
          icon: 'none'
        })
      }
    } else {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
    }
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
    clearInterval(this.data.down);
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