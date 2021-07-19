// pages/login/login.js
const app = getApp();
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
    page: "",
    urlData: "",
    getUserInfoFail: true,
    loading: true,
    cityName: ''
  },
  toNextPage: function () {
    var tp = this.data.page;
    var that = this;
    var pageType = that.data.pageType || '';
    if (tp) {
      var url = '/pages/' + tp + '/' + tp;
      if (tp == "good_detail") {
        url = '/pages/home_page/' + tp + '/' + tp;
      } else if (tp == "huose") {
        url = '/pages/huose/' + tp;
      }
      url += '?' + this.data.urlData;
      // if (url == '/pages/insight/insight?' || url == '/pages/my/mine/mine?') {
      //   wx.switchTab({
      //     url: url.split("?")[0]
      //   })
      //   return false
      // } else if (url == '/pages/chat/chat?') {
      //   wx.navigateTo({
      //     url: url.split("?")[0]
      //   })
      // }
      wx.switchTab({
        url: '/pages/home/home',
        success: function () {
          setTimeout(() => {
            wx.navigateTo({
              url: url
            })
          }, 500)
        }
      })
    } else {
      wx.switchTab({
        url: '/pages/home/home'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var urlData = "";
    if (options.page) {
      this.setData({
        page: options.page
      })
    }

    if (options.spu_no) {
      urlData += "&shopId=" + options.spu_no; //商品编号
    }
    if (options.member_no) {
      urlData += "&share_member_no=" + options.member_no; //分享人的ID
    }
    if (options.member_no) {
      urlData += "&category_id=" + options.category_id; //1房产 2实体 3虚拟
    }
    if (options.member_no) {
      urlData += "&end_time=" + options.end_time; //商品下架时间
    }
    if (options.goods_name) {
      urlData += "&goods_name=" + options.goods_name; //商品名称
    }
    this.setData({
      urlData: urlData
    })
    // this.loadInfo();//地理位置
    // this.setCity();
    // this.loginApp() //登陆  
  },
  openSetting: function (res) {
    if (res.detail.iv) {
      this.loginApp();
    } else {
      this.setData({
        getUserInfoFail: true
      })
    }
    if (res.detail.userInfo) {
      this.setData({
        getInfo: res.detail.userInfo
      })
      wx.setStorage({
        key: 'userInfo',
        data: res.detail.userInfo,
      })
    }
    if (res.detail.userInfo.language == "zh_CN") {
      this.setData({
        language: "中文"
      })
    }
  },
  commit: function () {
    this.setData({
      getUserInfoFail: false
    })
  },
  loginApp: function (data) {
    var that = this;
    console.log(data)
    var allMsg = data.detail.userInfo;
    that.loadInfo() //地理位置
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.login({
            success: res => {
              // console.log(res);
              var code = res.code;

              var member_no = that.data.member_no ? that.data.member_no : '';
              if (code) {
                // console.log(code)
                var allMsg = res.data;
                wx.request({
                  url: app.globalData.URL + '/api/home/login',
                  data: {
                    code: code,
                    nickName: allMsg.nickName,
                    headUrl: allMsg.avatarUrl,
                    gender: allMsg.gender,
                    cityName: that.data.cityName,
                    member_no: member_no,
                  },
                  method: 'POST',
                  success: function (response) {
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
                        app.globalData.member = numMsg.member_no;
                        that.toNextPage();
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
            }
          })
        } else {
          that.setData({
            getUserInfoFail: false,
            loading: false
          })
        }
      }
    })
    // console.log(that.data.getUserInfoFail)
  },

  loadInfo: function () {
    var page = this;
    wx.getLocation({
      success: function (res) {
        var longitude = res.longitude
        var latitude = res.latitude
        page.loadCity(longitude, latitude)
        // console.log(res);
      },
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
        wx.setStorageSync("cityName", data[0].regeocodeData.addressComponent.city);
        // console.log(data);
        that.setData({
          cityName: data[0].regeocodeData.addressComponent.city
        })
      }
    });

    myAmapFun.getWeather({
      success: function (data) {
        that.setData({
          weather: data.weather.text
        })
        // console.log(data);
        //成功回调
      },
      fail: function (info) {
        //失败回调
        // console.log(info)
      }
    })
  },

  setCity: function () {
    var that = this;
    wx.getStorage({
      key: 'cityName',
      success: function (res) {
        that.setData({
          cityName: res.data
        })
      },
    })
  },

  logInSuccess: function () {
    wx.switchTab({
      url: '../home/home',
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
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        that.setData({
          getUserInfoFail: false,
          member_no: res.data.member_no
        })
        that.toNextPage();
      },
      fail: function () {
        that.setData({
          getUserInfoFail: true,
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
  onShareAppMessage: function () {

  }
})