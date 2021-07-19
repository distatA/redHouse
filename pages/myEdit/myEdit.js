// pages/myEdit/myEdit.js
const app = getApp();
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0,
    sex:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      spu: options.spu ? options.spu:'',
      name: options.name,
      img: options.img?options.img:'', 
      merchant_no: options.merchant_no ? options.merchant_no:'',
      price: options.price !='undefined' ? options.price:'',
      type: options.type ? options.type:'',//1房产
      status:options.status,//1未绑定设置 2 绑定后设置
      prices: options.prices !='undefined' ? options.prices:'',//设置的佣金
      textValue: options.share != 'undefined'? options.share:'',//分享的内容

    })
    if(this.data.type ==1 ){
      let textValue1 =  '我在第一房发现了优质好房，分享给你'
      this.setData({textValue1})
    }else{
      let textValue1 =  '我在第一房发现了优质好物，分享给你'
      this.setData({textValue1})
    }

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
  // 佣金选择
  radioChange(e) {
    console.log(e.detail.value)
    this.setData({
      sex: e.detail.value
    })
  },
  // 输入框
  getInputValue: function (e) {
    this.setData({
      searchValue: e.detail.value
    })
  },
  // 鼠标获取焦点
  bindIuput: function (e) {

    var value = common.trim(e.detail.value);
    // console.log(value)
    if (value.length > 50) {
      wx.showToast({
        title: '输入超过50了',
        icon: 'none'
      })
      return false;
    }
    this.setData({
      textValue: value,
      num: value.length
    })
  },
  // 鼠标失去焦点
  bindTextAreaBlur: function (e) {

    var value = common.trim(e.detail.value);
    if (value.length > 50) {
      wx.showToast({
        title: '输入超过50了',
        icon: 'none'
      })
    }
    this.setData({
      textValue: value,
      num: value.length
    })

  },
  bindTextAreaBlur1: function (e) {
    var value = common.trim(e.detail.value);
    this.setData({
      textValue1: value,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
// 提交编辑
  submit:function(){
    var that = this;
    
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        console.log(res)
        // 编辑完成后添加到我的橱窗
        common.ajaxGet('/api/window/bandGoods',
          {
            member_no: res.data.member_no,
            spu_no: that.data.spu,
            spu_name: that.data.name,
            brand_name: '',
            imageUrl: that.data.img,
            merchant_no: that.data.merchant_no ,
            price: that.data.searchValue != undefined ? that.data.searchValue:'',
            goods_share: that.data.textValue,
            remark: that.data.textValue1 
          },
          function (data) {
            console.log(data)
            if (data.code == 200) {
              wx.showToast({
                title: '绑定成功',
              })
              setTimeout(function () {
                wx.navigateBack({})

              }, 1500)
            }else{
              wx.showToast({
                title: data.message,
                icon:'none'
              })
            }
           
          })
           
          
      }

    })
  },
  // 再次编辑
  submits:function(){
    var that = this;
    if (that.data.prices != '' && that.data.searchValue == undefined) {
      var price = that.data.prices
    } else {
      var price = that.data.searchValue != undefined ? that.data.searchValue : ''
    }
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        common.ajaxGet('/api/window/set',
          {
            member_no_me: res.data.member_no,
            spu_no: that.data.spu,
            price: price,
            goods_share: that.data.textValue,
            remark: that.data.textValue1
          },
          function (data) {
            if(data.code==200){
              wx.showToast({
                title: '编辑成功',
              })
              setTimeout(function () {
                wx.navigateBack({})
              }, 1500)
            }else{
              wx.showToast({
                title: data.message,
                icon:'none'
              })
            }
          }
        )
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})