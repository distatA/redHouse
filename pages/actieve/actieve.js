// pages/actieve/actieve.js
const app = getApp();
var common = require("../../utils/common.js");
var temp = require("../../utils/img/img.js");
var amapFile = require('../../utils/amap-wx.js');
var markersData = {
  latitude: '',//纬度
  longitude: '',//经度
  key: "4ada276712c47bf88a9cdc6d41248a2a"//申请的高德地图key
};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    display: 1, //弹框
    getUserInfoFail: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id ? options.id : '',
    })
    wx.login({
      success: res => {
        that.data.code = res.code
      }
    })
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        that.setData({
          getUserInfoFail: false,
          member_no_me: res.data.member_no,
          nickName: res.data.nickName,//昵称
          headUrl: res.data.headUrl,//头像
          phone: res.data.mobile ? res.data.mobile : '',//手机号码 
        })
        that.actieve()  // 活动详情
      },
      fail: function () {
        that.setData({ getUserInfoFail: true, })
      }
    });
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
  temp:function(e){
    temp(e)
  },
  // 活动详情
  actieve:function(){
    var that = this;
    // wx.showLoading({
    //   title: '加载中...',
    // })
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        common.ajaxGet(
          '/api/module/get',
          {
            id:that.data.id
          },
          function (data) {
            wx.hideLoading()
            console.log(data)
            if (data.code == 200) {
              that.setData({
                detailList:data.data
              })
            }else{
              wx.showToast({
                title: data.message,
                icon:'none'
              })
            }
            // 设置标题
            wx.setNavigationBarTitle({
              title: data.data.subject_name
            });
          }
        )
      },
    })
  },
// 查看更多
  more:function(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/moreHuose/moreHuose?id=' + e.currentTarget.id + '&color=' + this.data.detailList.background_color + '&type=' + e.currentTarget.dataset.type,
    })
  },
  // 优惠券
  moreJuan:function(e){
    wx.navigateTo({
      url: '/pages/moreHuose/moreHuose?id=' + e.currentTarget.id + '&color=' + this.data.detailList.background_color,
    })
  },
  // 预约报名
  yuYue: function (e) {
    console.log(e)
    var start = e.currentTarget.dataset.start.split(' ');
    var end = e.currentTarget.dataset.end.split(' ');

    this.setData({
      display: 2,
      spu_no: e.currentTarget.id,//绑定项目的spu_no
      spu_name: e.currentTarget.dataset.name,//绑定项目的spu_name
      coupon_id: e.currentTarget.dataset.appurl,//优惠券编号
      coupon_name: e.currentTarget.dataset.coupon,//优惠券名
      end_time: end[0] ,//结束时间
      start_time: start[0]  ,//开始时间
      merchant_no: e.currentTarget.dataset.merchant
    })
  },
  // 关闭弹框
  closeZz: function (e) {
    this.setData({ 
      display: 1,
    })
  },
  //姓名
  getnameValue: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  //手机号
  getphoneValue: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 看房时间
  bindDateChange: function (e) {
    this.setData({
      userDate: e.detail.value
    })
  },
  // 提交信息
  submit: function () {
    var that = this;
    var name = that.data.name;
    var userDate = that.data.userDate;
    
    if (!that.data.phone) {
      wx.showToast({
        title: '请填写手机号码',
        icon: 'none'
      })
      return false;
    }
    wx.getStorage({
      key: 'idNum',
      success: function (res) {

        common.ajaxPost(
          '/api/house/sub',
          {
            member_no: res.data.member_no,//预约人
            mobile: that.data.phone,//预约人手机号码 
            name: '',//预约人姓名
            look_time: '',//看房时间
            item_member_no:'',//项目联系人
            recommend_member_no:'' ,//推荐人
            spu_no: that.data.spu_no,//房产编号
            coupon_id: that.data.coupon_id,//优惠券编号
            merchant_no: that.data.merchant_no,
          },
          function (data) {
            console.log(data)
            if (data.code == 200) {

              wx.requestSubscribeMessage({//授权订阅消息
                tmplIds: ['9IOPmOv98qXmtG2nk4_9noK-85kg5kH2-QYVpZSn52k'],
                success(res) {
                  common.ajaxPost(
                    '/api/wxMessgae/pushSub',
                    {
                      telphone: that.data.phone,
                      houseName: that.data.spu_name,
                      spu_member_no: '',//项目联系人
                    },
                    function (res) {
                      console.log(res)
                      if (res.code == 200) {

                      }
                    }
                  )
                }
              })
              setTimeout(function () {
                wx.navigateTo({
                  url: '/pages/hDetail/hDetail?id=' + data.data,
                })
              }, 1000)
              that.setData({
                display: 1
              })
            } else {
              wx.showToast({
                title: data.message,
                icon: 'none'
              })
            }
          }
        )
      },
    })
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
            // console.log(res)
            if (e.detail.errMsg == 'getPhoneNumber:ok') {
              console.log('授权成功')
              that.setData({
                phone: res.data.data,
                currentTab: 3
              })
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
                currentTab: 3
              })
            }
          }
        })

      },

    })
  },
  /* 弹窗的时候 阻止冒泡 */
  myCatchTouch: function () {
    console.log('stop user scroll it!');
    return;
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  //微信授权
  loginApp: function (data) {
    var that = this;
    var allMsg = data.detail.userInfo;

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.login({
            success: res => {
              console.log(res);
              var code = res.code;

              console.log(data);
              var member_no = that.data.member_nos ? that.data.member_nos : '';
              if (code) {

                wx.request({
                  url: app.globalData.URL + '/api/home/login',
                  data: {
                    code: code,
                    nickName: allMsg.nickName,
                    headUrl: allMsg.avatarUrl,
                    gender: allMsg.gender,
                    cityName: that.data.dingwei,
                    member_no: member_no,
                  },
                  method: 'POST',
                  success: function (response) {
                    console.log(response)
                    if (response.data.code == 200) {
                      var numMsg = response.data.data;
                      if (numMsg.member_no) {

                        wx.setStorage({
                          key: 'idNum',
                          data: numMsg,
                        });
                        console.log("登陆成功");
                        that.setData({
                          getUserInfoFail: false,
                        })
                        that.loadInfo()//位置授权  
                        that.actieve()  // 活动详情
                      }

                    } else {
                      wx.showToast({
                        title: response.data.message,
                        icon: 'none'
                      })
                    }
                  }
                })
              } else {
                console.log("登陆失败");
              }
            },
          })
        } else {
          that.setData({
            getUserInfoFail: true,
            loading: false
          })
        }
      }
    })
  },
  // 地理位置授权
  loadInfo: function () {
    var page = this;
    wx.getLocation({
      success: function (res) {
        var longitude = res.longitude
        var latitude = res.latitude
        page.loadCity(longitude, latitude)
        // console.log(res);
      },
      fail: function () {
        wx.getStorage({
          key: 'idNum',
          success: function (res) {
            common.ajaxGet(
              '/api/enjoy/updateCity', {
                city: '合肥市',
                memberNo: res.data.member_no,
              },
              function (res) {

              },
            )
          }
        })
        console.log('拒绝位置授权')
      }
    })
  },
  loadCity: function (longitude, latitude) {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({ key: markersData.key });
    myAmapFun.getRegeo({
      location: '' + longitude + ',' + latitude + '',//location的格式为'经度,纬度'
      success: function (data) {
        wx.getStorage({
          key: 'idNum',
          success: function (res) {
            common.ajaxGet(
              '/api/enjoy/updateCity', {
                city: data[0].regeocodeData.addressComponent.city != '' ? data[0].regeocodeData.addressComponent.city : data[0].regeocodeData.addressComponent.province,
                memberNo: res.data.member_no,
              },
              function (res) {

              },
            )
          }
        })
        wx.setStorageSync("cityName", data[0].regeocodeData.addressComponent.city != '' ? data[0].regeocodeData.addressComponent.city : data[0].regeocodeData.addressComponent.province);
        // console.log(data);
        that.setData({
          dingwei: data[0].regeocodeData.addressComponent.city != '' ? data[0].regeocodeData.addressComponent.city : data[0].regeocodeData.addressComponent.province,
        })
         
      }
    });

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