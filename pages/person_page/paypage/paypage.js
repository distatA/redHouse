// pages/person_page/paypage/paypage.js
const app = getApp;
var common = require("../../../utils/common.js");
var md5 = require("../../../utils/md5.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:0,
    windowWidth:0,
    time:0,
    sendTime: '获取验证码',
    sendColor: '#ff9254',
    snsMsgWait: 60,//短信验证码倒计时
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type ? options.type : 0,
      phone: options.phone ? options.phone : '',
    })
    wx.getSystemInfo({  // 获取当前设备的宽高，文档有
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
        console.log(res);
      },
    })
  },
// 发送验证码
  getNum(){
    var that = this;
    var phone = that.data.phone;
    if(phone){
    if (common.check_phone(phone)){
      wx.getStorage({
        key: 'idNum',
        success: function (res) {
          wx.showLoading({
            title: '验证码发送中...',
          });
          // console.log(res)
          common.ajaxGet('/api/sms/sendCode',
            {
              mobile: phone,
              tplCode: 'SMS_172975116',
            },
            function (data) {
              if (data.code == 200) {
                wx.hideLoading();
                // 60秒倒计时
              
                let down = setInterval(() => {
                  that.setData({
                    smsFlag: true,
                    sendColor: '#cccccc',
                    sendTime: that.data.snsMsgWait + 's后重发',
                    snsMsgWait: that.data.snsMsgWait - 1
                  });
                  if (that.data.snsMsgWait < 0) {
                    clearInterval(down)
                    that.setData({
                      sendColor: '#ff9254',
                      sendTime: '发送验证码',
                      snsMsgWait: 60,
                      smsFlag: false
                    });
                  }
                }, 1000);
                wx.showToast({
                  title: data.data,
                })
              }
            })
        },
        fail: function () {
          // wx.hideLoading()
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
    }else{
      wx.showToast({
        title: '手机号有误',
        icon:'none'
      })
    }
    }else{
      wx.showToast({
        title: '请输入手机号码',
        icon:'none'
      })
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
// 手机号
  getPhone:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
// 验证码
getCode:function(e){
  this.setData({
    code: e.detail.value
  })
},
  blur:function(e){
    // console.log(e.detail.value)
    if (e.detail.value.match(/^[0-9]*$/)) {
      // console.log('正确')
    }else{
      wx.showToast({
        title: '请输入数字类型',
        icon:'none'
      })
    }
  },
// 密码
  getPass: function (e) {
    
    this.setData({
      passWord: e.detail.value
    })
  },
// 确认密码
  getAgainPass: function (e) {
    this.setData({
      rePassWord: e.detail.value
    })
  },
// 提交
  tijiao:function(){
    var that = this;
    var type = that.data.type;
    var phone = that.data.phone;
    console.log(that.data.passWord)
    if(phone){
      if (common.check_phone(phone)){
        if (!that.data.code || that.data.code == 'undefined') {
          wx.showToast({
            title: '请输入验证码', icon: 'none'
          })
        }else{
        if (!that.data.passWord || that.data.passWord =='undefined') {
          wx.showToast({
            title: '请输入密码', icon: 'none'
          })
        } else if (that.data.passWord.length != 6){
          wx.showToast({
            title: '请输入6位数密码', icon: 'none'
          })
        }
        else{
          if (!that.data.rePassWord || that.data.rePassWord == 'undefined') {
            wx.showToast({
              title: '请输入确认密码', icon: 'none'
            })
          }else{
            if (that.data.passWord == that.data.rePassWord) {
              wx.getStorage({
                key: 'idNum',
                success: function (res) {
                  console.log(res)
                  common.ajaxGet('/api/payPas/resetPayPas',
                    {
                      member_no: res.data.member_no,
                      newPas: that.data.passWord,//md5.hexMD5(that.data.passWord)
                      mobile: phone,
                      code: that.data.code,
                    },
                    function (data) {
                     if(data.code==200){
                       wx.showToast({
                         title: data.data,
                       })

                       if (type == 1) {//支付进来的
                         var test=setTimeout(function(){
                           wx.navigateBack({
                           })
                         },2000);//返回支付页面
                       }else{
                         setTimeout(function () {
                           wx.navigateBack({
                           })
                         }, 2000);
                       }
                     }else if(data.code==401){
                       wx.clearStorageSync()//清除本地缓存
                       wx.showModal({
                         content: '登陆超时，请重新登陆',
                         success(res) {
                           if (res.confirm) {
                             wx.switchTab({
                               url: '/pages/personal/personal',
                             })
                           } else if (res.cancel) {
                             console.log('用户点击取消')
                           }
                         }
                       })
                     }
                     else{
                       wx.showToast({
                         title: data.message,
                         icon:'none'
                       })
                     }
                    })
                }
              })
           

            } else {
              wx.showToast({
                title: '两次密码不一致',
                icon: 'none'
              })
            }
          }
        }
      }
      }
    }else{
      wx.showToast({
        title: '请输入手机号', icon: 'none'
      })
    }
  
   
   


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
    clearInterval(this.data.down);
    if (this.data.type==1){
      clearTimeout(this.data.test)
    }
    
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