// pages/myCard/myCard.js
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
    this.myCardList()// 我的黑卡列表
  },
  // 我的黑卡列表
  myCardList(){
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.request({
          url: app.globalData.URL + '/api/myCard/myCardList',
          data: {
            member_no: res.data.member_no,
            pageIndex:1,
            pageSize:10
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data)
            if (res.data.code == 200) {
              var arr = res.data.data.list;
              for (let i = 0; i < arr.length; i++) {
                var start = res.data.data.list[i].card.effective_start_time.split(' ');
                var end = res.data.data.list[i].card.effective_end_time.split(' ');
                arr[i].card.effective_start_time = start[0] 
                arr[i].card.effective_end_time = end[0] 
              }
              console.log(arr)
              that.setData({
                cardList: arr,
                pageIndex: res.data.pageNum,//当前页
                pages: res.data.pages,//总页数
              })
            }
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
  //我的黑卡详情页
  cardDetail(e){
    wx.navigateTo({
      url: '/pages/banCard/banCard?order=' + e.currentTarget.id+'&type='+2,
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
    var that = this;
    var pageIndex = that.data.pageIndex;
    var pages = that.data.pages;
    if (pageIndex < pages){
      wx.getStorage({
        key: 'idNum',
        success: function (res) {
          wx.request({
            url: app.globalData.URL + '/api/myCard/myCardList',
            data: {
              member_no: res.data.member_no,
              pageIndex: pageIndex + 1,
              pageSize: 10
            },
            method: 'GET',
            header: {
              "token": res.data.token,
              'content-type': 'application/json'
            },
            success: function (res) {
             
              if (res.data.code == 200) {
                var arr = res.data.data.list;
                for (let i = 0; i < arr.length; i++) {
                  var start = res.data.data.list[i].card.effective_start_time.split(' ');
                  var end = res.data.data.list[i].card.effective_end_time.split(' ');
                  arr[i].card.effective_start_time = start[0]
                  arr[i].card.effective_end_time = end[0]
                }
                console.log(arr)
                that.setData({
                  cardList: that.data.cardList.concat(arr),
                  pageIndex: res.data.pageNum,//当前页
                  pages: res.data.pages,//总页数
                })
              }
            }
          })
        }
      })
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})