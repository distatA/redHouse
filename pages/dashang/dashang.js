// pages/dashang/dashang.js
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
    var rewardList = JSON.parse(decodeURIComponent(options.rewardList));
    
    var sum = 0; var sum2 = 0;
    for (let i = 0; i < rewardList.length;i++){
      sum += rewardList[i].price
    }
    if (options.artPayVOS){
      var artPayVOS = JSON.parse(decodeURIComponent(options.artPayVOS));
      for (let i = 0; i < artPayVOS.length; i++) {
        sum2 += artPayVOS[i].price
      }
    }
    
    this.setData({
      type:options.type,
      rewardList: rewardList,
      sum:sum,
      artPayVOS: artPayVOS,
      sum2: sum2
    })
    if (options.type==1){//打赏
      // 设置标题
      wx.setNavigationBarTitle({
        title: '打赏列表'
      });
    } else if (options.type==2){//付费
      wx.setNavigationBarTitle({
        title: '付费列表'
      });
    }
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