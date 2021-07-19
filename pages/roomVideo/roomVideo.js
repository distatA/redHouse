// pages/roomVideo/roomVideo.js
const app = getApp();
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      roomId: options.roomId,
      title:options.title,
      head:options.head,
      name:options.name,
    })
    this.playBackList()//回放列表
  },

  //回放接口
  playBackList: function () {
    var that = this;
    common.ajaxGet('/api/live/playBackList',
      {
        pageIndex: 0,
        pageSize: 10,
        room_id: that.data.roomId
      },
      function (data) {
        console.log(data)
        if (data.code == 200) {
          that.setData({
            roomList: data.data.live_replay,
            video: data.data.live_replay[1].media_url
          })
        }
      })

  },
  // 切换视频
  roomLive:function(e){
    var that = this;
    that.setData({
      video: e.currentTarget.id,
      current: e.currentTarget.dataset.id
    })
  },
  /* 视频退出全屏时的操作 */
  fullscreenchange: function (event) {
    console.log("视频全屏的操作" + event.detail.fullScreen);
    if (event.detail.fullScreen == false) {

      var videoContext = wx.createVideoContext('houseVideo');
      videoContext.stop();
      videoContext.exitFullScreen();
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        console.log(res.windowWidth)
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })
      },
    })
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
  // onShareAppMessage: function () {

  // }
})