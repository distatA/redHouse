// pages/cardDetail/cardDetail.js
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
      type:options.type,// 1 从商家近来 2 从我的黑卡进来
      order_no: options.order_no ? options.order_no:'',
      imgs: options.imgs ? JSON.parse(options.imgs) : '',
      instructions: options.instructions,
      rights:options.rights,
      checkStatus: options.checkStatus,//0未核销 1已核销
      title: options.title,
    })
    wx.setNavigationBarTitle({
      title: options.title,
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
    console.log(this.data.type)
    var that = this;
    if (that.data.type==2){
      that.getCode()
      // that.setData({
      //   template: that.palette(),
      // })
    }
  },
  // 获取条形码
  getCode(){
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.request({
          url: app.globalData.URL + '/api/myCard/getCode',
          data: {
            order_no: that.data.order_no,
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (res) {
              
            if(res.data.code==200){
              that.setData({
                codeImg: "data:image/png;base64," +res.data.data,//拼接base64
              })
            }
            
          }
        })
      }

    })
  },
  // 点击刷新
  brechen: common.throttles(function(e){
    this.getCode()
  },1000*60*4),
    
    
  palette(){
    return({
      width: '400rpx',
      height: '300rpx',
      views:[{
          type: 'image',
          url: 'http://47.111.109.201/api/myCard/getCode?order_no=' + this.data.order_no,
          css: {
            width: '400rpx',
            height: '300rpx',
            top: `0px`,
            left: `0px`,
          },
        
      }]
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
  // onShareAppMessage: function () {

  // }
})