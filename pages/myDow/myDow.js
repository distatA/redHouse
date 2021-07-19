// pages/myDow/myDow.js
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
    this.shopList()
  },
  // 添加商品
  myShop:function(){
    wx.navigateTo({
      url: '/pages/myShop/myShop',
    })
  },
  
 // 商品设置
  sets:function(e){
    wx.navigateTo({
      url: '/pages/myEdit/myEdit?spu=' + e.currentTarget.dataset.spu + '&name=' + e.currentTarget.dataset.name + '&status=' + 2 + '&type=' + e.currentTarget.dataset.type + '&prices=' + e.currentTarget.dataset.prices + '&share=' + e.currentTarget.dataset.share + '&remark=' + e.currentTarget.dataset.remark,
    })
  },
  // 全部商品列表
  shopList: function (pageIndex=1){
    var that = this;
    // 显示加载图标
    // wx.showLoading({
    //   title: '加载中',
    // })
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        console.log(res)
        common.ajaxGet('/api/window/BandSpuList',
          {
            member_no_me: res.data.member_no,
            pageIndex: pageIndex,
            pageSize: 10,
            searchName: that.data.searchValue == undefined ? '' : that.data.searchValue
          },
          function (data) {
            wx.hideLoading()
            if (data.code == 200) {
              that.setData({
                shopList: data.data.list,
                pages: data.data.pages,//总页数
                pageIndex: data.data.pageNum,//当前页数
                total: data.data.total,//总个数
              })
            }
          })
      }
      
    })
  },
  // 输入框
  getInputValue: function (e) {
    this.setData({
      searchValue: e.detail.value
    })
  },
  // 点击搜索
  toSearch:function(){
    this.shopList()
  },
  // 回车搜索
  searchHandle: function () {
    this.shopList()
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  // 跳转到详情
  detils: function (e) {
    var id = e.currentTarget.dataset.type;
    console.log(id)
    if (id == 1) {
      //房产
      wx.navigateTo({
        url: '/pages/huose/huose?shopId=' + e.currentTarget.dataset.spu,
      })
    } else {
      //生活
      wx.navigateTo({
        url: '/pages/home_page/good_detail/good_detail?shopId=' + e.currentTarget.dataset.spu,
      })
    }
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
    var pages= that.data.pages;//总页数
    var pageIndex = that.data.pageIndex;//当前页数
    if (pageIndex < pages){
      // 显示加载图标
      // wx.showLoading({
      //   title: '加载中',
      // })
      wx.getStorage({
        key: 'idNum',
        success: function (res) {
          console.log(res)
          common.ajaxGet('/api/window/BandSpuList',
            {
              member_no_me: res.data.member_no,
              pageIndex: pageIndex + 1,
              pageSize: 10,
              searchName: that.data.searchValue == undefined ? '' : that.data.searchValue
            },
            function (data) {
              wx.hideLoading()
              if (data.code == 200) {
                that.setData({
                  shopList: that.data.shopList.concat(data.data.list),
                  pages: data.data.pages,//总页数
                  pageIndex: data.data.pageNum,//当前页数
                  total: data.data.total,//总个数
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