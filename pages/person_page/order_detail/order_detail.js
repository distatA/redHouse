// pages/person_page/order_detail/order_detail.js
const app = getApp();
var common = require("../../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
    count_num:0,
    member_no:'',
    pay_method:1,
    send_method:1,
    // address_id:0,
    total_money:0,
    send_money:0,
    payment:0,
    type:2,
    openId:'',
    orderProductList:[],
    spu_no:'',
    sku_no:'',
    good_name:'',
    singlNum:0,
    singlPrice:0,
    singlTotal_money:0,
    guige:'',
    imageUrl:'',
    shopMember_no:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.sendMoney)
      this.setData({
        comeFrom: options.comeFrom,
        category_id: options.category_id,//2实体 3虚拟
        sendMoney: options.sendMoney != 'undefined' ? options.sendMoney : 0,//运费
        share_member_no: options.share_member_no ? options.share_member_no : '',//分享人的ID
        buy_source: options.buy_source,//购买来源
      })   
    if (options.category_id==2){
      this.judgeAddress();//地址列表
    }
    
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    var that = this;
   
    that.thisGoodDetail();//商品信息
    if (that.data.category_id==2){
      that.judgeAddress2()//地址列表
    }
    
    that.changeMsg();//更改商品数据信息
  },
  // 地址列表
  judgeAddress:function(){
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.request({
          url: app.globalData.URL + '/api/myself/getAddressList',
          data: {
            memberId:res.data.member_no
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (response) {
            console.log(response.data.data); 
            if (response.data.data.length == 0){
              wx.navigateTo({
                url: '../../person_page/address/address',
              })
            }else{
              wx.setStorage({
                key: 'addressList',
                data: response.data.data,
              })
              that.setData({
                thisAddress: response.data.data[0],
                address_id: response.data.data[0].id
              })
            }
            
          }
        })
      },
    })
  },
  // 地址列表
  judgeAddress2: function () {
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
            if (response.data.data.length > 0) {
              wx.setStorage({
                key: 'addressList',
                data: response.data.data,
              })
              that.setData({
                thisAddress: response.data.data[0],
                address_id: response.data.data[0].id
              })
            } 
          }
        })
      },
    })
  },
  // 商品信息
  thisGoodDetail:function(){
    var that = this;
    
    wx.getStorage({
      key: 'thisThing',
      success: function(res) {
        console.log(res);
        let price = res.data.num * res.data.low_price;
        let money = Number((Number(price) + Number(that.data.sendMoney)).toFixed(2))
        console.log(Number(that.data.sendMoney))
        console.log(Number(price))
        console.log(Number(money))

        that.setData({
          thing:res.data,
          price:price,
          total_money: money,
          payment: money
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  changeMsg:function(){
    let that = this;
    wx.getStorage({
      key: 'thisThing',
      success: function(res) {
        let singleAllPrice = res.data.num * res.data.low_price;
        that.setData({
          sku_no: res.data.sku_no ? res.data.sku_no : '',
          spu_no: res.data.spu_no,
          sku_name: res.data.sku_name,
          singlNum : res.data.num,
          singlPrice:res.data.low_price,
          singlTotal_money: singleAllPrice,
          guige: res.data.guige ? res.data.guige :'',
          imageUrl:res.data.image_url,
          merchant_no: res.data.merchant_no,
          shop_no: res.data.shop_no,
        })
      },
    });
    wx.getStorage({
      key: 'idNum',
      success: function(res) {
        that.setData({
          member_no:res.data.member_no,
          openId: res.data.openId
        })
      },
    });
    wx.getStorage({
      key: 'thisIndexLi',
      success: function(res) {
        console.log(res)
        that.setData({
          good_name: res.data.goods_name,
          shopMember_no:res.data.member_no,
        })
      },
    })

    // wx.getStorage({
    //   key: 'thisShop',
    //   success: function(res) {
    //     shop_name: res.data.shop_name
    //   },
    // })


  },
  // 购买
  payMoney: function () {
    var that = this;

    var now = parseInt(new Date().getTime()); //当前时间戳
    var nowTime = common.timeFormat(now)
    // console.log(nowTime)
    //打印发送信息
    var tempA = {};
    tempA.spu_no = this.data.spu_no;
    tempA.sku_no = this.data.sku_no;
 
    tempA.num = this.data.singlNum;
    tempA.price = this.data.singlPrice;
    tempA.total_money = this.data.total_money;
    tempA.specification = this.data.guige;
    tempA.member_no = this.data.member_no;
    tempA.imageUrl = this.data.imageUrl;
    tempA.address_id = this.data.address_id;
    tempA.shop_no = this.data.shop_no;
    tempA.comeFrom = this.data.comeFrom;
    tempA.type = this.data.category_id;//1 房产  2-普通商品 3虚拟
    tempA.merchant_no = this.data.merchant_no;
    tempA.share_member_no = this.data.share_member_no;//来自分享人的编号
    tempA.share_create_time = nowTime;//当前时间
    tempA.buy_source = this.data.buy_source;//购买来源
    // let goodsOrderProduct = tempA;
    let proList = new Array();
    var allTemp = {};
    allTemp.count_num = tempA.num;
    allTemp.member_no = this.data.member_no;
 
    allTemp.send_method = this.data.send_method;
    allTemp.address_id = this.data.address_id;
    allTemp.total_money = this.data.total_money;
    allTemp.send_money = this.data.sendMoney;
    allTemp.payment = this.data.total_money;
    allTemp.type = this.data.type;
    allTemp.openId = this.data.openId;
   
    proList.push(tempA);
    console.log('tempA', tempA)
//  一维数组改为二维数组
    // for (let m = 0; m < 1; m++) {
    //   proList[m] = new Array();
    //   for (let n = 0; n < 1; n++) {
    //     proList[m][n] = tempA;
        
    //   }
    // }

   //判断是否填写地址
    if (that.data.category_id==2){
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
            if (response.data.data.length == 0) {
              wx.showToast({
                title: '请添加收货地址',
                icon:'none'
              })
              setTimeout(function(){
                wx.navigateTo({
                  url: '../../person_page/address/address',
                })
              },1500)
              
            } else {
              // wx.showLoading({
              //   title: "加载中",
              //   mask: true
              // });
              //生成订单
              wx.getStorage({
                key: 'idNum',
                success: function (res) {
                  var memberNo = res.data.member_no;
                  wx.request({
                    url: app.globalData.URL + '/api/goods/createOrder',///api/goods/goodsShopOrder
                    data: JSON.stringify(tempA),
                    method: 'POST',
                    header: {
                      "token": res.data.token,
                      'content-type': 'application/json'
                    },
                    success: function (response) {
                      console.log(response)
                      wx.hideLoading();
                      if (response.data.code == 200) {
                        var time = response.data.data.time;
                        var numbers = response.data.data.myOrderNoList;
                        var payment = allTemp.payment;
                        wx.navigateTo({
                          url: '/pages/submitOrder/submitOrder?time=' + time + '&numbers=' + numbers + '&payment=' + payment + '&types=' + 1 + '&status=' + that.data.category_id + '&spu=' + that.data.spu_no,
                        })
                      } else {
                        wx.showToast({
                          title: response.data.message,
                          icon: 'none'
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
    }
    else{
      // wx.showLoading({
      //   title: "加载中",
      //   mask: true
      // });
      //生成订单
      wx.getStorage({
        key: 'idNum',
        success: function (res) {
          var memberNo = res.data.member_no;
          wx.request({
            url: app.globalData.URL + '/api/goods/createOrder',///api/goods/goodsShopOrder
            data: JSON.stringify(tempA),
            method: 'POST',
            header: {
              "token": res.data.token,
              'content-type': 'application/json'
            },
            success: function (response) {
              console.log(response)
              wx.hideLoading();
              if (response.data.code == 200) {
                var time = response.data.data.time;
                var numbers = response.data.data.myOrderNoList;
                var payment = allTemp.payment;
                wx.navigateTo({
                  url: '/pages/submitOrder/submitOrder?time=' + time + '&numbers=' + numbers + '&payment=' + payment + '&types=' + 1 + '&status=' + that.data.category_id + '&spu=' + that.data.spu_no,
                })
              } else {
                wx.showToast({
                  title: response.data.message,
                  icon: 'none'
                })
              }
            }
          })
        },
      })
    }
    
  },

  

  
})