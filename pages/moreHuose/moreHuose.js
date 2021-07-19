// pages/moreHuose/moreHuose.js
const app = getApp();
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    display:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      module_id: options.id ? options.id :'',
      color: options.color ? options.color :'#FF6B09',
      type: options.type ? options.type : '',
    })
    wx.login({
      success: res => {
        that.data.code = res.code
      }
    })
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        that.setData({
          member_no_me: res.data.member_no,
          nickName: res.data.nickName,//昵称
          headUrl: res.data.headUrl,//头像
          phone: res.data.mobile ? res.data.mobile : '',//手机号码 
        })
      }
    });
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
    this.moreList()
    this.lunbo()
  },
  // 轮播图
  lunbo: function () {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        common.ajaxGet(
          '/api/module/getImage',
          {
            module_id: that.data.module_id,
          },
          function (data) {
            console.log(data)
            if (data.code == 200) {
              that.setData({
                imgUrl: data.data
              })
            } else {
              wx.showToast({
                title: data.message,
                icon: 'none'
              })
            }
          }
        )
      },
    })
  },
// 列表
moreList:function(){
  var that = this;
  wx.getStorage({
    key: 'idNum',
    success: function (res) {
      common.ajaxGet(
        '/api/module/getMore',
        {
          module_id: that.data.module_id,
          pageIndex:1,
          pageSize:10
        },
        function (data) {
          console.log(data)
          if (data.code == 200) {
            that.setData({
              detailList: data.data.list,
              pageIndex: data.data.pageNum,
              pages: data.data.pages
            })
          } else {
            wx.showToast({
              title: data.message,
              icon: 'none'
            })
          }
        }
      )
    },
  })
},
// 项目详情
temp:function(e){
  var that = this;
  var spu = e.currentTarget.id;
  var type = e.currentTarget.dataset.type;
  console.log(e)
  if(type==1){
    wx.navigateTo({
      url: '/pages/huose/huose?shopId=' + spu,
    })
  } else {
    wx.navigateTo({
      url: '/pages/home_page/good_detail/good_detail?shopId=' + spu,
    })
  }
},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  // 预约报名
  yuYue: function (e) {
    console.log(e)
    var start = e.currentTarget.dataset.start.split(' ');
    var end = e.currentTarget.dataset.end.split(' ');

    this.setData({
      display: 2,
      spu_no: e.currentTarget.id,//绑定项目的spu_no
      spu_name: e.currentTarget.dataset.name,//绑定项目的spu_name
      coupon_id: e.currentTarget.dataset.appurl,//优惠券编号
      coupon_name: e.currentTarget.dataset.coupon,//优惠券名
      end_time: end[0] ,//结束时间
      start_time: start[0] ,//开始时间
      merchant_no: e.currentTarget.dataset.merchant
    })
  },
  // 关闭弹框
  closeZz: function (e) {
    this.setData({
      display: 1,
    })
  },
  //姓名
  getnameValue: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  //手机号
  getphoneValue: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 看房时间
  bindDateChange: function (e) {
    this.setData({
      userDate: e.detail.value
    })
  },
  // 提交信息
  submit: function () {
    var that = this;
    var name = that.data.name;
    var userDate = that.data.userDate;

    // if (name == undefined) {
    //   wx.showToast({
    //     title: '请填写您的姓名',
    //     icon: 'none'
    //   })
    //   return false;
    // }

    if (!that.data.phone) {
      wx.showToast({
        title: '请填写手机号码',
        icon: 'none'
      })
      return false;
    }
    wx.getStorage({
      key: 'idNum',
      success: function (res) {

        common.ajaxPost(
          '/api/house/sub',
          {
            member_no: res.data.member_no,//预约人
            mobile: that.data.phone,//预约人手机号码 
            name: '',//预约人姓名
            look_time: '',//看房时间
            item_member_no: '',//项目联系人
            recommend_member_no: '',//推荐人
            spu_no: that.data.spu_no,//房产编号
            coupon_id: that.data.coupon_id,//优惠券编号
            merchant_no: that.data.merchant_no,
          },
          function (data) {
            console.log(data)
            if (data.code == 200) {
              wx.navigateTo({
                url: '/pages/hDetail/hDetail?id=' + data.data,
              })
              that.setData({
                display: 1
              })
            } else {
              wx.showToast({
                title: data.message,
                icon: 'none'
              })
            }
          }
        )
      },
    })
  },
  // 授权手机号码
  getPhoneNumber: function (e) {
    var iv = e.detail.iv;
    var encryptedData = e.detail.encryptedData;
    var that = this;
    wx.checkSession({
      success(res) {
        // session_key 未过期，并且在本生命周期一直有效
        wx.request({
          url: app.globalData.URL + '/api/myMobileAuth/getMobile',
          data: {
            code: that.data.code,
            iv: iv,
            encryptedData: encryptedData,
          },
          method: 'GET',
          success: function (res) {
            // console.log(res)
            if (e.detail.errMsg == 'getPhoneNumber:ok') {
              console.log('授权成功')
              that.setData({
                phone: res.data.data,
                currentTab: 3
              })
              wx.setStorage({
                key: 'phone',
                data: res.data,
              })
            } else {
              wx.showToast({
                title: '获取号码失败',
                icon: 'none'
              })
              that.setData({
                currentTab: 3
              })
            }
          }
        })

      },

    })
  },
  /* 弹窗的时候 阻止冒泡 */
  myCatchTouch: function () {
    console.log('stop user scroll it!');
    return;
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
    var pages = that.data.pages;
    var pageIndex = that.data.pageIndex;
    if (pageIndex<pages){
      // wx.showLoading({
      //   title: '加载中...',
      // })
      wx.getStorage({
        key: 'idNum',
        success: function (res) {
          common.ajaxGet(
            '/api/module/getMore',
            {
              module_id: that.data.module_id,
              pageIndex: pageIndex + 1,
              pageSize: 10
            },
            function (data) {
              wx.hideLoading()
              if (data.code == 200) {
                that.setData({
                  detailList: that.data.detailList.concat(data.data.list),
                  pageIndex: data.data.pageNum,
                  pages: data.data.pages
                })
              } else {
                wx.showToast({
                  title: data.message,
                  icon: 'none'
                })
              }
            }
          )
        },
      })
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})