// pages/backSubmit/backSubmit.js
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
      id:options.id,
      status: options.status
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
//退款申请结果状态
  record:function(){
    var status = this.data.status;
    if (status==20 || 70){
      wx.navigateTo({//仅退款详情
        url: '/pages/backOrderStatus/backOrderStatus?id=' + this.data.id,
      })
    }else{
      wx.navigateTo({//退货退款详情
        url: '/pages/backOrder/backOrder?id=' + this.data.id,
      })
    }
  
  },
//返回首页
home:function(){
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