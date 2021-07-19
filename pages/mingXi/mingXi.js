// pages/mingXi/mingXi.js
const app = getApp();
var common = require("../../utils/common.js");
const date = new Date()
const years = []
const months = []

for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr: [
      '交易类型',
    ],
    index: 0,
    years: years,
    year: date.getFullYear(),
    months: months,
    month: 2,
    value: [9999, 1, 1],
    isView:false,
    dataList:''

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
  show(){
    this.setData({
      isView:false
    })
  },
  bindChange: function (e) {
    console.log(e)
    const val = e.detail.value
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
    })
    var dateTime = this.data.years[val[0]] + '-' + this.data.months[val[1]]
    this.setData({
      dateTime
     
    })
    this.getDetail(dateTime)//订单详情
  },
  isView:function(e){
    this.setData({
      isView: !this.data.isView
    })
  },
 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getReason()// 交易类型
    
    // 获取当前时间
    var curTimestamp = parseInt(new Date().getTime()); //当前时间戳
    var time = common.timeFormats(curTimestamp).split('-',2);
    // console.log(time)
    var dateTime = time[0]+"-"+time[1];
    this.setData({
      year:time[0],
      month:time[1],
      dateTime: dateTime
    })

    this.getDetail(dateTime)// 订单详情
  },
// 订单详情
  getDetail: function (dateTime, pay_type){
  var that = this;
  var dateTime = dateTime ? dateTime : '';
    var pay_type = pay_type == undefined ? that.data.index : pay_type;
  wx.getStorage({
    key: 'idNum',
    success: function (res) {
      // console.log(res)
      common.ajaxGet('/api/myWallet/myBill',
        {
          member_no: res.data.member_no,
          dateTime: dateTime,
          pay_type: Number(pay_type),
          pageIndex:1,
          pageSize:500,
        },
        function (data) {
          if (data.code == 200) {
            let detailList = data.data.memberPayHistoryList.list
          
           that.setData({
             detailList,
             moneyout: data.data.moneyout,
             moneyIn: data.data.moneyIn,
             pageSize: data.data.memberPayHistoryList.pageSize,//总页数
             total: data.data.memberPayHistoryList.total,//当前页数
           })
          } 
        })
    }
  })
},
// 交易类型
  getReason: function () {
    var that = this;
    common.ajaxPost(
      '/api/itemAndDetail/getItemDetail', { itemName: '交易类型' },
      function (res) {
        if (res.code == 200) {
          var list = that.data.arr;
          for (var i = 0; i < res.data.length; i++) {
            list.push(res.data[i].item_detail)
          }
          that.setData({
            arr: list,
            dataList:res.data
          })
         
        }
      }
    )
  },
  // 资金明细详情
  zhangDan(){
    // wx.navigateTo({
    //   url: '/pages/zhangDan/zhangDan',
    // })
  },
//选择时间
  bindDateChange: function (e) {
    var dateTime = e.detail.value;
    this.setData({
      userDate: e.detail.value
    })
    this.getDetail(dateTime)//订单详情
  },
  // 选择交易类型
  bindPickerChange: function (e) {
    // console.log(e.detail.value);
    let value = this.data.arr[e.detail.value]
    let newValue;
    this.data.dataList.forEach(v=>{
      if(v.item_detail == value){
        newValue = v.code
      }
    })
    this.setData({
      index: e.detail.value
    })
    this.getDetail(this.data.dateTime, newValue)//订单详情
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
    console.log("下拉加载")
    var dateTime = this.data.dateTime;
    var pages = this.data.pages;//总页数
    var pageNum = this.data.pageNum;//当前页
    var that = this;
    var pay_type = that.data.index;
    if (pageNum<pages){
      // 显示加载图标
      // wx.showLoading({
      //   title: '玩命加载中',
      // })
      pageNum = pageNum + 1;
      wx.getStorage({
        key: 'idNum',
        success: function (res) {
          common.ajaxGet('/api/myWallet/myBill',
            {
              member_no: res.data.member_no,
              dateTime: dateTime,
              pay_type: Number(pay_type),
              pageIndex: pageNum,
              pageSize: 12,
            },
            function (data) {
              if (data.code == 200) {
                // 隐藏加载框
                wx.hideLoading();
                const oldData = that.data.detailList;
                that.setData({
                  detailList: oldData.concat(data.data.memberPayHistoryList.list),
                  // moneyout: data.data.moneyout,
                  // moneyIn: data.data.moneyIn,
                  pages: data.data.memberPayHistoryList.pages,//总页数
                  pageNum: data.data.memberPayHistoryList.pageNum,//当前页数
                })
              }
            })
        }
      })
    }else{
      wx.showToast({
        title: "我是有底线的",
        icon:"none"
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})