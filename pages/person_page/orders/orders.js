// pages/home_page/orders/orders.js
const app = getApp();
var common = require("../../../utils/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    search:'',
    menuList: [{
      name: "全部",num:0
    }, 
    {
      name: "待付款", num: 10
    }, 
    {
      name: "待发货", num: 20
    }, 
    {
      name: "待收货", num: 40
    }, 
    {
      name: "已收货", num: 45
    }, 
    {
      name: "交易成功", num: 50
    }, 
    {
      name: "待核销", num: 70
    },
    {
      name: "售后/维权", num: 80
    }],//订单状态:10-待付款，20-待发货（已付款），40-已发货，45-已收货 50-交易成功，60-交易关闭 
    tabScroll: 0,
    currentTab: 0,
    windowHeight: '',
    windowWidth: '',
    waitPay:[],
    takeGoodsDetail : '' //点击确认收货保存的商品信息
    // reWaitPay:[],
 },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options){
      this.setData({
        currentTab: options.page ? options.page : 0,
        numbers: options.numbers ? options.numbers : '',//订单编号
        // refuse_type: options.refuse_type ? options.refuse_type : '',//退款类型
      })
    } 
    this.getPageMsg(0);
    
  },
  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function () {
    
    // 获取上个页面参数
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    var that = this;
    if (currPage.data.types==80){//售后
      wx.getStorage({
        key: 'idNum',
        success: function (res) {
          wx.request({
            url: app.globalData.URL + '/api/refuse/refuse',
            data: {
              member_no_me: res.data.member_no,
              pageIndex: 1,
              pageSize: 100,
            },
            method: 'GET',
            header: {
              "token": res.data.token,
              'content-type': 'application/json'
            },
            success: function (response) {
              console.log(response);
              that.setData({
                refuses: response.data.data
              })
            }
          })
        },
      })
    }
  },

  showPopup(e) {
    this.setData({ show: true });
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        common.ajaxGet(
          '/api/myOrder/houseCheckCode',
          {
            my_order_no: e.currentTarget.dataset.id,
            spu_no: e.currentTarget.id
          },
          function (res) {
            if (res.code == 200) {
              that.setData({
                startTime: (res.data.startTime).split(' ')[0],
                endTime: (res.data.endTime).split(' ')[0],
                name: res.data.name,
                houseCode: res.data.houseCode,
                codeImg: "data:image/png;base64," + res.data.hx_url,//拼接base64
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
    this.setData({ show: false });
  },
// 订单搜索
  toSearch: function () {
    var that = this;
    
  },
  //回车搜索
  searchHandle: function () {
    this.toSearch()
  },
// 我的全部订单
  getPageMsg: function (type=0){
    let that = this;
    var type = type;
    // wx.showLoading({
    //   title: "加载中",
    //   mask: true
    // });
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.hideLoading();
        // console.log(res.data);
        wx.request({
          url: app.globalData.URL + '/api/myOrder/myOrderList',
          data: {
            member_no_me: res.data.member_no,
            type: type,
            pageIndex:1,
            pageSize:100,
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (response) {
            if (response.data.code==200){
              console.log(response);

              that.setData({
                waitPay: response.data.data.list
              })
              // 计算每个商家的总价
              that.dealMsg();
            } else if (response.data.code == 401){
              wx.clearStorageSync()//清除本地缓存
              wx.showModal({
                content: '登陆超时，请重新登陆',
                success(res) {
                  if (res.confirm) {
                    wx.switchTab({
                      url: '/pages/personal/personal',
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
            
          }
        })
      },
      fail: function () {
        wx.hideLoading()
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
// 取消订单
  closeMyOrder:function(e){
    var that = this;
    var myOrderNo = e.currentTarget.id;
    var type = e.currentTarget.dataset.type;
    common.ajaxGet(
      '/api/myOrder/closeMyOrder',{
        myOrderNo: myOrderNo
      },
      function(res){
        if(res.code==200){
          wx.showToast({
            title: res.data,
          })
          that.getPageMsg(that.data.type)//订单列表
         
        }
      }
    )

  },
// 申请退款
  backOrder:function(e){
    var my_order_no = e.currentTarget.id;
    var name = e.currentTarget.dataset.name;
    var img = e.currentTarget.dataset.img;
    var price = e.currentTarget.dataset.price;
    var num = e.currentTarget.dataset.num;
    var specification = e.currentTarget.dataset.specification != undefined ? e.currentTarget.dataset.specification:'暂无规格';
    var sku = e.currentTarget.dataset.sku;
    var spu = e.currentTarget.dataset.spu;
    var status = e.currentTarget.dataset.status;
    var merchantno = e.currentTarget.dataset.merchantno;
    var image = e.currentTarget.dataset.image;
    var shopname = e.currentTarget.dataset.shopname;
    var type = e.currentTarget.dataset.type;
    var total_money = e.currentTarget.dataset.totalmoney
    console.log(e.currentTarget.dataset)
    if(type==2){//实体
      wx.navigateTo({
        url: '/pages/applyOrder/applyOrder?my_order_no=' + my_order_no + '&name=' + name + '&img=' + img + '&price=' + price + '&num=' + num + '&specification=' + specification + '&sku=' + sku + '&spu=' + spu + '&status=' + status + '&merchantno=' + merchantno + '&image=' + image + '&shopname=' + shopname + '&total_money=' + total_money,
      })
    }else{//房产、虚拟
      wx.navigateTo({
        url: '/pages/applyOrderDetail/applyOrderDetail?type=' + 1 + '&my_order_no=' + my_order_no + '&name=' + name + '&img=' + img + '&price=' + price + '&num=' + num + '&specification=' + specification + '&sku=' + sku + '&spu=' + spu + '&status=' + status + '&merchantno=' + merchantno + '&image=' + image + '&shopname=' + shopname+'&types='+type,//退款(无需退货)
      })
    }
    
  },
//查看物流
  wuLiu:function(e){
    // console.log(e)
    var myOrderNo = e.currentTarget.id;
    var img = e.currentTarget.dataset.img;
    wx.navigateTo({
      url: '/pages/wuLiu/wuLiu?myOrderNo=' + myOrderNo+'&img='+img,
    })
  },
// 订单详情
  orderDetail:function(e){
    console.log(e)
    var numbers = e.currentTarget.id;
    var spu = e.currentTarget.dataset.spu;
    var status = e.currentTarget.dataset.status;//订单状态
    var refuse = e.currentTarget.dataset.refuse;//申请退款状态
    var type = e.currentTarget.dataset.type;//1房产 2实体 3虚拟 4秒杀
    // var time = e.currentTarget.dataset.time;
    // console.log(numbers, status, time)
    wx.navigateTo({
      url: '/pages/order_page/wait_pay/wait_pay?numbers=' + numbers + '&types=' + status + '&status=' + refuse + '&type=' + type + '&spu_no=' + spu,
    })
  },
// 立即支付
  payNow: function (e) {
   console.log(e)
    var myOrderNo = e.currentTarget.id;
    var payment = e.currentTarget.dataset.payment;
    var time = e.currentTarget.dataset.time;
    var status = e.currentTarget.dataset.status;
    var spu = e.currentTarget.dataset.spu;
    var isKill = e.currentTarget.dataset.type  == 4 ? true : false 
 
    // console.log(myOrderNo)
    wx.navigateTo({
      url: '/pages/submitOrder/submitOrder?numbers=' + myOrderNo + '&payment=' + payment + '&time=' + time + '&types=' + 3 + '&status=' + status + '&spu=' + spu +'&isKill='+isKill,
    })

  },
//（退货/售货）
  backOrderStatus:function(e){
    // console.log(e)
    var id = e.currentTarget.id;
    var type = e.currentTarget.dataset.type;//e.currentTarget.dataset.type
    var shop_name = e.currentTarget.dataset.shopname;
    var shopImage = e.currentTarget.dataset.shopimage;
    var good_name = e.currentTarget.dataset.name;
    console.log(id, type, shop_name)
    if (type==1){
     
      wx.navigateTo({
        url: '/pages/backOrderStatus/backOrderStatus?id=' + id + '&type=' + type + '&shop_name=' + shop_name + '&shopImage=' + shopImage + '&good_name=' + good_name+'&types='+this.data.type,
      })
    }else if(type==2){
     
      wx.navigateTo({
        url: '/pages/backOrder/backOrder?id=' + id + '&type=' + type + '&shop_name=' + shop_name + '&shopImage=' + shopImage + '&good_name=' + good_name,
      })
    }

     
  },
  dealMsg:function(){
    // console.log(this.data.waitPay);
    let tempMsg = this.data.waitPay;
    for (let i = 0; i < tempMsg.length;i++){
      for (let j = 0; j < tempMsg[i].shopOrderVoList.length;j++){
        let tempMoney = 0;
        for (let k = 0; k < tempMsg[i].shopOrderVoList[j].goodsOrderProductList.length;k++){
          tempMoney += tempMsg[i].shopOrderVoList[j].goodsOrderProductList[k].total_money;
        }
        tempMsg[i].shopOrderVoList[j].shopmoney = tempMoney;
      }
    }
    console.log(tempMsg.length);
    this.setData({
      reWaitPay: tempMsg
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  getInputValue:function(e){
    this.setData({
      search : e.detail.value,
    })
    console.log(e.detail.value)
  },
// 菜单点击
  clickMenu: function (e) {
    var current = e.currentTarget.dataset.current //获取当前tab的index
    var type = e.currentTarget.id;
    console.log(current)

    this.setData({ 
      currentTab: current,
      type:type
    })
    var oLeft = e.currentTarget.offsetLeft;
    // console.log(oLeft)  
    if (oLeft > 200) {
      this.setData({
        left: oLeft - 70,
      })
    } else {
      this.setData({
        left: 0,
      })
    }
    if(type==80){
      var that = this;
      wx.getStorage({
        key: 'idNum',
        success: function (res) {
          wx.request({
            url: app.globalData.URL + '/api/refuse/refuse',
            data: {
              member_no_me: res.data.member_no,
              pageIndex: 1,
              pageSize: 100,
            },
            method: 'GET',
            header: {
              "token": res.data.token,
              'content-type': 'application/json'
            },
            success: function (response) {
              console.log(response);
              that.setData({
                refuses: response.data.data
              })
            }
          })
        },
      })
    }else{
      this.getPageMsg(type)//订单
    }
   
  },
  changeContent: function (e) {
    var current = e.detail.current // 获取当前内容所在index,文档有
    this.setData({
      currentTab: current,
    
    })
  },
//去评论
  goodsComment:function(e){
    var id=e.currentTarget.id;
    var name = e.currentTarget.dataset.name;
    var img = e.currentTarget.dataset.img;
    var spu = e.currentTarget.dataset.spu;
    var sku = e.currentTarget.dataset.sku;
    wx.navigateTo({
      url: '/pages/goodsComment/goodsComment?member_no=' + id + '&name=' + name + '&img=' + img + '&spu=' + spu + '&sku=' + sku,
    })
  },
//商家店铺
  shopHome:function(e){
    var id = e.currentTarget.id;
    var goods = e.currentTarget.dataset.goods;
    var money = e.currentTarget.dataset.money;
    wx.navigateTo({
      url: '/pages/shopHome/shopHome?merchant_no=' + id + '&goods=' + goods + '&money=' + money,
    })
  },
  takeGoods(event) {
    let that = this 
      const { my_order_no,spu_no,sku_no} =  this.data.takeGoodsDetail
        common.ajaxGet(
          '/api/myOrder/confirmGoodsOrder',
          {
            myOrderNo :my_order_no,
            spu_no,
            sku_no
          }, function (res) {
            console.log(res)
            if (res.code == 200) {
              wx.showToast({
                title: '收货成功',
              })
              setTimeout(function () {
                that.getPageMsg(that.data.type);
              }, 1000)
            } else {
              wx.showToast({
                title: res.message,
                icon: 'none' 
              })
            }
          }
        )
  },
  closeGoods() {
  },
//确认收货
  affirm:function(e){
    this.setData({
      takeGoods :true,
      takeGoodsDetail:e.currentTarget.dataset.item 
    })
  },
  //核销码
  heXiao: function (e) {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        common.ajaxGet(
          '/api/myOrder/houseCheckCode',
          {
            my_order_no: e.currentTarget.dataset.id,
            spu_no: e.currentTarget.id
          },
          function (res) {
            if (res.code == 200) {
  
              that.setData({
                startTime: common.myTime(res.data.startTime).split(' ')[0],
                endTime: common.myTime(res.data.endTime).split(' ')[0],
                name: res.data.name,
                houseCode: res.data.houseCode
              })
            }
          }
        )
      },
    })
  },

  onPullDownRefresh: function () {
    this.getPageMsg(this.data.type);//订单列表
    wx.stopPullDownRefresh()
  },
})