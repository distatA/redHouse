// pages/home_page/good_detail/good_detail.js
const app = getApp();
var common = require("../../../utils/common");
// var common = require("../../../utils/common.js");

var amapFile = require('../../../utils/amap-wx.js');
var markersData = {
  latitude: '',//纬度
  longitude: '',//经度
  key: "4ada276712c47bf88a9cdc6d41248a2a"//申请的高德地图key
};
var wxParser = require('../../../wxParser/index.js');
const com = {
  fontSize: '30rpx',
  color: '#8e8f93'
};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    start: 1,//1正常 2活动尚未开始 3活动结束
    top1: 1,
    top2: 0,
    bnrUrlNew: [],
    score: 5,
    kolstar: 5,
    goodstar: 4,
    cheap: 5,
    commentTit: [
      {
        commentTop: '全部',
        num: 0,
        status: 1
      },
      {
        commentTop: '好评',
        num: 0,
        status: 2
      },
      {
        commentTop: '差评',
        num: 0,
        status: 3
      },
      {
        commentTop: '有图',
        num: 0,
        status: 4
      },
    ],
    windowHeight: '',
    windowWidth: '',
    currentIndex: 0,
    clientstar: 4,
    nowGoodMsgDetail: [],
    thisShop: {},
    thisGoodSkuList: [],
    thisLowPriceGoodNuw: 0,
    thisLowPriceGoodNuw2: 0,
    guige: [],
    isSelected: [],
    nowSelectGood: [],
    nowSelectGoodPicAndMsgNum: 0,
    buyNum: 1,
    skipPage: 0,
    fadein: 0,

    skipPageCart: 0,
    fadeinCart: 0,
    memberNum: '',
    show: false,//服务保证
    shows: false,//转发

    isCreate: false,
    isShow: false,
    bigImage: "",
    imagePath: '',
    template: '',
    showPhoneBox: false,
    getUserInfoFail: true,
    down: '',//定时器
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.login({
      success: res => {
        this.data.code = res.code
      }
    })
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        that.setData({
          nickName: res.data.nickName,
          headUrl: res.data.headUrl,
          member_nos: res.data.member_no,//当前登录人的
          phone: res.data.mobile || ''
          // phone:''
        })
      },
      fail: function () {
        // that.setData({
        //   getUserInfoFail: true,
        //   getStep: 1
        // })
      },
    });

    that.setData({
      scene: options.scene ? options.scene : '',//c1d81a5c76fa442981cbb63feb79bd16
      category_id: options.category_id ? options.category_id : '',//2实体 3虚拟
      shopId: options.shopId ? options.shopId : '',//spu
      goods_name: options.goods_name ? options.goods_name : '',//商品名称
      member_no: options.member_no ? options.member_no : '',//商品关联的member_no
      member_red: options.member_no ? options.member_no : '',//商品关联的member_no
      share_member_no: options.share_member_no ? options.share_member_no : '',//分享人的ID
      comeFrom: options.comeFrom ? options.comeFrom : '',
      end_time: options.end_time ? options.end_time : '',
      source: options.source ? options.source : 1,//0从商家直接买，1用户直接在红人购买，2转发红人，3转发商家
    })
    // that.getScene()
    // 小程序码
    if (options.scene && options.scene != '' && options.scene != undefined) {
      that.getScene()
    } else {
      that.getGoods()//商品详情
    }
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    this.setGoodMsg();
  },
  // 关闭手机授权弹窗
  closePhoneBox(e) {
    this.setData({
      showPhoneBox: false
    })
  },
  //微信授权
  loginApp: function (data) {
    var that = this;
    var allMsg = data.detail.userInfo;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.login({
            success: res => {
              var code = res.code;
              var member_no = that.data.member_nos ? that.data.member_nos : '';
              if (code) {
                wx.request({
                  url: app.globalData.URL + '/api/home/login',
                  data: {
                    code: code,
                    nickName: allMsg.nickName,
                    headUrl: allMsg.avatarUrl,
                    gender: allMsg.gender,
                    cityName: that.data.cityName,
                    member_no: member_no,
                  },
                  method: 'POST',
                  success: function (response) {
                    if (response.data.code == 200) {
                      var numMsg = response.data.data;
                      if (numMsg.member_no) {
                        //存当前时间到本地存储
                        var timestamp = (new Date()).getTime();
                        wx.setStorageSync('time', timestamp)
                        wx.setStorage({
                          key: 'idNum',
                          data: numMsg,
                        });
                        console.log("商品页登陆成功");
                        that.setData({
                          getUserInfoFail: false,
                        })
                        that.loadInfo()//位置授权                          
                      }
                      // 小程序码
                      if (that.data.scene && that.data.scene != '' && that.data.scene != undefined) {
                        that.getScene()
                      } else {
                        that.getGoods()//商品详情
                      }
                    } else {
                      wx.showToast({
                        title: response.data.message,
                        icon: 'none'
                      })
                    }
                  }
                })
              } else {
                console.log("登陆失败");
              }
            },
          })

        } else {
          that.setData({
            getUserInfoFail: true,
            loading: false
          })
        }
      }
    })
  },
  // 地理位置授权
  loadInfo: function () {
    var page = this;
    wx.getLocation({
      success: function (res) {
        var longitude = res.longitude
        var latitude = res.latitude
        page.loadCity(longitude, latitude)
      },
      fail: function () {
        wx.getStorage({
          key: 'idNum',
          success: function (res) {
            common.ajaxGet(
              '/api/enjoy/updateCity', {
              city: '合肥市',
              memberNo: res.data.member_no,
            },
              function (res) {

              },
            )
          }
        })
        console.log('拒绝位置授权')
      }
    })
  },
  loadCity: function (longitude, latitude) {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({ key: markersData.key });
    myAmapFun.getRegeo({
      location: '' + longitude + ',' + latitude + '',//location的格式为'经度,纬度'
      success: function (data) {
        wx.getStorage({
          key: 'idNum',
          success: function (res) {
            common.ajaxGet(
              '/api/enjoy/updateCity', {
              city: data[0].regeocodeData.addressComponent.city != '' ? data[0].regeocodeData.addressComponent.city : data[0].regeocodeData.addressComponent.province,
              memberNo: res.data.member_no,
            },
              function (res) {
              },
            )
          }
        })
        wx.setStorageSync("cityName", data[0].regeocodeData.addressComponent.city != '' ? data[0].regeocodeData.addressComponent.city : data[0].regeocodeData.addressComponent.province);
        that.setData({
          cityName: data[0].regeocodeData.addressComponent.city != '' ? data[0].regeocodeData.addressComponent.city : data[0].regeocodeData.addressComponent.province,
        })
      }
    });

    myAmapFun.getWeather({
      success: function (data) {
        that.setData({
          weather: data.weather.text
        })
        //成功回调
      },
      fail: function (info) {
        //失败回调
      }
    })
  },
  //商品详情
  getGoods: function () {
    console.log('282', this.data.member_red)
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.request({
          url: app.globalData.URL + '/api/enjoy/recommendGoodDeatil',
          data: {
            spu_no: that.data.shopId,
            member_no: that.data.member_red,
            member_no_me: res.data.member_no,
            comeFrom: that.data.comeFrom,
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (res) {
            if (res.data.code == 200) {
              // 开始时间
              var nowTime = new Date().getTime();//当前时间戳
              // 开始时间
              var date1 = new Date(res.data.data.beginTime);
              var beginTime = date1.getTime();
              // 结束时间
              var date2 = new Date(res.data.data.endTime);
              var endTime = date2.getTime();
              if (beginTime > nowTime) {//活动尚未开始
                that.setData({
                  start: 2
                })
              }
              if (endTime < nowTime) {//活动已结束
                that.setData({
                  start: 3
                })
              }
              //设置倒计时
              that.setData({
                flag: res.data.data.flag,
                thisGoodAllMsg: res.data.data,
                thisGoodSkuList: res.data.data.goodsSkuList ? res.data.data.goodsSkuList : '',
                thisShop: res.data.data.shop,
                redShop: res.data.data.redShop ? res.data.data.redShop : '',//红人店铺
                goodsName: res.data.data.goodsBrandName ? res.data.data.goodsBrandName : '',//商品品牌名
                goodsSkuList: res.data.data.goodsSkuList ? res.data.data.goodsSkuList : '',//商品详情

                goodsShop: res.data.data.shop,//店铺
                goodsSafeServiceList: res.data.data.goodsSafeServiceList ? res.data.data.goodsSafeServiceList : '',//安全保证
                goodsBurl: res.data.data.spuImageList,//轮播图
                memberNoteArticleAllList: res.data.data.memberNoteArticleAllList,//笔记
                goods_tag: res.data.data.goods_tag,//商品描述
                goods_sell_point: res.data.data.goods_sell_point,
                beginTime: res.data.data.beginTime,//商品开始时间
                endTime: res.data.data.endTime,//商品结束时间
                category_id: res.data.data.category_chose,//2实体 3虚拟
                sendMoney: res.data.data.sendMoney ? res.data.data.sendMoney : 0,//运费
                goods_stock: res.data.goods_stock ? res.data.goods_stock : 0,//总库存
                goods_rest_stock: res.data.data.goods_rest_stock ? res.data.data.goods_rest_stock : 0,//剩余库存
                goods_name: res.data.data.goods_name
              })
              let article = res.data.data.describe;
              if (article) {
                wxParser.parse({
                  bind: 'article',
                  html: article,
                  target: that
                });
              }

              // 设置标题
              wx.setNavigationBarTitle({
                title: res.data.data.goods_name
              });
              wx.setStorage({
                key: 'thisShop',
                data: res.data.data.shop,
              })
              wx.setStorage({
                key: 'redShop',
                data: res.data.data.redShop,
              })
              let haveTime = (endTime - beginTime) / 1000;
              that.setData({
                down: setInterval(() => {
                  haveTime -= 1;
                  let hour = Math.floor(haveTime / 3600);
                  let restTime = haveTime % 3600;

                  let minute = Math.floor(restTime / 60);
                  if (minute < 10) { minute = '0' + minute; }
                  let second = restTime % 60;
                  if (second < 10) { second = '0' + second; }
                  that.setData({
                    bnrUrlNew: res.data.data.spuImageList,
                    hour: hour,
                    minute: minute,
                    second: second,
                  });
                }, 1000)
              })

              var thisGoodSkuList = res.data.data.goodsSkuList;
              //其它商品信息设置
              // 取出商品最低价
              let lowPriceNum = 0;
              let goodsSkuList = res.data.data.goodsSkuList;
              if (goodsSkuList) {
                let lowPrice = goodsSkuList ? goodsSkuList[0].low_price : '';
                for (var i = 1; i < goodsSkuList.length; i++) {
                  if (goodsSkuList[i].low_price < lowPrice) {
                    lowPrice = goodsSkuList[i].low_price;
                    lowPriceNum = i;
                  }
                }
              }
              that.setData({
                thisLowPriceGoodNuw: lowPriceNum,
                thisLowPriceGoodNuw2: lowPriceNum
              })
              //商品规格
              that.setData({
                guige: res.data.data.goodsSpecAndValueVos ? res.data.data.goodsSpecAndValueVos : ''
              })

              //商品规格选中初始化
              let isSelect2 = [];

              console.log(that.data.guige)
              for (let i = 0; i < that.data.guige.length; i++) {
                for (let j = 0; j < thisGoodSkuList[lowPriceNum].goodsSpecVoList.length; j++) {
                  for (let q = 0; q < that.data.guige[i].goodsValuesVoList.length; q++) {
                    if (thisGoodSkuList[lowPriceNum].goodsSpecVoList[j].spec_value == that.data.guige[i].goodsValuesVoList[q].spec_value) {
                      isSelect2[i] = q;
                    }
                  }

                }
              }
              that.setData({
                isSelected: isSelect2
              })

              //尝试造列表
              let newGoodList = [];
              let key = '';
              let price = 0;
              let imgUrl = '';
              let goodName = '';
              for (let i in goodsSkuList) {
                for (let j in goodsSkuList[i].goodsSpecVoList) {
                  key += goodsSkuList[i].goodsSpecVoList[j].spec_value;
                  price = goodsSkuList[i].low_price;
                  imgUrl = goodsSkuList[i].image_url;
                  goodName = goodsSkuList[i].sku_name;
                  if (key == undefined) {
                    continue;
                  } else {
                    newGoodList[i] = key + ';' + price + ';' + goodName + ';' + imgUrl;
                  }
                }
                key = '';
              }
              that.setData({
                newGoodList: newGoodList
              })
            } else if (res.data.code == 401) {
              wx.clearStorageSync()//清除本地缓存
              wx.showModal({
                content: '登陆超时，请重新登陆',
                success(res) {
                  if (res.confirm) {
                    wx.switchTab({
                      url: '/pages/personal/personal',
                    })
                  } else if (res.cancel) {
                  }
                }
              })
            }
            else {
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              })
              setTimeout(function () {
                wx.navigateBack({

                })
              }, 1500)
            }
          }
        })
      },
      fail: function () {

        // wx.showModal({
        //   content: '您尚未登陆，请先登陆',
        //   success(res) {
        //     if (res.confirm) {
        //       wx.switchTab({
        //         url: '/pages/personal/personal',
        //       })
        //     } else if (res.cancel) {
        //       wx.navigateBack({

        //       })
        //     }
        //   }
        // })
      }

    })
  },
  // 客服聊天
  chat(e) {
    if (e.currentTarget.id == this.data.member_nos) {
      wx.showToast({
        title: '暂无权限',
        icon: 'none'
      })
    } else {
      if (!this.data.redShop) {
        wx.makePhoneCall({
          phoneNumber: this.data.goodsShop.mobile,
          success: function () {
            console.log("拨打电话成功！")
          },
          fail: function () {
            console.log("拨打电话失败！")
          }
        })
      } else {
        wx.navigateTo({
          url: '/pages/chat/chat?otherHead=' + e.currentTarget.dataset.head + '&otherId=' + e.currentTarget.id + '&isMe=' + 1 + '&otherName=' + e.currentTarget.dataset.name,//1我是咨询者
        })
      }

    }
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
  showPopup() {
    this.setData({ shows: true });
  },

  onCloses() {
    this.setData({ shows: false });
  },
  // 轮播图切换
  // 轮播图改变
  swiperChange: function (e) {
    var current = e.detail.current;
    if (e.detail.source == "touch" || e.detail.source == "autoplay") {
      this.setData({
        current: current
      })
    }
  },
  // 评论导航栏菜单
  changeTabs: function (e) {
    let index = e.target.dataset.index;
    let status = e.currentTarget.id;
    this.setData({
      currentIndex: index
    })
    this.getCommentList(status)
  },
  // 点击好物菜单
  change1: function () {
    this.setData({
      top1: 1,
      top2: 0
    })
  },
  // 点击评论
  change2: function () {
    this.setData({
      top1: 0,
      top2: 1
    })
    this.getCommentList(0)//评论列表
    this.getGrade()//评分
  },
  setGoodMsg: function () {
    let that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        that.setData({
          memberNum: res.data.member_no,
          member_no: res.data.member_no,
        })
      },
    })
  },


  onHide: function () {
    clearInterval(this.data.down)
  },

  onUnload: function () {
    clearInterval(this.data.down)
  },
  // 红人店铺
  redShop(e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/redHome/redHome?member=' + id,
    })
  },
  // 商家店铺
  goodsShop: function (e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/shopHome/shopHome?merchant_no=' + id,
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  //收藏
  cang: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        common.ajaxPost(
          '/api/myCollection/collection',
          {
            collect_id: id,
            collect_type: 1,//'1-商品  2-笔记 3-店铺'
            member_no: res.data.member_no
          },
          function (data) {
            if (data.code == 200) {

              if (that.data.flag == 1) {
                wx.showToast({
                  title: "取消成功",
                })
              } else {
                wx.showToast({
                  title: "收藏成功",
                })
              }
              that.getGoods()//商品详情
            }
          }
        )
      },
    })
  },
  // 判断是否是扫码进来
  getScene: function () {
    var that = this;
    common.ajaxGet(
      '/api/create/getScene',
      {
        scene: that.data.scene,

      }, res => {
        if (res.code == 200) {
          var arr = res.data.split('&')
          that.setData({
            share_member_no: arr[0],//分享人的
            shopId: arr[1],
            member_no: arr[2],//商品关联的
            comeFrom: arr[3]
          })
          wx.getStorage({
            key: 'idNum',
            success: function (res) {
              wx.request({
                url: app.globalData.URL + '/api/enjoy/recommendGoodDeatil',
                data: {
                  spu_no: arr[1],
                  member_no: arr[2],//商品关联的
                  member_no_me: res.data.member_no,
                  comeFrom: arr[3],
                },
                method: 'GET',
                header: {
                  "token": res.data.token,
                  'content-type': 'application/json'
                },
                success: function (res) {
                  if (res.data.code == 200) {

                    // 开始时间
                    var nowTime = new Date().getTime();//当前时间戳
                    // 开始时间
                    var date1 = new Date(res.data.data.beginTime);
                    var beginTime = date1.getTime();
                    // 结束时间
                    var date2 = new Date(res.data.data.endTime);
                    var endTime = date2.getTime();
                    if (beginTime > nowTime) {//活动尚未开始
                      that.setData({
                        start: 2
                      })
                    }
                    if (endTime < nowTime) {//活动已结束
                      that.setData({
                        start: 3
                      })
                    }
                    //设置倒计时
                    that.setData({
                      flag: res.data.data.flag,
                      thisGoodAllMsg: res.data.data,
                      thisGoodSkuList: res.data.data.goodsSkuList ? res.data.data.goodsSkuList : '',
                      thisShop: res.data.data.shop,
                      redShop: res.data.data.redShop ? res.data.data.redShop : '',//红人店铺
                      goodsName: res.data.data.goodsBrandName ? res.data.data.goodsBrandName : '',//商品品牌名
                      goodsSkuList: res.data.data.goodsSkuList ? res.data.data.goodsSkuList : '',//商品详情

                      goodsShop: res.data.data.shop,//店铺
                      goodsSafeServiceList: res.data.data.goodsSafeServiceList ? res.data.data.goodsSafeServiceList : '',//安全保证
                      goodsBurl: res.data.data.spuImageList,//轮播图
                      memberNoteArticleAllList: res.data.data.memberNoteArticleAllList,//笔记
                      goods_tag: res.data.data.goods_tag,//商品描述
                      goods_sell_point: res.data.data.goods_sell_point,
                      beginTime: res.data.data.beginTime,//商品开始时间
                      endTime: res.data.data.endTime,//商品结束时间
                      category_id: res.data.data.category_chose,//2实体 3虚拟
                      sendMoney: res.data.data.sendMoney ? res.data.data.sendMoney : 0,//运费
                      goods_stock: res.data.goods_stock ? res.data.goods_stock : 0,//总库存
                      goods_rest_stock: res.data.data.goods_rest_stock ? res.data.data.goods_rest_stock : 0,//剩余库存
                      goods_name: res.data.data.goods_name
                    })
                    let article = res.data.data.describe;
                    if (article) {
                      wxParser.parse({
                        bind: 'article',
                        html: article,
                        target: that
                      });
                    }
                    // 设置标题
                    wx.setNavigationBarTitle({
                      title: res.data.data.goods_name
                    });
                    wx.setStorage({
                      key: 'thisShop',
                      data: res.data.data.shop,
                    })
                    wx.setStorage({
                      key: 'redShop',
                      data: res.data.data.redShop,
                    })
                    let haveTime = (endTime - beginTime) / 1000;
                    that.setData({
                      down: setInterval(() => {
                        haveTime -= 1;
                        let hour = Math.floor(haveTime / 3600);
                        let restTime = haveTime % 3600;

                        let minute = Math.floor(restTime / 60);
                        if (minute < 10) { minute = '0' + minute; }
                        let second = restTime % 60;
                        if (second < 10) { second = '0' + second; }
                        that.setData({
                          bnrUrlNew: res.data.data.spuImageList,
                          hour: hour,
                          minute: minute,
                          second: second,
                        });
                      }, 1000)
                    })

                    var thisGoodSkuList = res.data.data.goodsSkuList;
                    //其它商品信息设置
                    // 取出商品最低价
                    let lowPriceNum = 0;
                    let goodsSkuList = res.data.data.goodsSkuList;
                    if (goodsSkuList) {
                      let lowPrice = goodsSkuList ? goodsSkuList[0].low_price : '';
                      for (var i = 1; i < goodsSkuList.length; i++) {
                        if (goodsSkuList[i].low_price < lowPrice) {
                          lowPrice = goodsSkuList[i].low_price;
                          lowPriceNum = i;
                        }
                      }
                    }
                    that.setData({
                      thisLowPriceGoodNuw: lowPriceNum,
                      thisLowPriceGoodNuw2: lowPriceNum
                    })
                    //商品规格
                    that.setData({
                      guige: res.data.data.goodsSpecAndValueVos ? res.data.data.goodsSpecAndValueVos : ''
                    })
                    //商品规格选中初始化
                    let isSelect2 = [];
                    for (let i = 0; i < that.data.guige.length; i++) {
                      for (let j = 0; j < thisGoodSkuList[lowPriceNum].goodsSpecVoList.length; j++) {
                        for (let q = 0; q < that.data.guige[i].goodsValuesVoList.length; q++) {
                          if (thisGoodSkuList[lowPriceNum].goodsSpecVoList[j].spec_value == that.data.guige[i].goodsValuesVoList[q].spec_value) {
                            isSelect2[i] = q;
                          }
                        }

                      }
                    }
                    that.setData({
                      isSelected: isSelect2
                    })
                    //尝试造列表
                    let newGoodList = [];
                    let key = '';
                    let price = 0;
                    let imgUrl = '';
                    let goodName = '';
                    for (let i in goodsSkuList) {
                      for (let j in goodsSkuList[i].goodsSpecVoList) {
                        key += goodsSkuList[i].goodsSpecVoList[j].spec_value;
                        price = goodsSkuList[i].low_price;
                        imgUrl = goodsSkuList[i].image_url;
                        goodName = goodsSkuList[i].sku_name;
                        if (key == undefined) {
                          continue;
                        } else {
                          newGoodList[i] = key + ';' + price + ';' + goodName + ';' + imgUrl;
                        }
                      }
                      key = '';
                    }
                    that.setData({
                      newGoodList: newGoodList
                    })
                  } else if (res.data.code == 401) {
                    wx.clearStorageSync()//清除本地缓存
                    wx.showModal({
                      content: '登陆超时，请重新登陆',
                      success(res) {
                        if (res.confirm) {
                          wx.switchTab({
                            url: '/pages/personal/personal',
                          })
                        } else if (res.cancel) {
                        }
                      }
                    })
                  } else {
                    wx.showToast({
                      title: res.data.message,
                      icon: 'none'
                    })
                  }
                }
              })
            },

          })

        }
      }
    )

  },
  // 笔记详情
  noteDetail: function (e) {
    var noteId = e.currentTarget.id;
    var type = e.currentTarget.dataset.type;//1-小程序发布笔记 2-小程序发布文章 3-后台发布 4后台抓取
    var comment = e.currentTarget.dataset.comment;
    var like = e.currentTarget.dataset.like;
    var read = e.currentTarget.dataset.read;
    var flag = e.currentTarget.dataset.flag;
    var member = e.currentTarget.dataset.member;
    var time = e.currentTarget.dataset.time;
    var headUrl = e.currentTarget.dataset.headurl;
    var nickName = e.currentTarget.dataset.nickname;

    var video = e.currentTarget.dataset.video;
    var title = e.currentTarget.dataset.title;
    // console.log(nickName, time,img)
    wx.navigateTo({
      url: '/pages/myNote_detail/myNote_detail?noteId=' + noteId + '&headUrl=' + headUrl + "&nickName=" + nickName + '&type=' + type + '&comment=' + comment + '&like=' + like + '&read=' + read + '&flag=' + flag + '&member=' + member + '&time=' + time + '&video=' + video + '&title=' + title,
    })
  },
  // 点赞
  zan: function (e) {
    var like_type = e.currentTarget.dataset.type;
    var like_id = e.currentTarget.id;
    var flag = e.currentTarget.dataset.flag;
    var that = this;
    // if (like_type == 3 || like_type == 4){
    //   like_type = 2
    // }
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        common.ajaxGet(
          '/api/NoteAndArticleComment/commentLike', {
          like_type: like_type, //1-笔记  2-文章  3-评论
          like_id: like_id,
          member_no: res.data.member_no,
        },
          function (res) {
            if (res.code == 200 && flag == 0) {
              wx.showToast({
                title: '点赞成功',
              })
            } else if (flag == 1) {
              wx.showToast({
                title: '取消点赞',
                icon: 'none'
              })
            }
            that.getGoods()
          },
        )
      }
    })
  },
  //查看图片
  clickImg: function (event) {
    console.log(event)
    var index = event.currentTarget.id;
    var imgArr = new Array();
    imgArr.push(index);
    wx.previewImage({
      current: imgArr[index], //当前图片地址
      urls: imgArr, //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /* 视频退出全屏时的操作 */
  fullscreenchange: function (event) {
    console.log("视频全屏的操作" + event.detail.fullScreen);
    if (event.detail.fullScreen == false) {

      var videoContext = wx.createVideoContext('houseVideo');
      videoContext.stop();
      videoContext.exitFullScreen();
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    this.setData({ shows: false });
    var that = this;
    var spu_no = that.data.shopId;

    var member_no = that.data.member_nos;//分享人的userid 

    return {
      title: that.data.goods_tag,
      path: '/pages/home_page/good_detail/good_detail?shopId=' + spu_no + '&member_no=' + that.data.redShop.member_no + '&category_id=' + that.data.category_id + '&goods_name=' + that.data.goods_name + '&share_member_no=' + that.data.member_nos + '&comeFrom=' + that.data.comeFrom,
      imageUrl: '',
      success: function (res) {
        wx.showToast({
          title: '分享成功',
        })
        // 分享成功

      },
      fail: function (res) {
        wx.showToast({
          title: '分享失败',
          icon: 'none'
        })
        // 分享失败
      }
    }
  },
  // 购买弹窗
  skipSkuPage() {
    if (!this.data.phone) {
     this.setData({
       showPhoneBox:true
     })
    } else {
      if (this.data.start == 1) {
        this.setData({
          skipPage: 1,
          fadein: 1
        })
      } else if (this.data.start == 2) {
        wx.showToast({
          title: '活动尚未开始',
          icon: 'none'
        })
      } else if (this.data.start == 3) {
        wx.showToast({
          title: '活动已结束',
          icon: 'none'
        })
      }
    }


  },
  closeSkipPage: function () {
    this.setData({
      skipPage: 0,
      fadein: 0
    })
  },
  closeSkipPageCart: function () {
    this.setData({
      skipPageCart: 0,
      fadeinCart: 0
    })
  },
  // 选择商品
  selectThis: function (e) {
    let x = e.currentTarget.dataset.detailkey;
    let y = e.currentTarget.dataset.standard;
    let nowSelect = this.data.isSelected;
    nowSelect[y] = x;


    let numChangeCharactor = '';
    let numChangeCharactor1 = '';
    for (let j = 0; j < this.data.guige.length; j++) {
      numChangeCharactor += this.data.guige[j].goodsValuesVoList[nowSelect[j]].spec_value;
    }
    for (let q = this.data.guige.length - 1; q >= 0; q--) {
      numChangeCharactor1 += this.data.guige[q].goodsValuesVoList[nowSelect[q]].spec_value;
    }
    this.setData({
      isSelected: nowSelect,
      nowSelectGood: numChangeCharactor,
    })
    let thisNum = -1;
    for (let i = 0; i < this.data.newGoodList.length; i++) {
      let as = this.data.newGoodList[i];
      if (as == undefined) {
        continue;
      } else if (as.indexOf(numChangeCharactor) >= 0 || as.indexOf(numChangeCharactor1) >= 0) {
        thisNum = i;
      }
    }
    this.setData({
      thisLowPriceGoodNuw2: thisNum
    })
    //物品信息缓存
    // this.setGoodInfo();
  },

  deleteBuyNum: function () {
    if (this.data.buyNum <= 1) {
      return;
    } else {
      let deleteNum = this.data.buyNum - 1;
      this.setData({
        buyNum: deleteNum
      })
    }
  },

  addBuyNum: function () {
    let addNum = this.data.buyNum + 1;
    this.setData({
      buyNum: addNum
    })
  },
  // 检测是否授权手机号
  checkPhone: function () {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {

        common.ajaxGet('/api/myMobileAuth/auth', {
          member_no: res.data.member_no,
        },
          function (data) {
            if (data.code == 200) {
              that.setData({
                phoneNum: data.data
              })
              that.sureBuy();
            } else {
              that.setData({
                getUserInfoFail: true,
                getStep: 2
              })
            }
          })
      }


    })
  },
// 授权手机号码
  getPhoneNumber (e) {
    let that = this 
    var iv = e.detail.iv;
    var encryptedData = e.detail.encryptedData;
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
            if (e.detail.errMsg == 'getPhoneNumber:ok') {
              // 本地拿到并修改用户数据
              let idNum = wx.getStorageSync('idNum')
              idNum.mobile = res.data.data
              wx.setStorageSync('idNum', idNum)
              that.setData({
                phone: res.data.data,
                showPhoneBox:false
              })
              that.savePhone(res.data.data)
              wx.setStorage({
                key: 'phone',
                data: res.data,
              })
            } else {
              wx.showToast({
                title: '获取号码失败',
                icon: 'none'
              })
            }
          }
        })
      },
    })
  },
  //存储手机号
  savePhone(phone) {
    let that = this
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        var memberNo = res.data.member_no;
        wx.request({
          url: app.globalData.URL + '/api/myMobileAuth/saveMobile',
          data: {
            member_no: memberNo,
            mobile: phone
          },
          method: 'GET',
          success: function (response) {
            if (response.data.code == 200) {
              console.log('保存手机号成功');
            } else {
              wx.showToast({
                title: response.data.message,
                icon: 'none'
              })
            }
          }
        })
      }
    })
  },

  // 购买
  sureBuy: function () {
    console.log(this.data.thisLowPriceGoodNuw2);
    var thingNum = this.data.thisLowPriceGoodNuw2;
    var thisThing = {};
    if (this.data.thisGoodAllMsg.is_open != 1) {//无规格
      thisThing.image_url = this.data.thisGoodAllMsg.spuImageList[0].image_url;
      thisThing.sku_name = this.data.goods_name;
      thisThing.low_price = this.data.thisGoodAllMsg.lowerPrice;
      thisThing.spu_no = this.data.shopId;
    } else {//有规格
      console.log(this.data.thisGoodSkuList[thingNum].image_url)
      thisThing.image_url = this.data.thisGoodSkuList[thingNum].image_url;
      thisThing.sku_name = this.data.thisGoodSkuList[thingNum].sku_name;
      thisThing.low_price = this.data.thisGoodSkuList[thingNum].low_price;
      thisThing.sku_no = this.data.thisGoodSkuList[thingNum].sku_no;
      thisThing.spu_no = this.data.thisGoodSkuList[thingNum].spu_no;
      let guige = '';
      for (var i = 0; i < this.data.thisGoodSkuList[thingNum].goodsSpecVoList.length; i++) {
        guige = guige + this.data.thisGoodSkuList[thingNum].goodsSpecVoList[i].spec_value;
      }
      thisThing.guige = guige;
    }

    thisThing.num = this.data.buyNum;
    thisThing.shop_no = this.data.redShop.member_no;//红人编号
    thisThing.merchant_no = this.data.goodsShop ? this.data.goodsShop.merchant_no : '';//红人编号
    wx.setStorage({
      key: 'thisThing',
      data: thisThing,
    })
    //跳转前关闭弹窗
    this.setData({
      skipPage: 0
    })
    if (this.data.share_member_no) {//分享进来
      if (!this.data.redShop) {
        var buy_source = 3//从商家分享
      } else {
        var buy_source = 2//从红人分享
      }
    } else {//不是分享进来
      var buy_source = this.data.source
    }
    var comeFrom = this.data.comeFrom;
    wx.navigateTo({
      url: '../../person_page/order_detail/order_detail?share_member_no=' + this.data.share_member_no + '&comeFrom=' + comeFrom + '&category_id=' + this.data.category_id + '&sendMoney=' + this.data.sendMoney + '&buy_source=' + buy_source,
    })
  },
  //加入购物车
  sureInCart: function () {
    let that = this;
    //判断是否有购物车
    wx.getStorage({
      key: 'cart',
      success: function (res) {
        that.judgeShop();
      },
      fail: function (error) {
        //购物车初始化并加入第一件物品
        that.cartInit();
      }
    })
  },
  //购物车初始化
  cartInit: function () {
    let that = this;
    var cart = [];
    var shop = {};
    var goodList = [];
    //初始商铺加入
    shop.name = this.data.thisShop.shop_name;
    shop.headImg = this.data.thisShop.shopImage;
    shop.merchant_no = this.data.thisShop.merchant_no;
    shop.id = this.data.thisShop.id;

    shop.state = false;
    shop.member_no = this.data.memberNum;
    cart.unshift(shop);
    //初始物品加入
    let tempGood = {};
    let tempShopId = that.data.thisShop.shop_id;
    let tempIndex = 0;

    tempGood.num = that.data.buyNum;

    tempGood.merchant_no = that.data.thisShop.merchant_no;
    tempGood.share_member_no = that.data.share_member_no;//来自分享人ID
    tempGood.state = false;
    tempGood.shop_no = that.data.redShop.member_no;//红人店铺的member_no
    tempGood.comeFrom = that.data.comeFrom;
    tempGood.member_no = that.data.memberNum;

    // 判断是否有规格
    if (that.data.thisGoodAllMsg.is_open == 1) {//有规格
      let selectGood = that.data.thisGoodSkuList[that.data.thisLowPriceGoodNuw2];
      tempGood.spu_no = selectGood.spu_no;
      tempGood.sku_no = selectGood.sku_no;
      tempGood.good_name = selectGood.sku_name;
      tempGood.imageUrl = selectGood.image_url;
      tempGood.price = selectGood.low_price;
      tempGood.total_money = selectGood.low_price * that.data.buyNum;
      // 规格
      let thingNum = that.data.thisLowPriceGoodNuw2;
      let specification = '';
      for (let i = 0; i < that.data.thisGoodSkuList[thingNum].goodsSpecVoList.length; i++) {
        specification = specification + that.data.thisGoodSkuList[thingNum].goodsSpecVoList[i].spec_value;
      }
      tempGood.specification = specification;
      goodList.push(tempGood)
    } else {
      let selectGood = that.data.thisGoodAllMsg;
      tempGood.spu_no = that.data.shopId;

      tempGood.good_name = that.data.goods_name;
      tempGood.imageUrl = selectGood.spuImageList[0].image_url;
      tempGood.price = selectGood.lowerPrice;
      tempGood.total_money = selectGood.lowerPrice * that.data.buyNum;
      goodList.push(tempGood)
    }
    shop.goodList = goodList;
    wx.setStorage({
      key: 'cart',
      data: cart,
    });
    this.setData({
      cart: cart,
      skipPageCart: 0,
      fadeinCart: 0
    })
    wx.showToast({
      title: '添加购物车成功',
    })
  },
  judgeShop: function () {
    var p = false;
    var m = false;
    let that = this;
    let tempShopId = that.data.thisShop.merchant_no;
    let tempShopNum = 0;
    var shopExist;
    var goodExist;
    let tempShops = {};
    let goodList = [];
    tempShops.name = that.data.thisShop.shop_name;
    tempShops.headImg = that.data.thisShop.shopImage;
    tempShops.merchant_no = that.data.thisShop.merchant_no;
    tempShops.id = that.data.thisShop.id;
    tempShops.goodList = goodList;
    tempShops.state = false;
    tempShops.member_no = that.data.memberNum;

    if (this.data.share_member_no) {//分享进来
      if (!this.data.redShop) {
        var buy_source = 3//从商家分享
      } else {
        var buy_source = 2//从红人分享
      }
    } else {//不是分享进来
      var buy_source = this.data.source
    }

    //当前物品
    let tempGood = {};
    console.log(that.data.thisGoodAllMsg.is_open)
    // 判断是否有规格
    if (that.data.thisGoodAllMsg.is_open == 1) {//有规格
      let selectGood = that.data.thisGoodSkuList[that.data.thisLowPriceGoodNuw2];
      tempGood.spu_no = selectGood.spu_no;
      tempGood.sku_no = selectGood.sku_no;
      tempGood.good_name = selectGood.sku_name;
      tempGood.imageUrl = selectGood.image_url;
      tempGood.price = selectGood.low_price;
      tempGood.total_money = selectGood.low_price * that.data.buyNum;
      // 规格
      let thingNum = that.data.thisLowPriceGoodNuw2;
      let specification = '';
      for (let i = 0; i < that.data.thisGoodSkuList[thingNum].goodsSpecVoList.length; i++) {
        specification = specification + that.data.thisGoodSkuList[thingNum].goodsSpecVoList[i].spec_value;
      }
      tempGood.specification = specification;
      // goodList.push(tempGood)
    } else {
      let selectGood = that.data.thisGoodAllMsg;
      tempGood.spu_no = that.data.shopId;
      // tempGood.sku_no = selectGood.sku_no;
      tempGood.good_name = that.data.goods_name;
      tempGood.imageUrl = selectGood.spuImageList[0].image_url;
      tempGood.price = selectGood.lowerPrice;
      tempGood.total_money = selectGood.lowerPrice * that.data.buyNum;
      // goodList.push(tempGood)
    }

    tempGood.num = that.data.buyNum;
    tempGood.share_member_no = that.data.share_member_no;//来自分享人ID
    tempGood.merchant_no = that.data.thisShop.merchant_no;
    tempGood.shop_no = that.data.redShop.member_no;//红人店铺的member_no
    tempGood.comeFrom = that.data.comeFrom;
    tempGood.state = false;
    tempGood.member_no = that.data.memberNum;
    // 更新购物车
    wx.getStorage({
      key: 'cart',
      success: function (res) {
        let tempCart = res.data;
        that.setData({
          cart: res.data
        })
        //判断shop是否存在
        for (let k = 0; k < tempCart.length; k++) {
          if (tempShopId === tempCart[k].merchant_no) {
            p = true;
            for (let j = 0; j < tempCart[k].goodList.length; j++) {
              if (tempCart[k].goodList[j].spu_no === tempGood.spu_no) {
                m = true;
                tempCart[k].goodList[j].num += that.data.buyNum;
                tempCart[k].goodList[j].good_name = that.data.goods_name;
                tempCart[k].goodList[j].total_money = tempCart[k].goodList[j].num * tempCart[k].goodList[j].price;
              }
            }
            if (m === false) {
              tempCart[k].goodList.unshift(tempGood)
            }
            break;
          }
        }
        if (!p) {
          tempShops.goodList.unshift(tempGood)
          tempCart[tempCart.length] = tempShops
        }
        wx.setStorage({
          key: 'cart',
          data: tempCart,
        })
        that.setData({
          skipPageCart: 0,
          fadeinCart: 0
        })
        wx.showToast({
          title: '添加购物车成功',
        })
      },
    })
  },

  haveShop: function () {
    let that = this;
    this.insertShop();
  },
  //加入购物车
  addInCart: function () {
    if (this.data.start == 1) {
      //选商品
      this.setData({
        skipPageCart: 1,
        fadeinCart: 1
      })
    } else if (this.data.start == 2) {
      wx.showToast({
        title: '活动尚未开始',
        icon: 'none'
      })
    } else if (this.data.start == 3) {
      wx.showToast({
        title: '活动已结束',
        icon: 'none'
      })
    }


  },
  // 评分展示
  getGrade: function () {
    var that = this;
    var spu_no = that.data.shopId;
    common.ajaxGet(
      '/api/goodsComment/goodsAllComment', {
      spu_no: spu_no,
    },
      function (data) {

        if (data.code == 200) {
          that.setData({
            // averageDisCountScores: Math.ceil(data.data.averageDisCountScores),//优惠评分
            // averageRedScore: Math.ceil(data.data.averageDisCountScores),//红人
            // averageScore: Math.ceil(data.data.averageScore),//综合优惠
            // averageSkuScore: Math.ceil(data.data.averageSkuScore),//商品
            averageDisCountScores: parseInt(data.data.averageDisCountScores),//优惠评分
            averageRedScore: parseInt(data.data.averageRedScore),//红人
            averageScore: data.data.averageScore,//综合优惠
            averageSkuScore: parseInt(data.data.averageSkuScore),//商品
            commentTit: [
              {
                commentTop: '全部',
                num: data.data.allCommmentCount,//全部数
                status: 1
              },
              {
                commentTop: '好评',
                num: data.data.goodCommentCount,//坏评
                status: 2
              },
              {
                commentTop: '差评',
                num: data.data.badCommentCount,//好评
                status: 3
              },
              {
                commentTop: '有图',
                num: data.data.imageCommentCount,//有图
                status: 4
              },
            ],
          })
        }
      }
    )

  },
  // 拨打电话
  calling: function (e) {
    var phone = e.currentTarget.id;
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  // 评论列表
  getCommentList: function (status) {
    var that = this;
    var status = status;
    // console.log(that.data.thisGoodSkuList[that.data.thisLowPriceGoodNuw2])//被选中的商品
    var spu_no = that.data.shopId;
    common.ajaxGet(
      '/api/goodsComment/goodsCommentDetails', {
      spu_no: spu_no,
      status: status,
      pageIndex: 1,
      pageSize: 500,
    },
      function (data) {
        if (data.code == 200) {
          var arr = data.data.list;
          for (var i = 0; i < arr.length; i++) {
            var grade = parseInt((arr[i].discounts_score + arr[i].red_score + arr[i].sku_score) / 3)
            arr[i].isImage = grade
          }
          that.setData({
            goodsCommentList: arr
          })
        }
      }
    )

  },
  onImgOK(event) {
    this.setData({
      imagePath: event.detail.path
    })
    // var index = event.detail.path;
    // var imgArr = new Array();
    // imgArr.push(index);
    // wx.previewImage({
    //   current: imgArr[index], //当前图片地址
    //   urls: imgArr, //所有要预览的图片的地址集合 数组形式
    //   success: function (res) { },
    //   fail: function (res) { },
    //   complete: function (res) { },
    // })
  },
  /* 弹窗的时候 阻止冒泡 */
  myCatchTouch: function () {
    return;
  },
  /// 创建海报
  createPoster: function (e) {
    this.setData({ shows: false });
    var that = this
    wx.showLoading({
      title: '正在生成图片...',
    })
    this.setData({
      template: that.palette(),
    })
    setTimeout(function () {
      wx.hideLoading()
      that.setData({

        isCreate: true,
        isShow: true
      });
    }, 1000)

  },
  /// 隐藏
  catchtap: function (callback) {
    this.setData({
      isShow: false
    })
    setTimeout(() => {
      this.setData({
        isCreate: false
      })
      if (callback && typeof callback == "function") {
        callback();
      }
    }, 400)
  },
  /// 保存图片
  btnCreate: function (obj) {
    wx.showLoading({
      title: "正在保存..."
    })
    wx.saveImageToPhotosAlbum({
      filePath: this.data.imagePath,
      success: res => {
        wx.hideLoading();
        this.catchtap(() => {
          wx.showToast({
            title: '保存成功'
          })
        });
      },
      fail: err => {
        wx.hideLoading();
        wx.showModal({
          title: '打开小程序相册授权',
          content: '请在设置中打开相册授权即可保存图片至相册',
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                success: function (data) {
                },
                fail: function (data) {
                }
              });
            } else if (res.cancel) {
              _this.catchtap(() => {
                wx.showToast({
                  title: '保存失败',
                  icon: 'none'
                })
              });
            }
          }
        })
      }
    });
  },
  palette() {
    var that = this;
    console.log(that.data.headUrl)
    if (that.data.thisGoodAllMsg.is_open == 0) {
      var firstPrice = String(that.data.thisGoodAllMsg.firstPrice)
      var lowerPrice = String(that.data.thisGoodAllMsg.lowerPrice)
    } else {
      var firstPrice = String(that.data.thisGoodSkuList[0].first_price)
      var lowerPrice = String(that.data.thisGoodSkuList[0].low_price)
    }
    var pageUrl = "pages/home_page/good_detail/good_detail"

    return ({
      width: '305px',
      height: '540px',
      views: [{
        type: 'image',
        url: '/img/icon/bg1.png',
        css: {
          width: '305px',
          height: '540px',
        },
      },
      {
        type: 'image',
        url: that.data.headUrl,
        css: {
          width: '80rpx',
          height: '80rpx',
          top: `52px`,
          left: `27px`,
          borderRadius: "40rpx"
        },
      },
      {
        type: 'text',
        text: that.data.nickName,
        css: {
          top: `51px`,
          left: `77px`,
          width: '180rpx',
          maxLines: 1,
          fontWeight: '400',
          fontSize: '32rpx',
          color: '#000000'
        }
      },
      {
        type: 'text',
        text: '为你推荐',
        css: {
          top: `55px`,
          left: `162px`,
          width: '160rpx',
          maxLines: 1,
          fontWeight: '400',
          fontSize: '28rpx',
          color: '#000000'
        }
      },
      {
        type: 'text',
        text: '我在第一房发现了特价好物，分享给你。',
        css: {
          top: `79px`,
          left: `75px`,
          width: '444rpx',
          maxLines: 1,
          fontWeight: '400',
          fontSize: '11px',
          color: '#6D6D6D'
        }
      },
      {
        type: 'image',
        url: that.data.goodsBurl[0].image_url,
        css: {
          width: '262px',
          height: '174px',
          top: `104px`,
          left: `25px`,
          borderRadius: "20rpx"
        },
      },
      {
        type: 'text',
        text: that.data.goods_name,
        css: {
          top: `295px`,
          left: `27px`,
          width: '163px',
          maxLines: 1,
          fontWeight: '400',
          fontSize: '14px',
          color: '#000000'
        }
      },
      {
        type: 'text',
        text: '￥',
        css: {
          top: `293px`,
          left: `189px`,
          width: '10px',
          maxLines: 1,
          fontWeight: '400',
          fontSize: '14px',
          color: '#FF9254'
        }
      },
      {
        type: 'text',
        text: lowerPrice,
        css: {
          top: `290px`,
          left: `202px`,
          width: '50px',
          maxLines: 1,
          fontWeight: '400',
          fontSize: '18px',
          color: '#FF9254'
        }
      },

      {
        type: 'text',
        text: '￥' + firstPrice,
        css: {
          top: `292px`,
          left: `240px`,
          width: '50px',
          maxLines: 1,
          textDecoration: 'line-through',
          fontWeight: '400',
          fontSize: '14px',
          color: '#AEAEAE'
        }
      },
      {
        type: 'text',
        text: that.data.thisGoodAllMsg.goods_tag,
        css: {
          top: `330px`,
          left: `26px`,
          width: '260px',
          lineHeight: '20px',
          maxLines: 3,
          fontWeight: '400',
          fontSize: '14px',
          color: '#727272'
        }
      },
      {
        type: 'image',
        url: "https://58hongren.com/api/create/produceCode?page=" + pageUrl + "&member_no=" + that.data.member_nos + "&shopId=" + that.data.shopId + "&shopNo=" + that.data.redShop.member_no + '&comeFrom=' + that.data.comeFrom,
        css: {
          width: '45px',
          height: '45px',
          top: `410px`,
          left: `130px`
        },
      },
      {
        type: 'text',
        text: '好物分享，快来扫码围观',
        css: {
          bottom: `63px`,
          left: `70px`,
          width: '180px',
          maxLines: 1,
          fontWeight: '400',
          fontSize: '14px',
          color: '#6D6D6D'
        }
      },

      ]
    })
  },


})