// pages/myLiveList/myLiveList.js
const app = getApp();
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    display:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getList()// 我的直播列表
  },
  // 我的直播列表
  getList:function(){
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        console.log(res)
        common.ajaxGet('/api/live/myLiveList',
          {
            member_no: res.data.member_no,
            pageIndex:1,
            pageSize:10
          },
          function (res) {
            console.log(res)
            if (res.code == 200) {
              var arr = res.data.list;
              for(let i=0;i<arr.length;i++){
                var arrTime1 = arr[i].start_time.split(':')
                arr[i].start_time = arrTime1[0] + ':' + arrTime1[1]
                var arrTime2 = arr[i].end_time.split(':')
                arr[i].end_time = arrTime2[0] + ':' + arrTime2[1]
              }
              that.setData({
                liveList: arr,
                pages: res.data.pages,
                pageIndex: res.data.pageNum
              })
            }
            
          })
      }
    })
  },
  // 跳到我要直播
  myLive:function(){
    wx.navigateTo({
      url: '/pages/myLive/myLive',
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  wxCodes: function (e) {
    var type = e.currentTarget.dataset.type;
    var id = e.currentTarget.id;
    var imgUrl ='';
    // if(type==0){
    //     imgUrl='/img/icon/firend.png';
    // }else{
    //   imgUrl='/img/icon/icon.png';
    // }
    this.setData({
      display: 2,
      imgUrl:id
    })
  },
  // 关闭弹框
  closeZz: function (e) {
    this.setData({
      display: 1,
    })
  },
  //点击保存图片
  save() {
    let that = this
    //若二维码未加载完毕，加个动画提高用户体验
    wx.showToast({
      icon: 'loading',
      title: '正在保存图片',
      duration: 1000
    })
    //判断用户是否授权"保存到相册"
    wx.getSetting({
      success(res) {
        console.log(res)
        //没有权限，发起授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {//用户允许授权，保存图片到相册
              that.savePhoto();
            },
            fail() {//用户点击拒绝授权，跳转到设置页，引导用户授权
              wx.openSetting({
                success() {
                  wx.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success() {
                      that.savePhoto();
                    }
                  })
                }
              })
            }
          })
        } else {//用户已授权，保存到相册
          that.savePhoto()
        }
      }
    })
  },
  //保存图片到相册，提示保存成功
  savePhoto() {
    let that = this;
    wx.downloadFile({
      url: that.data.imgUrl,
      success: function (res) {
        console.log(res.tempFilePath)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            console.log(res)
            wx.showToast({
              title: '保存成功',
            })
            setTimeout(function () {
              that.setData({
                display: 1,
              })
            }, 1000)
          }
        })
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
    var that = this;
    var pageIndex = that.data.pageIndex;
    var pages = that.data.pages;
    if (pageIndex < pages){
      // wx.showLoading({
      //   title: '加载中...',
      // })
      wx.getStorage({
        key: 'idNum',
        success: function (res) {
          console.log(res)
          common.ajaxGet('/api/live/myLiveList',
            {
              member_no: res.data.member_no,
              pageIndex: pageIndex + 1,
              pageSize: 10
            },
            function (res) {
              wx.hideLoading()
              console.log(res)
              if (res.code == 200) {
                var arr = res.data.list;
                for (let i = 0; i < arr.length; i++) {
                  var arrTime1 = arr[i].start_time.split(':')
                  arr[i].start_time = arrTime1[0] + ':' + arrTime1[1]
                  var arrTime2 = arr[i].end_time.split(':')
                  arr[i].end_time = arrTime2[0] + ':' + arrTime2[1]
                }
                that.setData({
                  liveList: that.data.liveList.concat(arr),
                  pages: res.data.pages,
                  pageIndex: res.data.pageNum
                })
              }

            })
        }
      })
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})