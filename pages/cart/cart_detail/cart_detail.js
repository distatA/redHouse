// pages/cart/cart_detail/cart_detail.js
const app = getApp();
var common = require("../../../utils/common.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    commitCart: [],
    allNum: 0,
    count_num: 0,
    member_no: '',
    pay_method: 1,
    send_method: 1,
    // address_id: 0,
    total_money: 0,
    send_money: 0,
    payment: 0,
    type: 2,
    openId: '',
    orderProductList: [],

    spu_no: '',
    sku_no: '',
    good_name: '',
    singlNum: 0,
    singlPrice: 0,
    singlTotal_money: 0,
    guige: '',
    imageUrl: '',
    shopMember_no: '',
    shopNumber: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'addressList',
      success: function (res) {
        that.setData({
          thisAddress: res.data[0]
        })
      },
      fail(error) {
        console.log("当前地址不存在");
        that.judgeAddress();
      }
    })

    // 获取提交的购物车
    this.getCommitCart();

    // this.thisGoodDetail();
    //更改商品数据信息
    this.changeMsg();
  },
  // 获取提交的购物车
  getCommitCart: function () {
    let that = this;
    wx.getStorage({
      key: 'commitCart',
      success: function (res) {
        console.log(res.data);
        let tempCart = res.data;
        let allmoney = 0;
        let allnum = 0;
        for (let i = 0; i < tempCart.length; i++) {
          for (let j = 0; j < tempCart[i].goodList.length; j++) {
            if (tempCart[i].goodList[j].state == true) {
              allmoney += tempCart[i].goodList[j].total_money;
              allnum += tempCart[i].goodList[j].num;
            }
          }
        }

        that.setData({
          commitCart: res.data,
          total_money: allmoney,
          allNum: allnum
        })
      },
    })
  },
// 收货地址
  judgeAddress: function () {
    var that = this;
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
            wx.setStorage({
              key: 'addressList',
              data: response.data.data,
            })
            if (response.data.data.length == 0) {
              wx.navigateTo({
                url: '../../person_page/address/address',
              })
            }
            that.setData({
              thisAddress: response.data.data[0]
            })
          }
        })
      },
    })
  },
  // thisGoodDetail: function () {
  //   var that = this;
  //   wx.getStorage({
  //     key: 'thisThing',
  //     success: function (res) {
  //       // console.log(res);
  //       let price = res.data.num * res.data.low_price;
  //       // console.log(price);
  //       that.setData({
  //         thing: res.data,
  //         total_money: price,
  //         payment: that.data.total_money
  //       })
  //     },
  //   })
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad();
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
  changeMsg: function () {
    let that = this;

    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        that.setData({
          member_no: res.data.member_no,
          openId: res.data.openId
        })
      },
    });
    wx.getStorage({
      key: 'addressList',
      success: function (res) {
        console.log(res.data[0].id)
        that.setData({
          address_id: res.data[0].id
        })
      },
    });

    wx.getStorage({
      key: 'thisIndexLi',
      success: function (res) {
        that.setData({
          good_name: res.data.goods_name,
          shopMember_no: res.data.member_no,
        })
      },
    })

    wx.getStorage({
      key: 'thisShop',
      success: function (res) {
        shop_name: res.data.shop_name
      },
    })
  },

  payMoney: function () {
    let that = this;
    wx.showLoading({
      title: 'Loading...',
    })
    let tempCart = this.data.commitCart;
    console.log(tempCart)
    var now = parseInt(new Date().getTime()); //当前时间戳
    var nowTime = common.timeFormat(now)//时间
    //打印发送信息
    let proList = new Array();
  
    for (let m = 0; m < tempCart.length; m++) {
      // proList[m] = new Array();
      for (let n = 0; n < tempCart[m].goodList.length; n++) {
        proList.push(tempCart[m].goodList[n])
        // proList[m][n].address_id = that.data.address_id;
        // proList[m][n].share_create_time = nowTime;
      }
    }
    // for (let m = 0; m < tempCart.length; m++) {
    //   proList[m] = new Array();
    //   for (let n = 0; n < tempCart[m].goodList.length; n++) {
    //     proList[m][n] = tempCart[m].goodList[n];
    //     proList[m][n].address_id = that.data.address_id;
    //     proList[m][n].share_create_time = nowTime;
    //   }
    // }
    var allTemp = {};
  
    // allTemp.count_num = this.data.allNum;
    allTemp.member_no = this.data.member_no;
    // allTemp.pay_method = this.data.pay_method;
    // allTemp.send_method = this.data.send_method;
    allTemp.address_id = this.data.address_id;
    // allTemp.total_money = this.data.total_money;
    allTemp.send_money = this.data.send_money;
    // allTemp.payment = this.data.total_money;
    // allTemp.type = this.data.type;
    // allTemp.openId = this.data.openId;
  
    console.log(proList)
    allTemp.shopGoodsVoList = proList;

    // 生成订单
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.hideLoading();
        var memberNo = res.data.member_no;
        var token = res.data.token;
        wx.request({
          url: app.globalData.URL + '/api/goods/goodsShopOrder',
          data: JSON.stringify(allTemp),
          method: 'POST',
          header: {
            "token": res.data.token,
            "Content-Type": "application/json"
          },
          success: function (response) {
            console.log(response);
            let productList = response.data.data.myOrderNoList;
            let pro2 = [];
            let c = 0;
            for (let a = 0; a < productList.length; a++) {
              for (let b = 0; b < productList[a].length; b++) {
                pro2[c++] = productList[a][b];
              }
            }

            wx.setStorage({
              key: 'pro2',
              data: pro2,
            })
            var time = response.data.data.time;
            var numbers = response.data.data.myOrderNoList;
            // console.log(numbers)
            var payment = that.data.total_money;

            wx.navigateTo({
              url: '/pages/submitOrder/submitOrder?time=' + time + '&numbers=' + numbers + '&payment=' + payment + '&types=' + 2,
            })
            return false;

            let result = response.data.data.wxPayMpOrderResult;
            console.log(response.data.data)
            if (response.data.data) {
              wx.requestPayment({
                'timeStamp': result.timeStamp,
                'nonceStr': result.nonceStr,
                'package': result.packageValue,
                'signType': result.signType,
                'paySign': result.paySign,
                'success': function (res) {
                  console.log(res);
                  console.log("支付成功");
                  // 支付成功，进入下一步
                },
                'fail': function (res) {
                  wx.showLoading({
                    title: 'Loading...',
                  })
                  console.log(res);

                  wx.request({
                    url: app.globalData.URL + '/api/goods/wxNoPay',
                    data: {
                      goodsOrderProductList: pro2
                    },
                    method: 'POST',
                    header: {
                      "token": token,
                      "Content-Type": "application/json"
                    },
                    success: function (res) {
                      wx.hideLoading();
                      console.log(res);
                      // 判断当前几个商家，跳转页面
                      if (that.data.commitCart.length > 1) {
                        console.log("跳转我的订单页面");
                        wx.navigateTo({
                          url: '../../person_page/orders/orders?page=1',
                        })
                      } else if (that.data.commitCart.length == 1) {
                        console.log("跳转待支付商品详情页");
                        wx.navigateTo({
                          url: '../../order_page/wait_pay/wait_pay',
                        })
                      }
                    }
                  })
                },
              })
            }
          }
        })
      },
    })
  },




})