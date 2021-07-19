// pages/applyOrder/applyOrder.js
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
     console.log(options)
    this.setData({
      total_money: options.total_money,
      my_order_no: options.my_order_no,
      name: options.name,
      img: options.img,
      price: options.price,
      num: options.num,
      specification: options.specification,
      sku : options.sku,
      spu : options.spu,
      status: options.status,
      merchantno : options.merchantno,
      image : options.image,
      shopname: options.shopname,
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
// 跳到退货详情
jump2:function(){
  console.log(this.data)
  var name = this.data.name;
  var img = this.data.img;
  var price = this.data.price;
  var num = this.data.num;
  var specification = this.data.specification;
  var sku = this.data.sku;
  var spu = this.data.spu;
  var status = this.data.status;
  var merchantno = this.data.merchantno;
  var image = this.data.image;
  var shopname = this.data.shopname;
  var total_money = this.data.total_money
  wx.navigateTo({
    url: '/pages/applyOrderDetail/applyOrderDetail?type=' + 1 + '&my_order_no=' + this.data.my_order_no + '&name=' + name + '&img=' + img + '&price=' + price + '&num=' + num + '&specification=' + specification + '&sku=' + sku + '&spu=' + spu + '&status=' + status + '&merchantno=' + merchantno + '&image=' + image + '&shopname=' + shopname + '&total_money=' + total_money ,//退款(无需退货)
  })
},
jump: function () {
  var name = this.data.name;
  var img = this.data.img;
  var price = this.data.price;
  var num = this.data.num;
  var specification = this.data.specification;
  var sku = this.data.sku;
  var spu = this.data.spu;
  var status = this.data.status;
  var merchantno = this.data.merchantno;
  var image = this.data.image;
  var shopname = this.data.shopname;
    wx.navigateTo({
      url: '/pages/applyOrderDetail/applyOrderDetail?type=' + 2 + '&my_order_no=' + this.data.my_order_no + '&name=' + name + '&img=' + img + '&price=' + price + '&num=' + num + '&specification=' + specification + '&sku=' + sku + '&spu=' + spu + '&status=' + status + '&merchantno=' + merchantno + '&image=' + image + '&shopname=' + shopname,//退货退款
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