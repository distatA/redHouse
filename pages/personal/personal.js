// pages/person/personal.js
const app = getApp();
var common = require("../../utils/common.js");
var amapFile = require('../../utils/amap-wx.js');
var markersData = {
  latitude: '', //纬度
  longitude: '', //经度
  key: "4ada276712c47bf88a9cdc6d41248a2a" //申请的高德地图key
};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    isView: true,
    getUserInfoFail: true,
    currentTab: 1,
    peopleSize: 5, //邀请人数
    vipTime: '',
    vipBg: 'https://firsthouse.oss-cn-shanghai.aliyuncs.com/jdIcon/e5b98243e51d399898fa9489635a9d5.png',
    list: [] //邀请人数组
  },
  // 获取邀请人数 
  getVIP() {
    common.axios({
      url: '/api/jd/jdMember',
      data: {
        memberNo: app.globalData.member_no
      }
    }).then(res => {
      console.log(res);
      let {
        list,
        time
      } = res.data.data
      let peopleSize = 5 - list.length
      if (Number(peopleSize) === 5 || Number(peopleSize) === 0) {
        peopleSize = 5
      }
      this.setData({
        vipTime: time ? common.myTimeS(+time) : '',
        list,
        peopleSize
      })
    })
  },
  onLoad: function (options) {

    wx.login({
      success: res => {
        this.data.code = res.code
      }
    })
    wx.showTabBar()
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        that.getIndexData(res.data.city) //获取轮播图
        that.setData({
          dingwei: res.data.city
        })
      },
    })
  },
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        that.getVIP()
        that.setData({
          getUserInfoFail: false
        })
        that.getNews() // 个人信息
      },
      fail: function () {
        that.setData({
          getUserInfoFail: true,
        })
      }
    })

  },
  //获取轮播图
  getIndexData: function (dingwei) {
    var that = this;
    wx.request({
      url: app.globalData.URL + '/api/enjoy/homeImage',
      data: {
        city: dingwei,
        bySource: 11,
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            bnrUrl: res.data.data
          })
        }
      }
    })
  },
  // 登陆页面
  user: function () {
    var that = this;
    that.setData({
      currentTab: 3
    })
  },
  // 登陆协议
  users: function (e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/user/user?id=' + id,
    })
  },
  //旧版微信授权
  // loginApp: function (data) {
  //   wx.getSetting({
  //     success: res => {
  //       console.log(res);
  //       if (res.authSetting['scope.userInfo']) {
  //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框

  //       } else {
  //         that.setData({
  //           getUserInfoFail: true,
  //           loading: false
  //         })
  //       }
  //     },
  //   })
  // },
//新版微信授权
  getUserProfile(e) {
    console.log(e);
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        var that = this;
        var allMsg = res.userInfo;
        console.log(allMsg);
        wx.login({
          success: res => {
            var code = res.code;
            var member_no = that.data.member_no ? that.data.member_no : '';
            if (code) {
              // 
              // 192.168.110.237:9999
              wx.request({
                url: app.globalData.URL + '/api/home/login',
                data: {
                  code: code,
                  nickName: allMsg.nickName,
                  headUrl: allMsg.avatarUrl,
                  gender: allMsg.gender,
                  cityName: that.data.cityName,
                  member_no: member_no,
                  invitation: app.globalData.inviteMember_no ? app.globalData.inviteMember_no : ''
                },
                method: 'POST',
                success: function (response) {
                  console.log(response, '登录信息')
                  if (response.data.code == 200) {
                    app.globalData.token = response.data.data.token
                    app.globalData.member_no = response.data.data.member_no
                    that.getVIP()
                    var numMsg = response.data.data;
                    if (numMsg.member_no) {
                      //存当前时间到本地存储
                      var timestamp = (new Date()).getTime();
                      wx.setStorageSync('time', timestamp)
                      wx.setStorage({
                        key: 'idNum',
                        data: numMsg,
                      });
                      that.setData({
                        getUserInfoFail: false,
                        token: numMsg.token,
                        currentTab: 1,
                      })
                      if (!numMsg.mobile) {
                        console.log('没有手机号');
                        that.setData({
                          currentTab: 2,
                          getUserInfoFail: false,
                        })
                      }
                      that.loadInfo() //位置授权                                      
                    }
                    that.getNews() // 个人信息
                    that.getIndexData(numMsg.city)
                  } else {
                    wx.showToast({
                      title: response.data.message,
                      icon: 'none'
                    })
                  }
                }
              })
            } else {}
          },
        })
        // this.setData({
        //   userInfo: res.userInfo,
        // })
      }
    })
  },
  // 地理位置授权
  loadInfo: function () {
    var that = this;
    wx.getLocation({
      success: function (res) {
        var longitude = res.longitude
        var latitude = res.latitude
        that.loadCity(longitude, latitude)
      },
      fail: function () {
        wx.getStorage({
          key: 'idNum',
          success: function (res) {
            wx.request({
              url: app.globalData.URL + 'api/enjoy/updateCity',
              data: {
                city: '合肥市',
                memberNo: res.data.member_no,
                phone: that.data.phone ? that.data.phone : ''
              },
              method: 'GET',
              header: {
                "token": res.data.token,
                'content-type': 'application/json'
              },
              success: function (res) {

              }
            })

          }
        })
      }
    })
  },
  loadCity: function (longitude, latitude) {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({
      key: markersData.key
    });
    myAmapFun.getRegeo({
      location: '' + longitude + ',' + latitude + '', //location的格式为'经度,纬度'
      success: function (data) {
        wx.getStorage({
          key: 'idNum',
          success: function (res) {
            wx.request({
              url: app.globalData.URL + 'api/enjoy/updateCity',
              data: {
                city: data[0].regeocodeData.addressComponent.city != '' ? data[0].regeocodeData.addressComponent.city : data[0].regeocodeData.addressComponent.province,
                memberNo: res.data.member_no,
                phone: that.data.phone ? that.data.phone : ''
              },
              method: 'GET',
              header: {
                "token": res.data.token,
                'content-type': 'application/json'
              },
              success: function (res) {
                if (res.code == 200) {
                  setTimeout(function () {
                    wx.showToast({
                      title: '授权成功',
                    })
                  }, 500)
                } else if (res.code == 401) {
                  wx.showToast({
                    title: res.message,
                    icon: 'none'
                  })
                }
              }
            })

          }
        })
        wx.setStorageSync("cityName", data[0].regeocodeData.addressComponent.city != '' ? data[0].regeocodeData.addressComponent.city : data[0].regeocodeData.addressComponent.province);

        that.setData({
          cityName: data[0].regeocodeData.addressComponent.city != '' ? data[0].regeocodeData.addressComponent.city : data[0].regeocodeData.addressComponent.province,
        })
      }
    });

    myAmapFun.getWeather({
      success: function (data) {
        that.setData({
          weather: data.weather.text
        })
        //成功回调
      },
      fail: function (info) {
        //失败回调
      }
    })
  },
  // 个人信息
  getNews: function () {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        // wx.setStorage({
        //   key: 'idNum',
        //   data: that.data.dingwei
        // })
        wx.request({
          url: app.globalData.URL + 'api/myMessage/details',
          data: {
            member_no: res.data.member_no,
          },
          method: 'GET',
          // header: {
          //   "token": res.data.token,
          //   'content-type': 'application/json'
          // },
          success: function (data) {
            if (data.data.code == 200) {
              that.setData({
                redType: res.data.redType, //0不是红人，1普通红人 2官方红人
                myHeadUrl: res.data.headUrl, //微信头像
                nickName: res.data.nickName, //用户昵称
                realName: res.data.realName, //微信
                gender: res.data.gender, //等级
                fanCount: data.data.data.fanCount, //粉丝数
                followCount: data.data.data.followCount, //关注数
                noteCount: data.data.data.noteCount, //我的笔记数
                sign: res.data.sign ? res.data.sign : '', //签名
                member_no: res.data.member_no
              })

            } else if (data.data.code == 401) {

            }
          }
        })

      }
    })
  },
  // 跳到我的黑卡
  myCard: function () {
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.navigateTo({
          url: '/pages/myCard/myCard',
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
  // 跳到我要办卡
  banCard: function () {
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.navigateTo({
          url: '/pages/banCard/banCard?type=' + 1,
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
  // 我的主页
  redShop: function () {
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.navigateTo({
          url: '/pages/redHome/redHome?member=' + res.data.member_no,
        })
      }
    })

  },
  // 跳转到我的信息
  myNews: function () {
    wx.navigateTo({
      url: '/pages/myNews/myNews',
    })
  },
  //我的消息
  mymsg: function () {
    wx.navigateTo({
      url: '/pages/hOrder/hOrder',
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  // 检测是否授权手机号
  checkPhone: function () {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        console.log(res)
        common.ajaxGet('/api/myMobileAuth/auth', {
            member_no: res.data.member_no,
          },
          function (data) {
            if (data.code == 200) {
              that.setData({
                phone: data.data ? data.data : ''
              })
            }
          })
      }
    })
  },
  // 手机号存到数据库
  savePhone(member_no, mobile) {
    common.axios({
      url: 'api/myMobileAuth/saveMobile',
      data: {
        member_no,
        mobile
      }
    }).then(res => {})
  },

  // 授权手机号码
  getPhoneNumber: function (e) {
    var iv = e.detail.iv;
    var encryptedData = e.detail.encryptedData;
    var that = this;
    wx.checkSession({
      success(res) {
        // session_key 未过期，并且在本生命周期一直有效
        wx.request({
          url: app.globalData.URL + '/api/myMobileAuth/getMobile',
          data: {
            code: that.data.code,
            iv: iv,
            encryptedData: encryptedData,
          },
          method: 'GET',
          success: function (res) {

            if (e.detail.errMsg == 'getPhoneNumber:ok') {
              that.setData({
                phone: res.data.data,
                currentTab: 1
              })
              that.getVIP()
              let userInfo = wx.getStorageSync('idNum')
              userInfo.mobile = res.data.data
              that.savePhone(app.globalData.member_no, res.data.data)
              wx.setStorageSync('idNum', userInfo)
              wx.setStorage({
                key: 'phone',
                data: res.data,
              })
            } else {
              wx.showToast({
                title: '获取号码失败',
                icon: 'none'
              })
              that.setData({
                currentTab: 1
              })
            }
          }
        })

      },

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

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  toFans: function () { //我的粉丝    
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.navigateTo({
          url: '/pages/myFans/myFans?type=' + 1,
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
  toMyFocus: function () { //我的关注 
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.navigateTo({
          url: '/pages/myFans/myFans?type=' + 2,
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
  toMyNote: function () { //我的社区
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        var member = res.data.member_no;
        wx.navigateTo({
          url: '/pages/myArea/myArea',
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
  order: function () { //我的商品订单
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.navigateTo({
          url: '../../packageA/JDorder/index',
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
  sales: function () { //分销订单
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.navigateTo({
          url: '/pages/sales/sales',
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
  collect: function () { //我的收藏
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.navigateTo({
          url: "/pages/collect/collect",
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
  balance: function () { //我的余额
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.navigateTo({
          url: "/pages/person_page/balance/balance",
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
  certificate: function () { //红人认证
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.navigateTo({
          url: "/pages/person_page/certificate/certificate",
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
  address: function () { //地址管理
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.navigateTo({
          url: "/pages/person_page/address/address",
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
  cart: function () { //购物车
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.navigateTo({
          url: "/pages/cart/cart",
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
  jump: function () { //支付设置   
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.navigateTo({
          url: '/pages/person_page/paypage/paypage?phone=' + '',
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
  // 我的橱窗
  myWindow: function () {
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.navigateTo({
          url: '/pages/myWindow/myWindow',
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
  advice: function () { //意见与反馈
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.navigateTo({
          url: '/pages/person_page/advice/advice', //person_page/advice/advice
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
  onShareAppMessage: function (options) {
    if (app.globalData.member_no) {
      return {
        title: '快来.....啦',
        // imageUrl:'../../img/icon/youjiantou.png',//图片地址
        path: '/pages/home/home?member_no=' + app.globalData.member_no,
        // success: function (res) {
        //   // 转发成功
        // },
        // fail: function (res) {
        //   // 转发失败
        // }
      }
    } else {
      wx.showToast({
        title: '您尚未登陆，请先登陆',
        icon: 'none'
      })
    }
  }
})