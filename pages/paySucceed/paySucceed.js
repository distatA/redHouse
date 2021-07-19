// pages/paySucceed/paySucceed.js
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
    // console.log(options.spu)
    this.setData({
      payment: options.payment,
      numbers: options.numbers,
      spu: options.spu ? options.spu : '',//房产spu
      status: options.status ? options.status : 0,//1-房产支付 2-实体 3-虚拟
      isKill: options.isKill ? options.isKill:false,//true 秒杀
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
    if (this.data.status == 1 && !this.data.isKill){//房产才调用
      this.huoseCode()
    }
  },
// 房产群二维码
huoseCode:function(){
  var that = this;
  // console.log(that.data.spu)
  common.ajaxGet(
    '/api/goods/showQr',
    { spu_no: that.data.spu},
    function(res){
      if(res.code==200){
        that.setData({
          huoseCode:res.data
        })
      }
    }
  )
},
// 查看订单
  order:function(){
    var that= this;
    wx.navigateTo({
      url: '/pages/person_page/orders/orders' 
    })
  },
// 返回首页
  backHome:function(){
    wx.switchTab({
      url: '/pages/home/home',
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