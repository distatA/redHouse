// pages/banCard/banCard.js
const app = getApp();
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
    currentTab: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      type: options.type,//1会员黑卡列表 2我的黑卡详情
      order_no: options.order ? options.order:'',
      currentId: options.id ? options.id:'',
    })
    if (options.type==1){
      that.cardList()//黑卡类别
    } else if (options.type == 2){
       that.myCard()//我的黑卡详情
    }
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        console.log(res.data.city)
        that.setData({
          city: res.data.city
        })
      }
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
  // 黑卡类别
  cardList(){
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.request({
          url: app.globalData.URL + '/api/myCard/cardList',
          data: {
            cityName: res.data.city,
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data)
            if(res.data.code==200){
            var arr = res.data.data;
            for(let i=0;i<arr.length;i++){
              var start = res.data.data[i].effective_start_time.split(' ');
              var end = res.data.data[i].effective_end_time.split(' ');
              arr[i].effective_start_time = start[0] 
              arr[i].effective_end_time = end[0] 
              if (that.data.currentId ==arr[i].id){
                that.setData({
                  currentTab:i
                })
              }
            }
            console.log(arr)
            that.setData({
              cardList: arr
            })  
          }
          }
        })
      }
   
    })
  },
  // 我的黑卡详情
  myCard(){
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.request({
          url: app.globalData.URL + 'api/myCard/myCardDetail',
          data: {
            order_no: that.data.order_no,
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data)
            if (res.data.code == 200) {
              var arr = res.data.data;
              
              var start = res.data.data.card.effective_start_time.split(':');
              var end = res.data.data.card.effective_end_time.split(':');
              arr.card.effective_start_time = start[0] + ':' + start[1]
              arr.card.effective_end_time = end[0] + ':' + end[1]
              
              console.log(arr)
              that.setData({
                myCard: arr
              })
            }
          }
        })
      }

    })
  },
  // 菜单点击
  clickMenu: function (e) {
    var current = e.currentTarget.dataset.current //获取当前tab的index
    this.setData({
      currentTab: current,
    })
    var oLeft = e.currentTarget.offsetLeft;
    if (oLeft > 200) {
      this.setData({
        left: oLeft - 70,
      })
    } else {
      this.setData({
        left: 0,
      })
    }
  },
  // 黑卡详情
  cardDetail(e){
    console.log(e)
    var imgs = e.currentTarget.dataset.imgs;
    var instructions = e.currentTarget.dataset.instructions;
    var rights = e.currentTarget.dataset.rights;
    var checkStatus = e.currentTarget.dataset.checkstatus;
    var title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: '/pages/cardDetail/cardDetail?type=' + e.currentTarget.id + '&order_no=' + this.data.order_no + '&instructions=' + instructions + '&rights=' + rights + '&imgs=' + JSON.stringify(imgs) + '&checkStatus=' + checkStatus + '&title=' + title,
    })
  },
  // 立即购买
  cardorder:function(e){
    var id = e.currentTarget.id;
    var name = e.currentTarget.dataset.name;
    var img = e.currentTarget.dataset.img;
    var first = e.currentTarget.dataset.first;
    var present = e.currentTarget.dataset.present;
    // wx.navigateTo({
    //   url: '/pages/cardorder/cardorder?id=' + id + '&name=' + name + '&img=' + img + '&first=' + first + '&present=' + present,
    // })
    var that = this ;
    // wx.showLoading({
    //   title: "加载中",
    //   mask: true
    // });
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        common.ajaxGet('/api/myCard/create',
          {
            member_no: res.data.member_no,
            id: id,
          },
          function (data) {
            wx.hideLoading();
            if (data.code == 200) {
              //  调用微信支付
              let result = data.data;
              console.log(result)
              if (result) {
                wx.requestPayment({
                  'timeStamp': result.timeStamp,
                  'nonceStr': result.nonceStr,
                  'package': result.packageValue,
                  'signType': result.signType,
                  'paySign': result.paySign,
                  'success': function (res) {
                    console.log(res);
                    wx.showToast({
                      title: '购买成功',
                    })
                    setTimeout(function(){
                      wx.navigateTo({//我的黑卡
                        url: '/pages/myCard/myCard',
                      })
                    },1000)                   
                  },'fail':function(){
                    wx.showToast({
                      title: '您已取消支付',
                      icon:'none'
                    })
                  }
                })
              }
            } else {
              wx.showToast({
                title: '支付失败',
                icon: 'none',
              })
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