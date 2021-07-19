// pages/home_page/certificate/certificate.js
const app = getApp();
var common = require("../../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personTag:0,
    companyTag:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.personTag)
    console.log(this.data.companyTag)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  changeChoose1:function(){
    this.setData({
      personTag:1,
      companyTag:0
    })
 
      if (this.data.people != '') {
        wx.navigateTo({
          url: '../certificate/personal/personal?type=' + 0 + '&types=' + 1,
        })
      } 

    
  },
  changeChoose2: function () {
    this.setData({
      personTag: 0,
      companyTag: 1
    })
      if (this.data.company != '') {
        wx.navigateTo({
          url: '/pages/company/company?type=' + 0 + '&types=' + 2,
        })
      }  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getStatus()//判断是否已经认证
  },
//判断是否已经认证
getStatus:function(){
  var that = this;
  wx.getStorage({
    key: 'idNum',
    success: function(res) {
      common.ajaxGet(
        '/api/myRedAuth/authStatus',
        {
          member_no: res.data.member_no
        },
        function(data){
          if(data.code==200){
            that.setData({
              people: data.data.people ? data.data.people : '',//个人认证状态
              company: data.data.company ? data.data.company : '',//企业认证状态
            })
          }
        }
      )
    },
    fail: function () {
      // wx.hideLoading()
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

  },
  apply:function(){
    if (this.data.companyTag == 1){
      if (this.data.people ==''){
        wx.navigateTo({
          url: '/pages/company/company?type=' + 1 + '&types=' + 2,//type(0提交过 1为提交) types(1个人 2企业)
        })
      } else {
        wx.showToast({
          title: '个人与企业不能同时认证',
          icon: 'none'
        })
      }
        
    } else if (this.data.personTag == 1){
      if (this.data.company ==''){
        wx.navigateTo({
          url: '../certificate/personal/personal?type=' + 1 + '&types=' + 1,
        })

      }else{
        wx.showToast({
          title: '个人与企业不能同时认证',
          icon:'none'
        })
      }
      
    }else{
      wx.showModal({
        title: '提示',
        content: '请选择认证类型',
      })
    }
  }
})