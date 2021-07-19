const { axios, myTime } = require("../../utils/common.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabArr: [{ name: '全部', currentId: 0 },
    { name: '即将到账', currentId: 16 },
    { name: '已到账', currentId: 17 },
    { name: '无效订单', currentId: 100 }],
    list: [],//订单数组
    JDimg: app.globalData.JDimg,
    current: 0,
    total: '', //总数
    member_no: '', //个人唯一标识
    pageIndex: 1,//页数
    pageSize: 10 //数量
  },

  // 切换tab栏页面
  changeTab(e) {
    let { pageIndex, pageSize, member_no } = this.data
    let currentId = Number(e.currentTarget.dataset.currentid)
    console.log(e);
    this.setData({
      list: [],
      pageIndex: 1,
      current: currentId
    })
    this.getOrderDetail(currentId, member_no, 1, pageSize)
  },
  // 复制内容
  copywxtap(e) {
    let data = String(e.currentTarget.dataset.content)
    wx.setClipboardData({data,
      success: function (res) {wx.showToast({ title: '复制成功', })}})
  },
  toPage(e) {
     /**
     * 返佣处价格,得到百分比
     */
    let { price, skuid, estimatecommission } = e.currentTarget.dataset
    let data = {
      skuId: skuid,
      price,
      backMoney: estimatecommission,
      qtty30: Math.ceil(Math.random() * 100),
      commisionRatioWl: Number(estimatecommission / price * 100).toFixed(1)
    }
   
    wx.navigateTo({ url: '../JDdetail/index?data=' + JSON.stringify(data) });
  },
  // 找回订单
  toFindOrder() { wx.navigateTo({ url: '../JDfind/index' }); },
  onLoad: function (options) {
    let { pageIndex, pageSize } = this.data
    const { member_no } = wx.getStorageSync('idNum')
    console.log(member_no, '用户id');
    this.setData({ member_no })
    this.getOrderDetail(this.data.current, member_no, pageIndex, pageSize)
  },
  // 获取订单信息
  getOrderDetail(status, memberNo, pageIndex, pageSize) {
    axios({
      url: '/api/jd/jdOrderList',
      data: { status, memberNo, pageIndex, pageSize }
    }).then(res => {
      console.log(res);
      let { list, total } = res.data.data
      // 转换时间戳
      list = list.map((v) => {
        v.orderTime = myTime(v.orderTime)
        return v
      })
      this.setData({ list, total })
    })
  },
  // 下拉分页
  onReachBottom() {
    let { pageIndex, pageSize, list, current, member_no, total } = this.data
    pageIndex = pageIndex + 1
    // wx.showLoading({
    //   title: '加载中',
    // })
    if (list.length < total) {
      axios({
        url: '/api/jd/jdOrderList',
        data: {
          status: current,
          memberNo: member_no,
          pageIndex,
          pageSize,
        }
      }).then(res => {
        console.log(res);
        this.setData({
          list: [...list, ...res.data.data.list],
          pageIndex
        })
      })
    } else {
      wx.showToast({
        title: '已经到底了',
        icon: 'none'
      })
    }
    wx.hideLoading()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})