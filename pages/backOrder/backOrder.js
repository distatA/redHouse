// pages/backOrder/backOrder.js
const app = getApp();
var common = require("../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr:[],
    show: false,
    shows: false,
    isView: true,
    isViews: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options) {
      this.setData({
        id: options.id ? options.id : '',
        refuse_type: options.type ? options.type : '',//1退款（无需退货） 2退货退款
        // good_name: options.good_name,
        // shopImage: options.shopImage,
        // shop_name: options.shop_name,
      })
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
    this.getrefuseDetails()//退款申请状态
    this.getReason()
    this.getPhone()//客服热线
  },
  //退款申请状态
  getrefuseDetails: function () {
    var that = this;
    common.ajaxGet(
      '/api/refuse/goodsRefuseDetails',
      {
        id: that.data.id,
      },
      function (res) {
        if (res.code == 200) {
          that.setData({
            // status: res.data.status,//0-申请中  1 申请通过  2申请失败
            result: res.data,
            reasonId: res.data.refuse_reason_id,//退货原因ID
          })
          if (res.data.status == 26) {//撤销按钮
            that.setData({
              isView: false
            })
          } else if (res.data.status == 3 || res.data.status == 22 || res.data.status == 25 ) {//平台介入按钮
            that.setData({
              isViews: true
            })
          }
          // 倒计时
          if (res.data.expireTime > 0) {
            var haveTime = res.data.expireTime;
            let down = setInterval(() => {
              haveTime -= 1;
              let day = Math.floor(haveTime / 3600 / 24);
              let hour = Math.floor(haveTime / 3600);
              let restTime = haveTime % 3600;
              if (hour < 10) { hour = '0' + hour; }
              let minute = Math.floor(restTime / 60);
              if (minute < 10) { minute = '0' + minute; }
              let second = restTime % 60;
              if (second < 10) { second = '0' + second; }

              if (haveTime > 0) {
                that.setData({
                  hour: hour,
                  minute: minute,
                  second: second,
                });
              }
              if (haveTime <= 0) {
                that.setData({
                  hour: 0,
                  minute: 0,
                  second: 0,
                });
                // that.getrefuseDetails()
              }
            }, 1000);
          }else{
            
          }
        }
      }
    )
  },
  // 申请原因
  getReason: function () {
    var that = this;
    common.ajaxPost(
      '/api/itemAndDetail/getItemDetail', { itemName: '退款理由' },
      function (res) {
        if (res.code == 200) {
          var list = that.data.arr;
          for (var i = 0; i < res.data.length; i++) {
            list.push(res.data[i].item_detail)
          }
          console.log(list)
          that.setData({
            arr: list,

          })
          console.log(that.data.arr[that.data.reasonId - 1])
        }
      }
    )
  },
// 选择物流
  bindPickerChange2(e) {
    var identity;
    var arr = this.data.arr;
    console.log(e.detail.value)
    this.setData({
      index: e.detail.value,
      identity: arr[e.detail.value]
    })

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
//退货信息
  backNews: function () {
  
    wx.navigateTo({
      url: '/pages/backNews/backNews?defense_no=' + this.data.result.defense_no,
    })
  },
  //详情弹窗
  detail: function () {
    this.setData({
      show: true
    })
  },
  onClose() {
    this.setData({ show: false });
  },
  details: function () {
    this.setData({
      shows: true
    })
  },
  onCloses() {
    this.setData({ shows: false });
  },
  //撤销申请
  backout: function (e) {
    var that = this;
    var id = that.data.id;
    wx.showModal({
      title: '您确定要撤销申请吗?',
      content: '退货/退款申请仅可以撤销一次',
      success(res) {
        if (res.confirm) {//用户点击确定
          console.log('用户点击确定')
          common.ajaxGet(
            '/api/refuse/cancalGoodsRefund',
            { id: id },
            function (res) {
              if (res.code == 200) {
                wx.showToast({
                  title: '撤销成功',
                })

                that.getrefuseDetails()//退款申请状态
              }
            }
          )
        } else if (res.cancel) {//用户点击取消
          console.log('用户点击取消')
        }
      }
    })
  },
  //平台介入
  pingTai: function () {
    var that = this;
    var id = that.data.id;
    if (that.data.result.status == 26) {
      wx.showToast({
        title: '您的申请已撤销,平台无法介入',
        icon: 'none'
      })
    } else {
      common.ajaxGet(
        '/api/refuse/companyGoodsRefuseInto',
        { id: id },
        function (res) {
          if (res.code == 200) {
            wx.showToast({
              title: '您已申请平台介入',
            })
            that.getrefuseDetails()//退款申请状态
          }
        }
      )
    }

  },
  //商家店铺
  shopHome: function (e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/shopHome/shopHome?merchant_no=' + id,
    })
  },
  // 客户电话
  getPhone: function () {
    var that = this;
    common.ajaxPost(
      '/api/itemAndDetail/getItemDetail', { itemName: '客服热线' },
      function (res) {
        if (res.code == 200) {
          that.setData({
            phone: res.data[0] ? res.data[0].item_detail : ''
          })

        }
      }
    )
  },
  // 拨打电话
  calling: function (e) {
    if (this.data.phone && this.data.phone != '') {
      wx.makePhoneCall({
        phoneNumber: this.data.phone,
        success: function () {
          console.log("拨打电话成功！")
        },
        fail: function () {
          wx.showToast({
            title: '拨打电话失败！',
            icon: 'none'
          })
        }
      })
    } else {
      wx.showToast({
        title: '暂未设置客户电话',
        icon: 'none'
      })
    }

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