// pages/news/news.js
var app = getApp();
var common = require("../../utils/common.js");
var socketOpen = false;
var frameBuffer_Data, session, SocketTask;
var url = common.getChatUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count: {
      GZ_count: 0,
      PL_count: 0,
      DZ_count: 0
    },
    member_no: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(app.globalData.member_no)
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
    this.chatList() // 聊天列表
    this.getnews() //获取点赞 评论  关注消息未读个数
    // this.webSocket()

    // SocketTask.onOpen(res => {
    var that = this;
    // socketOpen = true;
    var data = {
      action: 0,
      chatMsg: {
        msg: '',
        send_user_id: app.globalData.member_no, //发送者
        accept_user_id: '', //接受者
        id: '', //消息的接受
        accept_type: 0, //0-普通会员（包括红人）  1-商家
        send_type: 0, //0-普通会员（包括红人）  1-商家
        sign_flag: 0, //0 未签收 1 签收
        msgType: '' //1文本2图片3语音
      },
      extend: 1, //扩展字段
      extend_nother: ''
    }
    that.sendSocketMessage(data)
    // })
    this.data.member_no = app.globalData.member_no
  },
  // 创建Socket
  webSocket: function () {
    var that = this;
    SocketTask = wx.connectSocket({
      url: url,
      data: 'data',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      success: function (res) {
        console.log('WebSocket连接创建', res)
      },
    })
  },
  // 发送和接收 socket 消息
  sendSocketMessage: function (msg) {
    var that = this;
    app.sendSocketMessage(msg)
    return new Promise((resolve, reject) => {
      app.globalData.callback = function (res) {
        console.log('收到服务器内容', res)
        if (res) {
          that.chatList() //聊天列表
          that.getnews() //
        }
        resolve(res)
      }
    })
  },
  // 聊天列表
  chatList() {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        common.ajaxGet(
          '/chat/memberChat/messageList', {
            member_no: res.data.member_no
          },
          function (data) {
            that.setData({
              chatList: data.data
            })
          }
        )
      },
    })
  },
  //获取点赞 评论  关注消息未读个数
  getnews() {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        common.ajaxGet(
          '/chat/memberChat/count', {
            member_no: res.data.member_no
          },
          function (data) {
            that.setData({
              count: data.data
            })
          }
        )
      },
    })
  },

  // 消息
  fans: function (e) {
    var type = e.currentTarget.id;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.navigateTo({
          url: '/pages/fans/fans?type=' + type,
        })
      },
      fail: function () {
        wx.showToast({
          title: '您尚未登陆，请先登陆',
          icon: 'none'
        })
      }
    })

  },
  // 聊天
  chat(e) {
    var otherHead = e.currentTarget.dataset.head;
    var otherId = e.currentTarget.id;
    var otherName = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/chat/chat?isMe=' + 2 + '&otherHead=' + otherHead + '&otherId=' + otherId + '&otherName=' + otherName,
    })
  },
  movbleChange(e) {
    console.log(e);
  },
  // 系统消息
  system() {
    wx.navigateTo({
      url: '/pages/system/system',
    })
  },
  // 删除接口 
  del(member_no, other_no) {
    common.axios({
      url: '/chat/memberChat/deleteMsg',
      data: {
        member_no,
        other_no,
      }
    }, 'GET').then(res=>{
      console.log(res.data,'...data');
      if(res.data){
        wx.showToast({
          title: '删除成功',
          icon: 'none',
        })
        this.chatList() 
        this.getnews() 
      }
    })
  },
  // 删除聊天信息 
   delete(e) {
    const {
      item
    } = e.currentTarget.dataset;
    const that = this 
    wx.showModal({
      title: '温馨提示',
      content: '删除后,将清空该消息记录',
      success(res) {
        if (res.confirm) {
          that.del(that.data.member_no, item.member_no)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})