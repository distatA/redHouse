// pages/fans/fans.js
var app = getApp();
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
      type:options.type || 3
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
    this.chatList()// 关注列表
  },
  // 关注列表
  chatList() {
    var that = this;
    var type = that.data.type;
    var url ='';
    if (type == 1) {// 关注列表
      url = '/chat/memberChat/gzList';
    } else if (type == 2) {// 评论列表
      url = '/chat/memberChat/plList';
    } else if (type == 3) {// 点赞列表
      url = '/chat/memberChat/dzList';
    }
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        if(res.data){
        common.ajaxGet(
          url,
          {
            member_no: res.data.member_no
          },
          function (data) {
            let newarr = data.data 
            that.setData({
              chatList:newarr
            })
            // 过滤
            var arr = data.data;
            let arrId = [];
            if(arr){

            for (let i = 0; i < arr.length; i++) {
              if (arr[i].sign_flag == 0) {
                arrId.push(arr[i].id)
              }
            }
            var ids = arrId.join()
            if (ids != '') {
              var data = {
                action: 3,//3消息签收 2发送 0连接
                extend: ids,//扩展字段
              }
              that.sendSocketMessage(data)//签收消息
            }
          }
          }
        )
      }
      },
    })
  },
  // 发送和接收 socket 消息
  sendSocketMessage: function (msg) {
    let that = this
    return new Promise((resolve, reject) => {
      app.sendSocketMessage(msg)
      app.globalData.callback = function (res) {
        console.log('收到服务器内容', res)
        resolve(res)
      }
    })
  },
  // 关注
  guanZhu: function (e) {
    var that = this;
    var flag = e.currentTarget.id;
    var member = e.currentTarget.dataset.id;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.request({
          url: app.globalData.URL + 'api/redAndOfficeGroup/follow',
          data: {
            member_no_me: res.data.member_no,
            member_no_other: member,
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(flag)
            if (res.data.code == 200 && flag == 0) {
              wx.showToast({
                title: '关注成功',
              })
                
            } else if (res.data.code == 200 && flag == 1) {
              wx.showToast({
                title: '取消关注',
                icon: 'none'
              })
            } else if (res.data.code == 500) {
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              })
            }
            that.chatList()//

          }
        })
      },
    })
  },
  // 跳到笔记详情
  jump(e){
    var noteId = e.currentTarget.id;
    var member = e.currentTarget.dataset.member;
    wx.navigateTo({
      url: '/pages/myNote_detail/myNote_detail?noteId=' + noteId + '&member=' + member,
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