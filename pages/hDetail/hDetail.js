// pages/hDetail/hDetail.js
const app = getApp();
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    isView: true,
    display: 1,
    goodsCoupon:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      subId: options.id,
    })
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        that.setData({
          member_no_me: res.data.member_no,
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
    this.getDetail() // 预约详情
  },
  // 预约详情 
  getDetail: function () {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        // console.log(res)
        common.ajaxGet(
          '/api/house/detail', {
            id: that.data.subId,
            member_no: res.data.member_no
          },
          function (data) {
            console.log(data)
            if (data.code == 200) {
              var arr = data.data.list;
              for (let i = 0; i < data.data.list.length; i++) {
                if (data.data.list[i].imageUrl != '') {
                  console.log(data.data.list[i].imageUrl.split(','))

                  arr[i].imageUrl = data.data.list[i].imageUrl.split(',');
                }
              }
              // 判断当前登录人是否是报名人
              if (res.data.member_no == data.data.houseSubDetailsVo.item_member_no) {
                that.setData({
                  isView: false,
                })
              }
              console.log(arr)
              if (data.data.goodsCoupon) {
                var start = data.data.goodsCoupon.coupon_start_time.split(' ');
                var end = data.data.goodsCoupon.coupon_end_time.split(' ');
                that.setData({
                  detail: data.data.houseSubDetailsVo,
                  tousu: arr, //投诉
                  headUrl: res.data.headUrl,
                  nickName: res.data.nickName,
                  goodsCoupon: data.data.goodsCoupon ? data.data.goodsCoupon : '',
                  end_time: end[0], //结束时间
                  start_time: start[0], //开始时间
                })
              } else {
                that.setData({
                  detail: data.data.houseSubDetailsVo,
                  tousu: arr, //投诉
                  headUrl: res.data.headUrl,
                  nickName: res.data.nickName,
                  goodsCoupon: data.data.goodsCoupon ? data.data.goodsCoupon : '',

                })
              }



            }
          }
        )
      },
    })
  },
  // 取消预约
  close: function () {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        common.ajaxGet(
          '/api/house/cancel', {
            id: that.data.subId,
            member_no: res.data.member_no,
          },
          function (data) {
            console.log(data)
            if (data.code == 200) {
              wx.showToast({
                title: '取消成功',
              })
              setTimeout(function () {
                wx.navigateBack({})
              }, 500)
            } else {
              wx.showToast({
                title: data.message,
                icon: 'none'
              })
            }
          }
        )
      }
    })
  },
  // 优惠券说明
  shuoming: function (e) {
    wx.navigateTo({
      url: '/pages/youHui/youHui?explanation=' + e.currentTarget.id,
    })
  },
  // 1评价 2投诉
  touSu: function (e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/touSu/touSu?type=' + id + '&id=' + this.data.subId,
    })
  },
  //评论
  conment: function (e) {
    var id = this.data.detail.code; //预约编号
    var name = this.data.detail.entryName; //项目名称
    var img = this.data.detail.imageUrl;
    var spu = this.data.detail.spu_no;
    wx.navigateTo({
      url: '/pages/goodsComment/goodsComment?member_no=' + id + '&name=' + name + '&img=' + img + '&status=' + 1 + '&spu=' + spu,
    })
  },
  // 拨打电话
  calling: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.detail.item_member_no ? this.data.detail.item_member_mobile : this.data.detail.project_mobile,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        wx.showToast({
          title: '拨打电话失败！',
          icon: 'none'
        })
        console.log("拨打电话失败！")
      }
    })
  },
  // 去核销
  showPopup(e) {

    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        common.ajaxGet(
          '/api/house/verification', {
            id: that.data.subId,
            member_no: res.data.member_no,
          },
          function (res) {
            console.log(res.data)
            if (res.code == 200) {

              that.setData({
                show: true,
                // startTime: res.data.startTime.split(' ')[0],
                // endTime: res.data.endTime.split(' ')[0],
                houseCode: res.data,
                codeImg: "data:image/png;base64," + res.data.hx_url, //拼接base64
              })
              if (res.data.write_off_start_time) {
                that.setData({
                  startTime: res.data.write_off_start_time.split(' ')[0],
                  endTime: res.data.write_off_end_time.split(' ')[0],
                })
              }
            } else {
              wx.showToast({
                title: res.message,
                icon: 'none'
              })
            }
          }
        )
      },

    })
  },
  // 点击刷新
  brechen: common.throttles(function (e) {
    this.showPopup()
  }, 1000 * 60 * 4),

  onClose() {
    this.setData({
      show: false
    });
  },
  //商家店铺
  shopHome: function (e) {
    var id = e.currentTarget.id;

    wx.navigateTo({
      url: '/pages/shopHome/shopHome?merchant_no=' + id,
    })
  },
  // 房产详情
  hDetail: function (e) {
    var goods_name = e.currentTarget.dataset.goods_name;
    var shopId = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/huose/huose?shopId=' + shopId + '&goods_name=' + goods_name,
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
  // 看房时间
  bindDateChange: function (e) {
    this.setData({
      userDate: e.detail.value
    })
  },
  //手机号
  getphoneValue: function (e) {
    this.setData({
      phone: e.detail.value
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

        common.ajaxGet(
          '/api/house/trans', {

            telphone: that.data.phone, //预约人手机号码 
            id: that.data.subId, //项目id
            coupon_id: that.data.goodsCoupon.id, //优惠券编号

          },
          function (data) {
            console.log(data)
            if (data.code == 200) {
              that.getDetail()
              that.setData({
                display: 1,
              })
              wx.showToast({
                title: '转让成功',
                icon: 'none'
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
  // 转让
  zhuan: function () {
    this.setData({
      display: 2,
    })
  },
  // 关闭弹框
  closeZz: function (e) {
    this.setData({
      display: 1,
    })
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