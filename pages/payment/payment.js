// pages/payment/payment.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsOrderInfo:{
      count_num:1,
      member_no:'7ED2CCF4FF1A41019EC6D5612B030AFB',
      pay_method:1,
      send_method:0,
      address_id:1,
      total_money:0.01,
      send_money:0,
      payment:0.01,
      type:2,
      openId:'oZK7X5bz7s4hJVppta4VC-hgsuwI',
      orderProductList:[
        {
          spu_no: 'affjjj',
          sku_no:'88888',
          shop_id:1,
          shop_name:'35445531',
          good_name:'耳机',
          num:1,
          price:0.01,
          total_money:0.01
        }
      ]
    }
  },

  pay:function(){
    var that = this;
    
    wx.getStorage({
      key: 'idNum',
      success: function(res) {
        wx.request({
          url: app.globalData.URL + '/api/goods/goodsOrder',
          data:JSON.stringify(that.data.goodsOrderInfo),
          method: 'POST',
          header: {
            "token": res.data.token,
            "Content-Type": "application/json"
          },
          success:function(response){
            let result = response.data.data.wxPayMpOrderResult;
            console.log(response.data.data);
            if(response.data.data){
              wx.requestPayment({
                'timeStamp': result.timeStamp,
                'nonceStr': result.nonceStr,
                'package': result.packageValue,
                'signType': result.signType,
                'paySign': result.paySign,
                'success':function(res){
                  console.log(res);
                  console.log("支付成功");
                },
                'fail': function (res) { 
                  console.log(res);
                },
              })
            }
          }
        })
      },
    })
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