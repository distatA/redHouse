//app.js
// var app = getApp();

App({
  onLaunch: function () {
    let data = wx.getStorageSync('idNum') || ''
    this.globalData.token = data.token
    this.globalData.member_no = data.member_no 
    var that = this;
    // 登录
    wx.login({
      success: res => {
        wx.getStorage({
          key: 'idNum',
          success: function (res) {
            
          },
          fail: function () {
           
          }
        })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
   
    this.initSocket()
  },
  globalData: {
    // JDimg:'http://img13.360buyimg.com/N1/',
    JDimg:'https://m.360buyimg.com/mobilecms/s750x750_',
    member_no: '',
    token: '',
    userInfo: null,
    inviteMember_no :'', //邀请人的member_no
    // URL:"http://192.168.110.127:9999/",//本地
    URL:"https://58hongren.com/",//线上
    // URL: "http://47.111.109.201/",//测试
    localSocket: {},
    callback: function () { }
  },
  initSocket() {
    let that = this
    that.globalData.localSocket = wx.connectSocket({
      //此处 url 可以用来测试
      url: `wss://58hongren.com/ws`
    })
    //版本库需要在 1.7.0 以上
    that.globalData.localSocket.onOpen(function (res) {
      console.log('WebSocket连接已打开！readyState=' + that.globalData.localSocket.readyState)
    })
    that.globalData.localSocket.onError(function (res) {
      console.log('readyState=' + that.globalData.localSocket.readyState)
    })
    that.globalData.localSocket.onClose(function (res) {
      console.log('WebSocket连接已关闭！readyState=' + that.globalData.localSocket.readyState)
      that.initSocket()
    })
    that.globalData.localSocket.onMessage(function (res) {
      console.log('接收消息')
      // 用于在其他页面监听 websocket 返回的消息
      that.globalData.callback(res)
    })
  },

  //统一发送消息，可以在其他页面调用此方法发送消息
  sendSocketMessage: function (msg) {
    let that = this
    return new Promise((resolve, reject) => {
      if (this.globalData.localSocket.readyState === 1) {
        console.log('发送消息', JSON.stringify(msg))
        this.globalData.localSocket.send({
          data: JSON.stringify(msg),
          success: function (res) {
            resolve(res)
          },
          fail: function (e) {
            reject(e)
          }
        })
      } else {
        console.log('已断开')
      }
    })
  },
})