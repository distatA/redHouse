// pages/submitOrder/submitOrder.js
const app = getApp();
var common = require("../../utils/common.js");
var md5 = require("../../utils/md5.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setInter:'',//定时器
    Length: 6,        //输入框个数
    isFocus: true,    //聚焦
    Value: "",        //输入的内容
    ispassword: true, //是否密文显示 true为密文， false为明文。
    disabled: true,
    current:0,
    isKill : false 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      isKill :options.isKill === 'true' ? true : false ,
      numbers: options.numbers,//单商品
      number: options.numbers.split(','),//多商品
      time:options.time,
      payment: options.payment,
      status:options.status?options.status:0,//1房产
      spu: options.spu ? options.spu :'',//房产spu
      types: options.types ? options.types : '' ,//进来的途径：1 单商品，2 购物车，3 我的订单
    })

    // 倒计时
    var that = this;
    var haveTime = that.data.time;//that.data.time
    let down = setInterval(() => {
      haveTime -= 1;
      let hour = Math.floor(haveTime / 3600);
      let restTime = haveTime % 3600;
      if (hour < 10) { hour = '0' + hour; }
      let minute = Math.floor(restTime / 60);
      if (minute < 10) { minute = '0' + minute; }
      let second = restTime % 60;
      if (second < 10) { second = '0' + second; }
      // console.log(hour, minute, second)
      if (haveTime >= 0) {
        that.setData({
          hour: hour,
          minute: minute,
          second: second,
        });
      }
      if (haveTime < 0) {
        that.setData({
          hour: 0,
          minute: 0,
          second: 0,
        });
      }
    }, 1000);
    that.setData({
      down: down
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
    if (!this.data.isKill){
      this.getAccount()// 账户余额
    }
   
  },
// 账户余额
  getAccount:function(){
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        console.log(res)
        common.ajaxPost('/api/goods/walletBalance',
          {
            member_no: res.data.member_no,
          },
          function (data) {
            if(data.code==200){
              that.setData({
                yuE:data.data
              })
            }
          })
      }
    })
  },
// 账户余额支付
  pay: common.throttle(function(e){

    var payment = this.data.payment;//需要支付的金额
    var yuE = this.data.yuE;//余额
    var that = this;
    
    if (that.data.minute >= 0 && that.data.second>0){
    //  判断余额是否充足
      var that = this;
      wx.getStorage({
        key: 'idNum',
        success: function (res) {
          common.ajaxPost('/api/goods/walletCheck',
            {
              member_no: res.data.member_no,
              money: payment,
            },
            function (data) {
              if (data.code == 200) {
                that.setData({
                  current: 1,
                })
              
              } else { //设置密码
                wx.showModal({
                  // title: '提示',
                  content: data.message,
                  cancelText: "取消", //默认是“取消”
                  cancelColor: '#333333', //取消文字的颜色
                  confirmText: "设置密码", //默认是“确定”
                  confirmColor: '#FF7054', //确定文字的颜色
                  success(res) {
                    console.log(res)
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '/pages/person_page/paypage/paypage?type='+1,
                      })
                    } else if (res.cancel) {

                    }
                  }
                })
              }
              
            })
        }
      })
    }else{
      wx.showToast({
        title: '时间已过期,即将返回首页',
        icon:'none'
      })
      setTimeout(function(){
        wx.switchTab({
          url: '/pages/home/home',
        })
      },2000)       
    }
  },1000),
// 微信支付
  weiPay: common.throttle(function(e){
    var that = this;
    var orderArr = [];
    console.log(that.data.number.length,'length')
    if (that.data.number.length>0){
      orderArr = that.data.number//多商品
    }else{
      orderArr.push(that.data.numbers)//单商品
    }
    // wx.showLoading({
    //   title: "加载中",
    //   mask: true
    // });
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        var memberNo = res.data.member_no;
        var token = res.data.token;
        console.log(that.data.isKill,'支付');
        if (that.data.isKill) {
          var api = '/api/skill/wxPay';
          var pama = {
            userId: res.data.member_no,
            product_no: that.data.numbers
          }
        } else {
          var api = '/api/goods/Pay';
          var pama = {
            myOrderNoList: orderArr,
            openId: res.data.openId,
            code: 1,//微信
          }
        }
        common.ajaxPost(api,
          pama,
          function (data) {
            console.log(data);
            wx.hideLoading();
            if (data.code == 200) {
            //  调用微信支付
            //判断时间是否过期
              console.log(that.data.minute)
              console.log(that.data.second)
              if (that.data.minute == 0 && that.data.second==0){
                wx.showToast({
                  title: '时间已过期,即将返回首页',
                  icon: 'none'
                })
                setTimeout(function () {
                  wx.switchTab({
                    url: '/pages/home/home',
                  })
                }, 2000)
                return false;
              }
            let result = data.data;
            // console.log(result)
            if (result) {
              wx.requestPayment({
                'timeStamp': result.timeStamp,
                'nonceStr': result.nonceStr,
                'package': result.packageValue,
                'signType': result.signType,
                'paySign': result.paySign,
                'success': function (res) {
                  console.log(res);
                  wx.navigateTo({
                    url: '/pages/paySucceed/paySucceed?payment=' + that.data.payment + '&numbers=' + that.data.numbers + '&spu=' + that.data.spu + '&status=' + that.data.status + '&isKill=' + that.data.isKill,
                  })
                },
                'fail': function (res) {
                  if(!that.data.isKill){
                  console.log(res);
                  wx.request({
                   url: app.globalData.URL + '/api/goods/wxNoPay',
                    data:{
                      myOrderNoList: orderArr,
                    },
                    method: 'POST',
                    header: {
                      "token": token,
                      "Content-Type": "application/json"
                    },
                    success:function(res){
                      // console.log(res);
                      var hour= that.data.hour;
                      var minute = that.data.minute;
                      var second = that.data.second;
                      if(that.data.types != 1){
                        wx.navigateTo({//多商品跳转到我的订单
                          url: '/pages/person_page/orders/orders?numbers=' + that.data.number,
                        })
                      }else{
                        wx.navigateTo({//单商品跳转到 订单详情
                          url: '../order_page/wait_pay/wait_pay?numbers=' + that.data.numbers + '&hour=' + hour + '&minute=' + minute + '&second=' + second +'&types='+10,
                        })
                      }
                  
                    }
                  })
                  }
                },
              })
            }
               
            } else { 
              wx.showToast({
                title: data.message + '即将返回首页',
                icon:'none',
              })
              // setTimeout(function () {
              //     wx.switchTab({
              //       url: '/pages/home/home',
              //     })
              //   }, 2000)
            }

          })
      }
    })
  },1000),
// 关闭
close:function(){
  this.setData({
    current:0,
    Value:'',
    disabled: true,
  })
},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.down);//清楚定时器
  },
// 输入密码

  Focus(e) {
    var that = this;
    // console.log(e.detail.value);
    var inputValue = e.detail.value;
    var ilen = inputValue.length;
    if (ilen == 6) {
      that.setData({
        disabled: false,
      })
    } else {
      that.setData({
        disabled: true,
      })
    }
    that.setData({
      Value: inputValue,
    })
  },
  Tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },
  // 余额支付
  formSubmit: common.throttle(function(e) {
    var that = this;
    // console.log(e);
    var password = that.data.Value;
    var orderArr = [];
    if (that.data.number.length > 0) {
      orderArr = that.data.number//多商品
    } else {
      orderArr.push(that.data.numbers)//单商品
    }
    // console.log(orderArr)
    // 支付
    wx.showLoading({
      title: "支付中",
      mask: true
    });
    
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        if (that.data.isKill) {
          var api = '/api/skill/wxPay';
          var pama = {
            userId : res.data.member_no,
            product_no : that.data.numbers
          }
        } else {
          var api = '/api/goods/Pay';
          var pama = {
            member_no: res.data.member_no,
            passWord: password,// md5.hexMD5(password),
            myOrderNoList: orderArr,
            openId: res.data.openId,
            code: 2,//2钱包 1 微信
          }
        }
        common.ajaxPost(api,
          pama,
          function (data) {
            wx.hideLoading();
            if (data.code == 200) {
              wx.showToast({
                title: data.data,
              })
              that.setData({
                current: 0,
                Value: '',
                disabled: true,
              })
               var test=setTimeout(function(){
                wx.navigateTo({
                  url: '/pages/paySucceed/paySucceed?payment=' + that.data.payment + '&numbers=' + that.data.numbers + '&spu=' + that.data.spu + '&status=' + that.data.status,
                })
              },1200) 
            }else{
              wx.showToast({
                title: data.message,
                icon:'none'
              })
              // setTimeout(function () {
              //   wx.switchTab({
              //     url: '/pages/home/home',
              //   })
              // }, 2000)
              
            }
          })
      }
    })
  },1000),
// 忘记密码
  forget:function(){
    wx.navigateTo({
      url: '/pages/person_page/paypage/paypage?type='+1,
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.down);//清楚定时器
    // clearTimeout(test)
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