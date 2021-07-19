// pages/room/room.js
const app = getApp();
var common = require("../../utils/common.js");
// let livePlayer = requirePlugin('live-player-plugin');
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
    console.log(encodeURIComponent(JSON.stringify(customParams)))
    let roomId = [1] // 房间号
    let customParams = { pid: 1 } // 开发者在直播间页面路径上携带自定义参数，后续可以在分享卡片链接和跳转至商详页时获取，详见【获取自定义参数】、【直播间到商详页面携带参数】章节
    this.setData({
      roomId,
      customParams: encodeURIComponent(JSON.stringify(customParams))
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
  onShow: function (options) {
    livePlayer.getLiveParams({ room_id: [1], scene: options.scene })
      .then(res => {
        console.log('get live status', res.liveStatus)//直播状态码101: 直播中, 102: 未开始, 103: 已结束, 104: 禁播, 105: 暂停中, 106: 异常，107：已过期  
        console.log('get share openid', res.share_openid) // 分享者openid，分享卡片进入场景才有
        console.log('get openid', res.openid) // 用户openid
        console.log('get room id', res.room_id) // 房间号
        console.log('get custom params', res.customParams) // 开发者在跳转进入直播间页面时，页面路径上携带的自定义参数，这里传回给开发者
      }).catch(err => {
        console.log('get live params', err)
      })

    
  },
  // 房间列表
  roomList: function () {
    var that = this;   
    common.ajaxGet('/api/live/roomList',
      {
        pageIndex: 1,
        pageSize:10
      },
      function (data) {
        console.log(data)
        if (data.code == 200) {
          // that.setData({
          //   phone: data.data ? data.data : ''
          // })
        }
      })
   
  },
  //回放接口
  playBackList: function () {
    var that = this;
    common.ajaxGet('/api/live/playBackList',
      {
        pageIndex: 1,
        pageSize: 10,
        room_id:1
      },
      function (data) {
        console.log(data)
        if (data.code == 200) {
          // that.setData({
          //   phone: data.data ? data.data : ''
          // })
        }
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