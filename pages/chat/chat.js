// pages/floor/onLineChat/onLineChat.js
var app = getApp();
var common = require("../../utils/common.js");
var socketOpen = false;
var frameBuffer_Data, session, SocketTask;
var url = common.getChatUrl;

var inputVal = '';
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight; //当前窗口高度
var keyHeight = 0;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputBottom: 0,
    message: "",
    user_input_text: '', //用户输入文字
    inputValue: '',
    returnValue: '',
    addImg: false,
    allContentList: [],
    num: 0,
    load: true,
    loading: false, //加载动画的显示
    limit: 5, //显示数据量
    isFocus: false,
    topHeight: 0,
    all: '',
    onClose: '',
    triggered:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        console.log(res)
        that.setData({
          userIcon: res.data.headUrl, //用户头像
          userPhone: res.data.mobile, //手机号
          userName: res.data.nickName, //昵称
          userMember: res.data.member_no,//我的id
          token: res.data.token
        })
      }
    })
    that.setData({
      otherHead: options.otherHead, //对方头像
      otherId: options.otherId, //对方id
      otherName: options.otherName,//对方昵称
      isMe: options.isMe,//1我是咨询者 2回答者（红人、商家）
    })
    // 设置标题
    wx.setNavigationBarTitle({
      title: options.otherName
    });

    var data = {
      action: 0,
      chatMsg: {
        msg: '',
        send_user_id: that.data.userMember,//发送者
        accept_user_id: '',//接受者
        id: 3,//消息的接受
        accept_type: 0, //0-普通会员（包括红人）  1-商家
        send_type: 0,//0-普通会员（包括红人）  1-商家
        sign_flag: 0,//0 未签收 1 签收
        msgType: '', //1文本2图片3语音
        extend_time: parseInt(new Date().getTime() / 1000)
      },
      extend: 1,//扩展字段
      extend_nother: ''
    }
    that.sendSocketMessage(data)

    this.chatList()// 历史聊天列表
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    
    // this.webSocket()
    // if (!socketOpen) {
    //   this.webSocket()
    // }
    // SocketTask.onOpen(res => {
      
  },
  // 历史聊天列表
  chatList() {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        common.ajaxGet(
          '/chat/memberChat/MyMessage',
          {
            send_user_id: that.data.userMember,//发送者
            accept_user_id: that.data.otherId,//接受者
            pageSize:10,
            pageIndex:1
          },
          function (data) {  
            that.setData({
              chatList: data.data.list.reverse(),
              scrollToView: 'msg_' + (data.data.list.length - 1),
              pageIndex: data.data.pageIndex,
              totalSize: data.data.totalSize,
              pageSize: data.data.pageSize
            })
            // 过滤
            var arr = data.data.list;//.filter(item => item.sign_flag == 0)
            let arrId=[];
              for(let i=0;i<arr.length;i++){
                if (arr[i].sign_flag == 0 && arr[i].accept_user_id == that.data.userMember){
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
        )
      },
    })
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
// 回车发送
  send(){
    this.submitTo()
  },
  // 提交文字
  submitTo: function (event, type = 1) {
    let that = this;
    console.log(app.globalData.localSocket.readyState)
    if (this.data.onClose == 'abnormal closure' || this.data.onClose == 'Stream end encountered' || !this.data.onClose) {
      that.webSocket()
    }
    setTimeout(function () {
      console.log('发送')
      var newTime = common.timestampFormat(new Date())

      var curTimestamp = parseInt(new Date().getTime() / 1000) //当前时间
      console.log(that.data.inputValue);
      var data = '';
      if (type == 1) { //发文字
        
        common.ajaxGet(
          '/api/check/context',
          {
            context: that.data.inputValue,
            memberNo: that.data.userMember
          },
          function (res) {
            if (res.code == 200) {
             data = {
                action: 2,
                chatMsg: {
                  msg: that.data.inputValue,
                  send_user_id: that.data.userMember,//发送者
                  accept_user_id: that.data.otherId,//接受者
                  id: 3,//消息的接受
                  accept_type: 0, //0-普通会员（包括红人）  1-商家
                  send_type: 0,//0-普通会员（包括红人）  1-商家
                  sign_flag: 0,//0 未签收 1 签收
                  msgType: type, //1文本2图片3语音
                  extend_time: curTimestamp
                },
                extend: 1,//扩展字段
              }
              console.log(data)
              that.sendSocketMessage(data)
              if (that.data.inputValue != '') {
                that.data.allContentList.push({
                  send_user_id: that.data.userMember,//发送者
                  accept_user_id: that.data.otherId,//接受者
                  accept_type: 0, //0-普通会员（包括红人）  1-商家
                  send_type: 0,//0-普通会员（包括红人）  1-商家
                  sign_flag: 0,//0 未签收 1 签收
                  messageType: type, //1文本2图片3语音
                  newTime: newTime,
                  msg: that.data.inputValue,
                  isMe: that.data.isMe,//1 咨询者 2回答者
                  extend_time: curTimestamp
                });
                that.setData({
                  allContentList: that.data.allContentList,
                  inputValue: '',
                })
              } else {
                wx.showToast({
                  title: '请输入要发送的内容',
                  icon: 'none',
                })
                return false;
              }

            } else {
              wx.showToast({
                title: res.message,
                icon: 'none'
              })
            }
          }) 
        

      } else if (type == 2) {//1发送文字 2 发送图片 3新增粉丝 4 点赞  5 发表评论  6全网  7预约  8支付  9 待定

     data = {
          action: 2,
          chatMsg: {
            msg: that.data.inputValue,
            send_user_id: that.data.userMember,//发送者
            accept_user_id: that.data.otherId,//接受者
            id: 3,//消息的接受
            accept_type: 0, //0-普通会员（包括红人）  1-商家
            send_type: 0,//0-普通会员（包括红人）  1-商家
            sign_flag: 0,//0 未签收 1 签收
            msgType: type, //1文本2图片3语音
            extend_time: curTimestamp
          },
          extend: 1,//扩展字段
        }
        that.data.allContentList.push({
          send_user_id: that.data.userMember,//发送者
          accept_user_id: that.data.otherId,//接受者
          accept_type: 0, //0-普通会员（包括红人）  1-商家
          send_type: 0,//0-普通会员（包括红人）  1-商家
          sign_flag: 0,//0 未签收 1 签收
          messageType: type, //1文本2图片
          newTime: newTime,
          msg: that.data.inputValue,
          extend_time:  curTimestamp
        });
        that.setData({
          allContentList: that.data.allContentList,
          // newId:that.data.newId+1,
          inputValue: '',
          
        })
        console.log(data)
        that.sendSocketMessage(data)
      } //else if
      that.setData({
        scrollToView: 'msg_' + (that.data.chatList.length+that.data.allContentList.length-1),
      })
      // that.pageScrollToBottom();
      console.log(that.data.chatList.length + that.data.allContentList.length - 1)
      
        
        
     
     
    }, 200)
  },
  // 发送和接收 socket 消息
  sendSocketMessage: function (onMessage) {
    let that = this
    console.log(`onMessage ${JSON.stringify(onMessage)}`)
    return new Promise((resolve, reject) => {
      app.sendSocketMessage(onMessage)//发送

      app.globalData.callback = function (res) {
        console.log('收到服务器内容', res)
        var onMessage = JSON.parse(res.data)
      console.log(onMessage)
      if (onMessage.chatMsg.msgType == 1) { //发送文字
        that.data.allContentList.push({
          send_user_id: onMessage.chatMsg.send_user_id,//发送者
          accept_user_id: onMessage.chatMsg.accept_user_id,//接受者
          id: onMessage.chatMsg.id,//消息的接受
          accept_type: onMessage.chatMsg.accept_type, //0-普通会员（包括红人）  1-商家
          send_type: onMessage.chatMsg.send_type,//0-普通会员（包括红人）  1-商家
          sign_flag: onMessage.chatMsg.sign_flag,//0 未签收 1 签收
          msgType: onMessage.chatMsg.msgType, //1文本2图片3语音
          msg: onMessage.chatMsg.msg,
          extend_time: onMessage.chatMsg.extend_time
        });
      } else if (onMessage.chatMsg.msgType == 2) { //图片
        that.data.allContentList.push({
          end_user_id: onMessage.chatMsg.send_user_id,//发送者
          accept_user_id: onMessage.chatMsg.accept_user_id,//接受者
          id: onMessage.chatMsg.id,//消息的接受
          accept_type: onMessage.chatMsg.accept_type, //0-普通会员（包括红人）  1-商家
          send_type: onMessage.chatMsg.send_type,//0-普通会员（包括红人）  1-商家
          sign_flag: onMessage.chatMsg.sign_flag,//0 未签收 1 签收
          msgType: onMessage.chatMsg.msgType, //1文本2图片3语音
          msg: onMessage.chatMsg.msg,
          extend_time: onMessage.chatMsg.extend_time
        });
      }

      that.setData({
        allContentList: that.data.allContentList, 
        scrollToView: 'msg_' + (that.data.chatList.length + that.data.allContentList.length - 1),
      })
        console.log(that.data.allContentList)
        var data = {
          action: 3,//3消息签收 2发送 0连接
          extend: onMessage.chatMsg.id,//扩展字段
        }
      that.sendSocketMessage(data)
        resolve(res)
      }
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  /* 自动滚到最底下 */
  pageScrollToBottom: function () {
    const res = wx.getSystemInfoSync();
    let windowHeight = res.windowHeight;
    wx.createSelectorQuery().select('#j-page').boundingClientRect(function (rect) {
      console.log(rect.bottom + "-----" + windowHeight);
      // if (rect.bottom >= (windowHeight - 60)) {
        // 使页面滚动到底部
        wx.pageScrollTo({
          scrollTop: rect.bottom +60,
          duration: 300
        })
      // }
    }).exec()
  },
  upimg: function () {
    let _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        let tempFilePaths = res.tempFilePaths;
        console.log(res.tempFiles[0].size)

        if (res.tempFiles[0].size <= 1048576) {
          wx.showLoading({
            title: '图片发送中...',
          });
          //图片压缩接口，需要真机才能
          // wx.compressImage({
          //   src: tempFilePaths[0], // 图片路径
          //   quality: 80, // 压缩质量
          //   success: function (res) {
              
              wx.uploadFile({
                url: common.getHeadStr() + '/api/upload/uploadFile',
                filePath: tempFilePaths[0],
                name: 'file',
                header: {
                  "token": _this.data.token,
                  'content-type': 'application/json'
                },
                success: function (res) {
                  let dataArr = JSON.parse(res.data);
                  console.log(dataArr)
                  if (dataArr.code==200) {
                    let img = dataArr.data;
                    console.log(img);
                    //that.data.inputValue
                    _this.setData({
                      inputValue: common.getHeadImg() + img
                    })
                    _this.submitTo('', 2)
                  }
                },
                complete: function () {
                  wx.hideLoading();
                }
              })
          //   }
          // })

        } else {
          wx.showToast({
            title: '发送的图片过大',
            icon: "none"
          })
        }

      }
    })
  },

  /**
   * 获取聚焦
   */
  focus: function (e) {

    keyHeight = e.detail.height;
    let _this = this;
    _this.setData({
      inputBottom: 10
    });
  },

  //失去聚焦(软键盘消失)
  blur: function (e) {
    this.setData({
      inputBottom: 0,
    })
  },

  /* 历史查看预览图 */
  bigImg: function (event) {
    var id = event.currentTarget.id;
    var index = event.currentTarget.dataset.index;//获取data-index
    var imgList = event.currentTarget.dataset.list;//获取data-list

    var imgArr = []; var imgArr1 = []; var imgArr2 = []
    for (let i = 0; i < imgList.length; i++) {
      if (imgList[i].msgType==2){//过滤出图片
        imgArr.push({ img: imgList[i].msg, index: imgArr.length, id: imgList[i].id})
      } 
    }
    console.log('imgArr', imgArr)
    var inex = imgArr.filter(item=>{//获取新数组的index
      return item.id==id})

    index = inex[0].index//赋值index
    // 拼接
    var chatList = this.data.allContentList;
    for (let i = 0; i < chatList.length; i++) {
      if (chatList[i].messageType == 2 || chatList[i].msgType == 2) {
        imgArr1.push({ img: chatList[i].msg, index: imgArr.length + imgArr1.length, id: chatList[i].id})
      }
    }
  
    var imgArr1_1 = imgArr.concat(imgArr1)
    console.log('imgArr1_1', imgArr1_1)
    var inex1 = imgArr1_1.filter(item => {//获取新数组的index
      return item.id == id
    })

    index = inex1[0].index//赋值index
   console.log('index',index)
    for (let j = 0; j < imgArr1_1.length;j++){
      imgArr2.push(imgArr1_1[j].img)
    }
    wx.previewImage({
      current: imgArr2[index], //当前图片地址
      urls: imgArr2, //所有要预览的图片的地址集合 数组形式
    })
  },
  /* 新发的查看预览图 */
  bigImg1: function (event) {
    var id = event.currentTarget.id;
    console.log(id)
    var index = event.currentTarget.dataset.index;//获取data-index
    var imgList = event.currentTarget.dataset.list;//获取data-list
    console.log(imgList)
    var imgArr = []; var imgArr1 = []; var imgArr2 = []
    for (let i = 0; i < imgList.length; i++) {
      if (imgList[i].msgType == 2 || imgList[i].messageType == 2) {//过滤出图片
        imgArr.push({ img: imgList[i].msg, index: imgArr.length, id: imgList[i].extend_time })
      }
    }
    console.log('imgArr', imgArr)
    var inex = imgArr.filter(item => {//获取新数组的index
      return item.id == id
    })
console.log(inex)
    index = inex[0].index//赋值index
    // 拼接
    var chatList = this.data.chatList;
    for (let i = 0; i < chatList.length; i++) {
      if (chatList[i].msgType == 2) {
        imgArr1.push({ img: chatList[i].msg, index: imgArr.length + imgArr1.length, id: chatList[i].id })
      }
    }

    var imgArr1_1 = imgArr.concat(imgArr1)
    // console.log('imgArr1_1', imgArr1_1)
    // var inex1 = imgArr1_1.filter(item => {//获取新数组的index
    //   return item.id == id
    // })

    // index = inex1[0].index//赋值index
    // console.log('index', index)
    for (let j = 0; j < imgArr1_1.length; j++) {
      imgArr2.push(imgArr1_1[j].img)
    }
    wx.previewImage({
      current: imgArr2[index], //当前图片地址
      urls: imgArr2, //所有要预览的图片的地址集合 数组形式
    })
    
    // var index = event.currentTarget.dataset.index;//获取data-index
    // console.log(index)
    // var imgList = event.currentTarget.dataset.list;//获取data-list

    // var imgArr = []; var imgArr1 = [];
    // for (let i = 0; i < imgList.length; i++) {
    //   if (imgList[i].messageType == 2) {
    //     imgArr.push(imgList[i].msg)
    //   }
    // }
    // // 拼接
    // var chatList = this.data.chatList;
    // for (let i = 0; i < chatList.length; i++) {
    //   if (chatList[i].msgType == 2) {
    //     imgArr1.push(chatList[i].msg)
    //   }
    // }
    // var imgArr2 = imgArr.concat(imgArr1)

    // wx.previewImage({
    //   current: imgArr2[index], //当前图片地址
    //   urls: imgArr2, //所有要预览的图片的地址集合 数组形式
    // })
  },
  addImg: function () {
    this.setData({
      addImg: !this.data.addImg
    })

  },
  // new() {
  //   this.onPullDownRefresh()
  // },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

    // SocketTask.close(function (close) {
    //   console.log('关闭 WebSocket 连接。', close)
    // })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // SocketTask.onClose(onClose => {
    //   console.log('监听 WebSocket 连接关闭事件。', onClose)
    //   socketOpen = false;
    //   // this.webSocket()
    // })
    // SocketTask.close(function (close) {
    //   console.log('关闭 WebSocket 连接。', close)
    // })
  },
  onRefresh() {
    // setTimeout(() => {
    //   this.setData({
    //     triggered: false,
    //   })
    // }, 1000)
  },
  onPulling(){
    
    var that = this;
    var pageIndex = that.data.pageIndex;
    var pageSum = Math.ceil(that.data.totalSize / that.data.pageSize);
    console.log(pageIndex, pageSum)
    if (pageIndex < pageSum) {
      console.log('000')
      // wx.showLoading({
      //   title: '加载中...',
      // })
      wx.getStorage({
        key: 'idNum',
        success: function (res) {
          common.ajaxGet(
            '/chat/memberChat/MyMessage',
            {
              send_user_id: that.data.userMember,//发送者
              accept_user_id: that.data.otherId,//接受者
              pageSize: 10,
              pageIndex: pageIndex + 1
            },
            function (data) {
              wx.hideLoading()
              that.setData({
                chatList: (data.data.list.reverse()).concat(that.data.chatList),
                scrollToView: 'msg_' + (data.data.list.length - 1),
                pageIndex: data.data.pageIndex,
                totalSize: data.data.totalSize,
                pageSize: data.data.pageSize,
                triggered: false,
              })
              // 过滤
              var arr = data.data.list;//.filter(item => item.sign_flag == 0)
              let arrId = [];
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
          )
        },
      })
    } else {
      wx.showToast({
        title: '暂无更多信息',
        icon: 'none'
      })
      setTimeout(() => {
      this.setData({
        triggered: false,
      })
    }, 1000)
    }

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  //   onShareAppMessage: function () {
  // 
  //   }
})
//通过 WebSocket 连接发送数据，需要先 wx.connectSocket，并在 wx.onSocketOpen 回调之后才能发送。
// function sendSocketMessage(msg) {
//   var that = this;
//   console.log('通过 WebSocket 连接发送数据', JSON.stringify(msg))
//   SocketTask.send({
//     data: JSON.stringify(msg)
//   }, function (res) {
//     console.log('已发送', res)
//   })
// }