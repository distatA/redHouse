// pages/roomLists/roomLists.js
const app = getApp();
var common = require("../../utils/common.js");
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
    getUserInfoFail: true,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      dingwei: options.dingwei
    })
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        that.setData({ getUserInfoFail: false })
        that.roomList()//直播列表
        that.getIndexData() //获取轮播图
      },
      fail: function () {
        that.setData({ getUserInfoFail: true, })
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
  //获取轮播图
  getIndexData: function () {
    var that = this;
    wx.request({
      url: app.globalData.URL + '/api/enjoy/homeImage',
      data: {
        city: that.data.dingwei,
        bySource: 10,
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
  // 房间列表
  roomList: function () {
    var that = this;
    common.ajaxGet('/api/live/roomList',
      {
        pageIndex: 0,
        pageSize: 100
      },
      function (data) {
        console.log(data)
        if (data.code == 200) {
          var arr = data.data.room_info;
          for (let i = 0; i < data.data.room_info.length; i++) {
            var start = common.timeFormat(data.data.room_info[i].start_time * 1000);
            arr[i].start_time = start;
          }
          console.log(arr)
          that.setData({
            roomList: arr,
          })
        }
      })

  },
 
  //跳转直播间
  roomLive: function (e) {
    let status = e.currentTarget.dataset.status;
    let title = e.currentTarget.dataset.title;
    let head = e.currentTarget.dataset.head;
    let name = e.currentTarget.dataset.name;

    let roomId = e.currentTarget.id; // 房间号
    let customParams = { pid: 1 } // 开发者在直播间页面路径上携带自定义参数，后续可以在分享卡片链接和跳转至商详页时获取，详见【获取自定义参数】、【直播间到商详页面携带参数】章节
    if (status==103){
      wx.navigateTo({
        url: '/pages/roomVideo/roomVideo?roomId=' + roomId + '&title=' + title + '&head=' + head + '&name=' + name,
      })
    }else{
      wx.navigateTo({
      url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${encodeURIComponent(JSON.stringify(customParams))}`
    })
    }
    
  },
  // 跳到我要直播
  myLiveList:function(){
    wx.navigateTo({
      url: '/pages/myLiveList/myLiveList',
    })
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
        that.roomList()//直播列表
        that.getIndexData() //获取轮播图 
      }
    });

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