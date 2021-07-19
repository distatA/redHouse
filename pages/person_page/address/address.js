// pages/home_page/address/address.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moren:0,
    moren2:1,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  // 地址列表
  loadAddress:function(){
    let that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.request({
          url: app.globalData.URL + '/api/myself/getAddressList',
          data: {
            memberId: res.data.member_no
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (response) {
            // console.log(response.data.data);
            that.setData({
              addressList: response.data.data
            })
            wx.setStorage({
              key: 'addressList',
              data: response.data.data,
            })
            
          }
        })
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadAddress();
  },
// 微信授权地址
  add:function(){
    
    wx.navigateTo({
      url: '../../person_page/add_address/add_address?types=' + 0,
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
  // 添加地址
  addAddress:function(){
    wx.navigateTo({
      url: '../../person_page/add_address/add_address?types=' + 1,
    })
   
  },
  backPage: function (e) {
    console.log("返回上一页面");
    let thisNum = e.currentTarget.dataset.num;
    // console.log(thisNum);
    var thisAddress = {};
    thisAddress.id = this.data.addressList[thisNum].id;
    thisAddress.name = this.data.addressList[thisNum].name;
    thisAddress.mobile = this.data.addressList[thisNum].mobile;
    thisAddress.region = this.data.addressList[thisNum].region;
    thisAddress.address = this.data.addressList[thisNum].address;
    // console.log(thisAddress);
    wx.setStorage({
      key: 'thisAddress',
      data: thisAddress,
    })
    wx.navigateBack({
      delta: 1
    })
  },
  // 删除地址
  deleteBtn:function(e){
    let that = this;
    let deleteNum = e.currentTarget.dataset.num;
    let id = this.data.addressList[deleteNum].id;
    wx.showModal({
      // title: '提示',
      content: "是否确认删除",
      cancelText: "取消", //默认是“取消”
      cancelColor: '#333333', //取消文字的颜色
      confirmText: "确认", //默认是“确定”
      confirmColor: '#FF7054', //确定文字的颜色
      success(res) {
        console.log(res)
        if (res.confirm) {
          wx.getStorage({
            key: 'idNum',
            success: function (res) {
              wx.request({
                url: app.globalData.URL + '/api/myself/delAddress',
                data: {
                  id: id,
                  memberNo: res.data.member_no
                },
                method: 'GET',
                header: {
                  "token": res.data.token,
                  'content-type': 'application/json'
                },
                success: function (response) {
                  if (response.code==200){
                    wx.showToast({
                      title: response.data,
                    })
                  }
                  that.loadAddress();
                }
              })
            },
          })
        } else if (res.cancel) {

        }
      }
    })
    
  },
  // 编辑
  editBtn:function(e){
    let that = this;
    let updateNum = e.currentTarget.dataset.num;
    let updateAddress = this.data.addressList[updateNum];
    console.log(updateNum);
    wx.setStorage({
      key: 'updateAddress',
      data: updateAddress,
    })
    wx.navigateTo({
      url: '../../person_page/update_address/update_address'
    })
  },
  // 是否设置为默认地址
  setMoren:function(e){
    let that = this;
    let setNum = e.currentTarget.dataset.num;
    let id = this.data.addressList[setNum].id;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.request({
          url: app.globalData.URL + '/api/myself/setDefaultAddress',
          data: {
            id: id,
            memberNo: res.data.member_no
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (response) {
            that.loadAddress();
          }
        })
      },
    })
  },
})