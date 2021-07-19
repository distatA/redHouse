const { axios } = require("../../utils/common.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:'',
    member_no:'',
    city:''
  },
  toSearch(e){

    let { member_no , value ,city} = this.data 
    if(value.trim() !== ''){
      this.getOrder(member_no,value,city)
    }else {
      wx.showToast({title: '输入不能为空',icon: 'none',})
    }
  },
  getOrder(memberNo,orderId,city){
    axios({
      url:'/api/jd/recoverOrder',
      data:{ memberNo,orderId,city}
    }).then(res=>{
      console.log(res,'132875620400');
      if(res.data.code === 201){
        wx.navigateTo({ url: '../JDorder/index'})
      }else{
        // wx.showToast({title: res.data.message,icon: 'none',})
      }
    })
  },
  // 监听输入框的值
  input(e){
    this.setData({value:e.detail.value})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   let { member_no ,city } = wx.getStorageSync('idNum') || ''
   this.setData({member_no,city})
   console.log(member_no);
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