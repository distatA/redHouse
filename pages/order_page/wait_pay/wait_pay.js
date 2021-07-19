// pages/order_page/wait_pay/wait_pay.js
const app = getApp();
var common = require("../../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myOrderNo:'',
    member_no:'',
    shopMember_no:'',
    address:{},
    goodsOrderProduct:{},
    shopMember:{},
    haveTime: 0,
    hour: 0,
    minute: 0,
    second: 0,
    openId:'',
    goodName:'',
    specification:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      money: options.money ? options.money:'',
      goods: options.goods ? options.goods:'',
      types: options.types,//10-待付款，20-待发货（已付款），40-已发货，45-已收货，50-交易成功，60-交易关闭
      numbers: options.numbers ? options.numbers:'',
      hour: options.hour ? options.hour : '00',
      minute: options.minute ? options.minute : '00',
      second: options.second ? options.second : '00',
      status: options.status,
      type: options.type,//1房产 2实体 3虚拟 4房产秒杀
      spu_nos: options.spu_no,
    })
    this.changeMsg();
    
  },

  changeMsg: function () {
    let that = this;
    wx.getStorage({
      key: 'thisThing',
      success: function (res) {
        console.log(res)
        let singleAllPrice = res.data.num * res.data.low_price;
        that.setData({
          sku_no: res.data.sku_no,
          spu_no: res.data.spu_no,
          sku_name: res.data.sku_name,
          singlNum: res.data.num,
          singlPrice: res.data.low_price,
          singlTotal_money: singleAllPrice,
          guige: res.data.guige,
          imageUrl: res.data.image_url,
          merchant_no: res.data.merchant_no,
          shop_no: res.data.shop_no,
        })
      },
    });
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
        console.log(res)
        that.setData({
          address_id: res.data[0].id,
          // address:res.data[0]
        })
        // console.log(res.data[0].id);
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
  getHrMsg:function(){
    var that = this;
    wx.getStorage({
      key: 'thisIndexLi',
      success: function(res) {
        that.setData({
          shopMember_no:res.data.member_no
        })
        // that.getAllMsg();
      },
    })
  },

  getAllMsg:function(){
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.request({
          url: app.globalData.URL + '/api/myOrder/myOrderDetails',
          data: {
            myOrderNo: that.data.numbers,
            member_no: res.data.member_no,
            spu_no: that.data.spu_nos,
            type:that.data.types,//待支付
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (response) {
            console.log(response);
             var sum =0;//总价
            var goodsOrderProduct = response.data.data.goodsOrderProductList;
            for (var i = 0; i < goodsOrderProduct.length; i++){
             
              var mm = goodsOrderProduct[i].price * goodsOrderProduct[i].num;         
              sum += mm;
            }
           
            var realSum = Number((sum + goodsOrderProduct[0].send_money).toFixed(2))
            // console.log(sum)
            that.setData({
              address: response.data.data.address ? response.data.data.address :'',//地址
              lowPrice: response.data.data.lowPrice ? response.data.data.lowPrice : '',//房产价格
              goodsOrderProduct: response.data.data.goodsOrderProductList,//商品详情
              shopMember: response.data.data.merchantShop,//店铺
              sum: sum,
              realSum: realSum
            })
            
            //倒计时
            let haveTime = response.data.data.goodsOrderProductList[0].expireTime;
            if (haveTime>0){
              let down = setInterval(() => {
                haveTime -= 1;
                let hour = Math.floor(haveTime / 3600);
                let restTime = haveTime % 3600;

                let minute = Math.floor(restTime / 60);
                if (hour < 10) { hour = '0' + hour; }
                if (minute < 10) { minute = '0' + minute; }
                let second = restTime % 60;
                if (second < 10) { second = '0' + second; }
                if (haveTime==0){
                  that.setData({
                    hour: 0,
                    minute: 0,
                    second: 0,
                  });
                } else if (haveTime>0){
                  that.setData({
                    hour: hour,
                    minute: minute,
                    second: second,
                  });
                }
            
                
              }, 1000);
            }else{
              // that.cancelOrder();//倒计时结束，自动取消订单
              return;
            }
            
          }
        })
      },
    })
  },
  //商家店铺
  shopHome: function (e) {
    console.log(e)
    var id = e.currentTarget.id;
    var goods = e.currentTarget.dataset.goods;
    var money = e.currentTarget.dataset.money;
    
    wx.navigateTo({
      url: '/pages/shopHome/shopHome?merchant_no=' + id + '&goods=' + goods + '&money=' + money,
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
    this.getAllMsg();
    this.getPhone()//客服电话
  },
  // 申请退款
  backOrder: function (e) {
    var my_order_no = e.currentTarget.id;
   
    var name = e.currentTarget.dataset.name;
    var img = e.currentTarget.dataset.img;
    var price = e.currentTarget.dataset.price;
    var num = e.currentTarget.dataset.num;
    console.log(num)
    var specification = e.currentTarget.dataset.specification;
    var sku = e.currentTarget.dataset.sku;
    var spu = e.currentTarget.dataset.spu;
    var status = e.currentTarget.dataset.status;
    var merchantno = e.currentTarget.dataset.merchantno;
    var image = e.currentTarget.dataset.image;
    var shopname = e.currentTarget.dataset.shopname;
    var type = e.currentTarget.dataset.type;
    if(type==2){//实体
      wx.navigateTo({
        url: '/pages/applyOrder/applyOrder?my_order_no=' + my_order_no + '&name=' + name + '&img=' + img + '&price=' + price + '&num=' + num + '&specification=' + specification + '&sku=' + sku + '&spu=' + spu + '&status=' + status + '&merchantno=' + merchantno + '&image=' + image + '&shopname=' + shopname,
      })
    }else{
      wx.navigateTo({
        url: '/pages/applyOrderDetail/applyOrderDetail?type=' + 1 + '&my_order_no=' + my_order_no + '&name=' + name + '&img=' + img + '&price=' + price + '&num=' + num + '&specification=' + specification + '&sku=' + sku + '&spu=' + spu + '&status=' + status + '&merchantno=' + merchantno + '&image=' + image + '&shopname=' + shopname + '&types=' + type,//退款(无需退货)
      })
    }
    
  },
  //去评论
  goodsComment: function (e) {
    var id = e.currentTarget.id;
    var name = e.currentTarget.dataset.name;
    var img = e.currentTarget.dataset.img;
    wx.navigateTo({
      url: '/pages/goodsComment/goodsComment?member_no=' + id + '&name=' + name + '&img=' + img,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  //商品详情
  goodDetail: function (e) {
    var shopId = e.currentTarget.id;
    var goods_name = e.currentTarget.dataset.goods_name;
    var comeFrom = ''
   
    var type = e.currentTarget.dataset.type;
    var killId = e.currentTarget.dataset.id;
    if (type == 4) {
      wx.navigateTo({
        url: '/pages/huoseKill/huoseKill?killId=' + killId,
      })
    } else {
      wx.navigateTo({
        url: '/pages/home_page/good_detail/good_detail?shopId=' + shopId + '&comeFrom=' + comeFrom + '&goods_name=' + goods_name + '&member_no=' + this.data.member,
      })
    }
    
  },
  // 客户电话
  getPhone: function () {
    var that = this;
    common.ajaxPost(
      '/api/itemAndDetail/getItemDetail', { itemName: '客服热线' },
      function (res) {
        if (res.code == 200) {
          that.setData({
            phone: res.data[0] ? res.data[0].item_detail:''
          })

        }
      }
    )
  },
// 拨打电话
  calling:function(e){
    if (this.data.phone && this.data.phone !=''){
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
    }else{
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

  },
//复制
  copyTxt:function(e){
    // console.log(e)
    let content = e.target.dataset.text;
    wx.setClipboardData({
      data: content,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
            console.log(res);
          }
        })
      }
    })
  },

  rePayNow:function(){
   
    var that = this;
    // console.log("付款");
    //打印发送信息
    var tempA = {};
    tempA.spu_no = this.data.spu_no;
    tempA.sku_no = this.data.sku_no;
    tempA.good_name = this.data.good_name;
    tempA.num = this.data.singlNum;
    tempA.price = this.data.singlPrice;
    tempA.total_money = this.data.singlTotal_money;
    tempA.specification = this.data.guige;
    tempA.member_no = this.data.member_no;
    tempA.imageUrl = this.data.imageUrl;
    tempA.address_id = this.data.address_id;
    tempA.shop_no = this.data.shop_no;
    tempA.merchant_no = this.data.merchant_no;
    // let goodsOrderProduct = tempA;
    let proList = new Array();
    var allTemp = {};
    allTemp.count_num = tempA.num;
    allTemp.member_no = this.data.member_no;
    // allTemp.pay_method = this.data.pay_method;
    allTemp.send_method = this.data.send_method;
    allTemp.address_id = this.data.address_id;
    allTemp.total_money = tempA.total_money;
    allTemp.send_money = this.data.send_money;
    allTemp.payment = tempA.total_money;
    allTemp.type = this.data.type;
    allTemp.openId = this.data.openId;
    allTemp.share_member_no = this.data.allTemp;
    // proList.push(tempA);
    //  一维数组改为二维数组
    for (let m = 0; m < 1; m++) {
      proList[m] = new Array();
      for (let n = 0; n < 1; n++) {
        proList[m][n] = tempA;

      }
    }
    // console.log(proList)
    allTemp.orderProductList = proList;

    console.log(allTemp);

    //生成订单
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        var memberNo = res.data.member_no;
        if(that.data.type==4){
          //生成订单
          wx.navigateTo({
            url: '/pages/submitOrder/submitOrder?time=' + that.data.goodsOrderProduct[0].expireTime + '&numbers=' + that.data.goodsOrderProduct[0].my_order_no + '&payment=' + that.data.sum + '&types=' + 1 + '&spu=' + that.data.goodsOrderProduct[0].spu_no + '&status=' + 1 + '&isKill=' + true,//status:1房产
          })
        }else{
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
            var time = that.data.goodsOrderProduct.expireTime;
            var numbers = response.data.data.myOrderNoList;
            var payment = allTemp.payment;

            wx.navigateTo({
              url: '/pages/submitOrder/submitOrder?time=' + time + '&numbers=' + numbers + '&payment=' + payment,
            })
            return false;
          }
        })
        }
      },
    })
    
  },
  //退货信息
  backNews: function () {
    wx.navigateTo({
      url: '/pages/backNews/backNews?defense_no=' + this.data.result.defense_no,
    })
  },
// 核销码
  heXiao:function(e){
    var spu = e.currentTarget.id;
    var my_order_no = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: '/pages/heXiao/heXiao?spu=' + spu + '&my_order_no=' + my_order_no,
    })
  },
//取消订单
  cancelOrder:function(){
    // console.log("取消订单");
    let that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.request({
          url: app.globalData.URL + '/api/myOrder/closeMyOrder',
          data: {
            myOrderNo: that.data.goodsOrderProduct.my_order_no
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (response) {
            console.log(response);
            wx.navigateTo({
              url: '../../person_page/orders/orders',
            })
          }
        })
      },
    })



  },
  
  
})