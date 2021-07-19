// pages/moreHouse/moreHouse.js
const app = getApp();
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab:[
      { name: '区域',num:0},
      { name: '价格', num: 1 },
      { name: '优惠券', num: 2 },
    ],
    option2: [
      { text: '不限', value: 0 },
      { text: '1万以下', value: 1 },
      { text: '1-1.5万', value: 2 },
      { text: '1.5-2万', value: 3 },
      { text: '2-2.5万', value: 4 },
      { text: '2.5万以上', value: 5 },
    ],
    option3: [
      { text: '不限', value: 0 },
      { text: '有券盘', value: 1},
      { text: '无券盘', value: 2 }
    ],
   
    current2: 0,
    current3: 0,
    isView:false,
    currentTab:0,
    current1:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */

   onLazyLoad(info) {
    console.log(info)
  },
  onLoad: function (options) {
    this.setData({
      dingwei: options.dingwei,
      dingweis: options.dingwei.split('市')[0]
    })
    
    this.getHuose()// 房产推荐
    // 获取上个页面参数
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    console.log(currPage.data.dingwei)
    if (currPage.data.dingwei != '') {
      this.setData({//将携带的参数赋值
        dingwei: currPage.data.dingwei,
        dingweis: currPage.data.dingwei.split('市')[0]
      });
    }
    this.areaList()//区域
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
  //菜单
  clickchange(e){
    this.setData({
      currentTab:e.currentTarget.id,
      isView: !this.data.isView
    })
  },
  // 区域选择
  click1(e){
    this.setData({
      current1: e.currentTarget.id,
      area: e.currentTarget.dataset.name,
    })
  },
  confirm1(){
    this.setData({
      isView: !this.data.isView
    })
    if (this.data.current1==0){
      var area =''
    }else{
      var area = this.data.area
    }
    this.getHuose(1, area, this.data.current2, this.data.current3)// 房产推荐
  },
  reset1(){
    this.setData({
      current1: 0
    })
  },
  // 价格
  click2(e) {
    this.setData({
      current2: e.currentTarget.id,
    })
  },
  confirm2() {
    this.setData({
      isView: !this.data.isView
    })
    if (this.data.current1 == 0) {
      var area = ''
    } else {
      var area = this.data.area
    }
    this.getHuose(1, area, this.data.current2, this.data.current3)// 房产推荐
  },
  reset2() {
    this.setData({
      current2: 0
    })
  },
  // 优惠券
  click3(e) {
    this.setData({
      current3: e.currentTarget.id,
    })
  },
  confirm3() {
    this.setData({
      isView: !this.data.isView
    })
    if (this.data.current1 == 0) {
      var area = ''
    } else {
      var area = this.data.area
    }
    this.getHuose(1, area, this.data.current2, this.data.current3)// 房产推荐

  },
  reset3() {
    this.setData({
      current3: 0
    })
  },
  // 房产推荐
  getHuose: function (pageIndex = 1, area='', index='', flag='') {
    let that = this;
    // 显示加载图标
    // wx.showLoading({
    //   title: '加载中...', 
    // })
    wx.request({
      url: app.globalData.URL + '/api/enjoy/recommendHouse',
      data: {
        cityName: that.data.dingwei,
        area: area,//区域
        index: index,//价格区域
        flag: flag,//1有券 2无卷
        pageIndex: pageIndex,
        pageSize: 10,
      },
      method: 'GET',
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          that.setData({
            pageIndex1: res.data.data.pageNum,//当前页数
            pages1: res.data.data.pages,//总页数
            houseList: res.data.data.list
          })
        }else{
          wx.showToast({
            title: res.data.message,
            icon:'none'
          })
        }

      }
    })
  },
  // 区域
  areaList(){
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        common.ajaxGet(
          '/api/enjoy/cityArea', 
          {
            cityName: that.data.dingwei,
          },
          function (res) {
            // console.log(res.data)
            if (res.code == 200) {
              var arr = res.data;
              arr.unshift({ 'name': '不 限' })
              
              that.setData({
                areaList: arr
              })
            }
          }
        )
      },
      fail: function () {
        wx.showModal({
          content: '您尚未登陆，请先登陆',
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
    })
    
  },
  // 城市选择
  getCity: function () {
    wx.navigateTo({
      url: '/pages/cityList/cityList',
    })
  },
  // 房产详情
  buyNows(event) {
    wx.navigateTo({
      url: '/pages/huose/huose?shopId=' + event.currentTarget.dataset.spu + '&comeFrom=' + 'comeFrom' + '&goods_name=' + event.currentTarget.dataset.name + '&member_no=' + event.currentTarget.id,
    }) 
  },
  // 搜索
  toSearch: function (e) {
    var cityName = this.data.dingwei;
    wx.navigateTo({
      url: '/pages/search/search?cityName=' + cityName,
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
    var pages1 = that.data.pages1;//总个数
    var pageIndex1 = that.data.pageIndex1;//当前页个数
    if (that.data.current1 == 0) {
      var area = ''
    } else {
      var area = this.data.area
    }
    if (pageIndex1 < pages1) {
      // 显示加载图标
      // wx.showLoading({
      //   title: '加载中...',
      // })
      wx.request({
        url: app.globalData.URL + '/api/enjoy/recommendHouse',
        data: {
          cityName: that.data.dingwei,
          area: area,//区域
          index: that.data.current2,//价格区域
          flag: that.data.current3,//1有券 2无卷
          pageIndex: pageIndex1 + 1,
          pageSize: 10,
        },
        method: 'GET',
        success: function (res) {
          wx.hideLoading()
          if (res.data.code == 200) {
            that.setData({
              pageIndex1: res.data.data.pageNum,//当前页数
              pages1: res.data.data.pages,//总页数
              houseList: (that.data.houseList).concat(res.data.data.list)
            })
          }

        }
      })

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