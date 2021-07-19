// pages/hOrder/hOrder.js
const app = getApp();
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuList: [{
      name: "全部", num: 0
    },
    {
      name: "待核销", num: 10
    },
    {
      name: "已核销", num: 20
    },
    {
      name: "待评价", num: 40
    },
    {
      name: "预约关闭", num: 30
    },
    {
      name: "投诉", num: 50
    },
    ],
    currentTab:0,
    isShare:false,
    value : '' //输入框的内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  
  onReady: function () {

  },
  
  onShow: function () {
    this.getOrder()// 我的预约列表
  },
  // 我的预约列表
  getOrder: function (status=0){
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        common.ajaxGet(
          '/api/house/subList',
          {
            member_no: res.data.member_no,
            status: status,
            searchName:'',
            pageIndex:1,
            pageSize:15
          },
          function (data) {
            console.log(data)
            if (data.code == 200) {
              that.setData({
                orderList: data.data.list,
                member_no: res.data.member_no,
              })
            }
          }
        )
      },
    })
  },
  // 项目搜索
  getInputValue(e){
    this.setData({
      value : e.detail.value
    })
  },
  //回车搜索
  searchHandle () {
    const {member_no,value } = this.data 
    let that = this 
    common.ajaxGet(
      '/api/house/subList',
      {
        member_no,
        status: 0,
        searchName:value,
        pageIndex:1,
        pageSize:15
      },
      function (data) {
        console.log(data)
        if (data.code == 200) {
          that.setData({
            orderList: data.data.list,
          })
        }
      }
    )
    
  },
  // 菜单点击
  clickMenu: function (e) {
    var current = e.currentTarget.dataset.current //获取当前tab的index
    var type = e.currentTarget.id;
    this.setData({
      currentTab: current,
      type: type
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
    this.getOrder(type)// 我的预约列表
  },
  // 房产预约详情
  hDetail:function(e){
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/hDetail/hDetail?id='+id,
    })
  },
  //商家店铺
  shopHome: function (e) {
    var id = e.currentTarget.id;

    wx.navigateTo({
      url: '/pages/shopHome/shopHome?merchant_no=' + id,
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
    var total = that.data.total;//总个数
    var pageSize = that.data.pageSize;//当前页个数
    if (pageSize < total) {
      pageSize = pageSize + 50;
      that.getOrder(pageSize)//红人好物 
    } else {
      wx.showToast({
        title: "我是有底线的",
        icon: "none"
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})