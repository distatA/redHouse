// pages/myShop/myShop.js
const app = getApp();
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    top1: 1,
    top2: 0,
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
    this.huoseList()// 房产
  },
  // 房产
  huoseList: function (pageIndex = 1) {
    var that = this;
    // 显示加载图标
    // wx.showLoading({
    //   title: '加载中',
    // })
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        console.log(res)
        common.ajaxGet('/api/window/bandHouseList',
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
                huoseList: data.data.list,
                pages1: data.data.pages,//总页数
                pageIndex1: data.data.pageNum,//当前页数
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
  //搜索
  toSearch:function(){
    if (this.data.top1 == 1) { this.huoseList() }//房产
    if (this.data.top2 == 1) { this.lifeList() }//居家
  },
  // 回车搜索
  searchHandle: function () {
    if (this.data.top1 == 1) { this.huoseList() }//房产
    if (this.data.top2 == 1) { this.lifeList() }//居家
  },
  //菜单切换房产
  change1: function () {
    this.setData({
      top1: 1,
      top2: 0
    })
  },
  // 切换居家
  change2: function () {
    this.setData({
      top1: 0,
      top2: 1
    })
    this.lifeList() // 居家
  },
  // 居家
  lifeList: function () {
    var that = this;
    // 显示加载图标
    // wx.showLoading({
    //   title: '加载中',
    // })
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        console.log(res)
        common.ajaxGet('/api/window/bandOtherList',
          {
            member_no_me: res.data.member_no,
            pageIndex: 1,
            pageSize: 10,
            searchName: that.data.searchValue == undefined ? '' : that.data.searchValue
          },
          function (data) {
            wx.hideLoading()
            if (data.code == 200) {
              that.setData({
                lifeList: data.data.list,
                pages: data.data.pages,//总页数
                pageIndex: data.data.pageNum,//当前页数
              })
            }
          })
      }

    })
  },
  // 添加到我的橱窗
  add: function (e) {
    wx.navigateTo({
      url: '/pages/myEdit/myEdit?spu=' + e.currentTarget.dataset.spu + '&name=' + e.currentTarget.dataset.name + '&img=' + e.currentTarget.dataset.img + '&merchant_no=' + e.currentTarget.id + '&price=' + e.currentTarget.dataset.price + '&type=' + e.currentTarget.dataset.type + '&status='+ 1,
    })
  },
  // 移除到我的橱窗
  del: function (e) {
    var that = this;
  
    var spu = JSON.stringify(e.currentTarget.dataset.spu)
  
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        console.log(res)
        common.ajaxGet('/api/window/delBandSpu',
          {
            member_no_me: res.data.member_no,
            spuNos: e.currentTarget.dataset.spu,
            
          },
          function (data) {
            if (data.code == 200) {
              wx.showToast({
                title: '解除绑定',
              })
              setTimeout(function () {
                wx.navigateBack({})
              }, 1500)
            }
          })
      }

    })
  },
  // 跳转到详情
  detils:function(e){
    var id = e.currentTarget.dataset.type;
    if(id==1){
      //房产
      wx.navigateTo({
        url: '/pages/huose/huose?shopId=' + e.currentTarget.dataset.spu,
      })
    }else{
      //生活
      wx.navigateTo({
        url: '/pages/home_page/good_detail/good_detail?shopId=' + e.currentTarget.dataset.spu,
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
    var pages = that.data.pages;//总页数
    var pageIndex = that.data.pageIndex;//当前页
    var pages1 = that.data.pages1;//总页数
    var pageIndex1 = that.data.pageIndex1;//当前页
    if (that.data.top2==1){
      if (pageIndex < pages){
        // 显示加载图标
        // wx.showLoading({
        //   title: '加载中',
        // })
        wx.getStorage({
          key: 'idNum',
          success: function (res) {
            console.log(res)
            common.ajaxGet('/api/window/bandOtherList',
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
                    lifeList: that.data.lifeList.concat(data.data.list),
                    pages: data.data.pages,//总页数
                    pageIndex: data.data.pageNum,//当前页数
                  })
                }
              })
          }

        })
      }
    }else if(that.data.top1==1){
      if (pageIndex1 < pages1){
        // 显示加载图标
        // wx.showLoading({
        //   title: '加载中',
        // })
        wx.getStorage({
          key: 'idNum',
          success: function (res) {
            console.log(res)
            common.ajaxGet('/api/window/bandHouseList',
              {
                member_no_me: res.data.member_no,
                pageIndex: pageIndex1 + 1,
                pageSize: 10,
                searchName: that.data.searchValue == undefined ? '' : that.data.searchValue
              },
              function (data) {
                wx.hideLoading()
                if (data.code == 200) {
                  that.setData({
                    huoseList: that.data.huoseList.concat(data.data.list),
                    pages1: data.data.pages,//总页数
                    pageIndex1: data.data.pageNum,//当前页数
                  })
                }
              })
          }

        })
      }
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})