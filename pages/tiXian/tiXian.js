// pages/tiXian/tiXian.js
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
      balance: options.balance ? options.balance : 0,
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
//输入框
  getInputValue:function(e){
    // console.log(e)
    var value = e.detail.value;
    this.setData({
      value:value
    })
  },
//提现
  tijiao:function(){
    var that = this;
    var value = that.data.value;
    console.log(value)
    if( value !=undefined){
      wx.getStorage({
        key: 'idNum',
        success: function (res) {
          wx.request({
            url: app.globalData.URL + '/api/myWallet/wxChatCash',
            data: {
              member_no: res.data.member_no,
              money: value
            },
            method: 'POST',
            header: {
              "token": res.data.token,
              'content-type': 'application/json'
            },
            success: function (data) {
              //  console.log(data)
              if (data.data.code == 200) {                
                  wx.showToast({
                    title: '已提交提现申请',
                  })
                  setTimeout(function(){
                    wx.navigateBack({})
                  },1500) 
              }else{
                wx.showToast({
                  title: data.data.message,
                  icon:'none'
                })
              }

            }
          })
        }
      })
    }else{
      wx.showToast({
        title: '请输入提现金额',
        icon:'none'
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