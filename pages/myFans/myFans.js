// pages/myFans/myFans.js
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
      type: options.type,//1我的粉丝 2我的关注
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
    if(this.data.type==1){
      this.getMyFans()//我的粉丝列表
    } else if (this.data.type == 2){
      this.getFollow()//我的关注列表
      wx.setNavigationBarTitle({
        title: '我的关注'
      })
    }
   
  },
//我的粉丝列表
  getMyFans: function (pageSize=50){
  var that = this;
    // 显示加载图标
    // wx.showLoading({
    //   title: '玩命加载中',
    // })
  wx.getStorage({
    key: 'idNum',
    success: function (res) {
      // console.log(res)
      common.ajaxGet('/api/myFans/fansList',
        {
          member_no: res.data.member_no,
          pageIndex: 1,
          pageSize: pageSize,
        },
        function (data) {
          wx.hideLoading()
          if (data.code == 200) {
            that.setData({
              fansList: data.data.list,
              total: data.data.total,//总页数
              pageSize: data.data.pageSize,//当前页数
            })
          }
        })
    },
    fail: function () {
      wx.hideLoading()
      wx.showModal({
        content: '您尚未登陆，请先登陆',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/personal/personal',
            })
          } else if (res.cancel) {
            wx.navigateBack({

            })
          }
        }
      })
    }
  })
},
  // 跳转到红人店铺
  redHome: function (e) {
    console.log(e)
    var member = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/redHome/redHome?member=' + member,
    })
  },
//我的关注列表
  getFollow: function (pageSize=50){
  var that = this;
    // 显示加载图标
    // wx.showLoading({
    //   title: '玩命加载中',
    // })
  wx.getStorage({
    key: 'idNum',
    success: function (res) {
      // console.log(res)
      common.ajaxGet('/api/myFollow/followList',
        {
          member_no: res.data.member_no,
          pageIndex: 1,
          pageSize: pageSize,
        },
        function (data) {
          wx.hideLoading()
          if (data.code == 200) {
            that.setData({
              fansList: data.data.list,
              total: data.data.total,//总页数
              pageSize: data.data.pageSize,//当前页数
            })
          }
        })
    },
    fail: function () {
      wx.hideLoading()
      wx.showModal({
        content: '您尚未登陆，请先登陆',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/personal/personal',
            })
          } else if (res.cancel) {
            wx.navigateBack({

            })
          }
        }
      })
    }
  })
},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
//我的关注取消关注
  guanZhu:function(e){
    console.log(e)
    var that = this;
    var id = e.currentTarget.id;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        // console.log(res)
        common.ajaxGet('/api/myFollow/follow',
          {
            member_no_me: res.data.member_no,
            member_no_other:id
          },
          function (data) {
            if (data.code == 200) {
             wx.showToast({
               title: '取消关注',
             })
             setTimeout(function(){
               that.getFollow()//我的列表
             },1000)
            }
          })
      }
    })
  },
  // 我的粉丝
  guanZhus: function (e) {
    console.log(e)
    var that = this;
    var id = e.currentTarget.id;
    var flag = e.currentTarget.dataset.flag;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        var member_no = res.data.member_no;
        common.ajaxGet('/api/myFollow/follow',
          {
            member_no_me: res.data.member_no,
            member_no_other: id
          },
          function (data) {
            if (data.code == 200) {
              if (flag==0){
                wx.showToast({
                  title: '关注成功',
                })
                var data = {
                  action: 2,
                  chatMsg: {
                    msg: '通过粉丝列表关注了你',
                    send_user_id: member_no,//发送者
                    accept_user_id: id,//接受者
                    id: '',//消息的接受
                    accept_type: 0, //0-普通会员（包括红人）  1-商家
                    send_type: 0,//0-普通会员（包括红人）  1-商家
                    sign_flag: 0,//0 未签收 1 签收
                    msgType: 3 //3新增粉丝 
                  },
                  extend: 1,//扩展字段
                  extend_nother: ''
                }
                that.sendSocketMessage(data)
              }else{
                wx.showToast({
                  title: '取消关注',
                })
              }  
              setTimeout(function () {
                that.getMyFans()//我的列表
              }, 1000)
            }
          })
      }
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
    console.log("下拉加载")
    var total = this.data.total;//总页数
    var pageSize = this.data.pageSize;//当前页
    var that = this;
    var type = that.data.type;
    if (pageSize < total) {
      
      pageSize = pageSize + 10;
      if(type==1){
        that.getMyFans(pageSize)//我的粉丝
      }else if(type==2){
        that.getFollow(pageSize)//我的关注列表
      }
     
    } else {
      wx.showToast({
        title: "我是有底线的",
        icon: "none"
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})