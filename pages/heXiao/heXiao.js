// pages/heXiao/heXiao.js
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
      spu_no: options.spu ? options.spu: '',
      my_order_no: options.my_order_no
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
    this.getCode()//核销码
  },
//核销码
getCode:function(){
  var that = this;
  wx.getStorage({
    key: 'idNum',
    success: function (res) {
     common.ajaxGet(
       '/api/myOrder/houseCheckCode',
       {
         my_order_no: that.data.my_order_no,
         spu_no:that.data.spu_no
       },
       function(res){
         if(res.code==200){
           that.setData({
             startTime: (res.data.startTime).split(' ')[0],
             endTime: (res.data.endTime).split(' ')[0],
             name:res.data.name,
             houseCode: res.data.houseCode,
             codeImg: "data:image/png;base64," + res.data.hx_url,//拼接base64
           })
         }
       }
     )
    },
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