// pages/huose/huose.js
const app = getApp();
var common = require("../../utils/common.js");
var amapFile = require('../../utils/amap-wx.js');
var markersData = {
  latitude: '',//纬度
  longitude: '',//经度
  key: "4ada276712c47bf88a9cdc6d41248a2a"//申请的高德地图key
};
var markers = {
  latitude: '',//纬度
  longitude: '',//经度
  key: "4ada276712c47bf88a9cdc6d41248a2a"//申请的高德地图key
};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    down:'',
    code:'',
    start:1,//2 未开始 3已结束
    top1: 1,
    top2: 0,
    current: 0,
    currentIndex: 0,
    juanCurrent:0,//优惠券默认第一张被选中
    skipPage: 0,
    fadein: 0,
    isSelected: [],
    shouCang:false,
    markers: [],
    polyline: [{
      points: [{
        latitude: 31.82057,
        longitude: 117.22901,
      }, {
          latitude: 31.82057,
          longitude: 117.22901,
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true,
      shows:false,
    }],
    score: 5,
    kolstar: 5,
    goodstar: 4,
    cheap: 5,
    dateList:[],
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

    isCreate: false,
    isShow: false,
    bigImage: "",
    imagePath: '',
    template: '',
    getUserInfoFail: true,
    moreHidden: false,
    viewMoreHidden: false,
    viewBottom: "0rpx",
    showModalStatus: false, //是否显示预约弹框
    display: 1, //弹框
    phone:'', //手机号
    sendTime: '获取验证码',
    sendColor: '#ff9254',
    snsMsgWait: 60,//短信验证码倒计时
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'携带参数')
    wx.login({
      success: res => {
        this.data.code = res.code
      }
    })
    this.setData({
      scene: options.scene ? options.scene : '',//'00a10b7580b34240bd2114b3dd800283'
      goods_name: options.goods_name ? options.goods_name :'',//名称
      shopId: options.shopId ? options.shopId: '',//spu
      member_no: options.member_no ? options.member_no:'',//商品绑定的红人
      goods_stock: options.goods_stock ? options.goods_stock:0,//总库存
      goods_rest_stock: options.goods_rest_stock ? options.goods_rest_stock:0,//剩余库存
      comeFrom: options.comeFrom ? options.comeFrom : '',
      share_member_no: options.share_member_no ? options.share_member_no : '',//分享人的id
    })
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        that.setData({
          member_nos: res.data.member_no,
          nickName: res.data.nickName,//昵称
          headUrl: res.data.headUrl,//头像
          phone: res.data.mobile ? res.data.mobile : '',//手机号码 
          // phone : '',
          getUserInfoFail: false,
        })
      },
      fail: function () {
        that.setData({ getUserInfoFail: true, })
      },
    });
     
    // 小程序码 
    if (options.scene && options.scene != '' && options.scene != undefined && options.scene.length ==32) {
      that.getScene()
    } else {
      that.getNowGoodMsg()//商品详情
      that.getSeen()//围观人数
      that.getSeens()
      that.getRedList()//官方红人
    } 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  toMap: function (e) {
    var info = e.currentTarget.dataset.info[0]
    wx.openLocation({
      latitude: info.latitude,
      longitude: info.longitude,
      scale: 14,
      name: info.callout.content,
      address: this.data.goodsSkuList.address_province + this.data.goodsSkuList.address_city + this.data.goodsSkuList.address_area + this.data.goodsSkuList.address_supplement
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    var myDate = new Date();
    var yers = myDate.getFullYear();
    var yue = myDate.getMonth() + 1;
    var tian = myDate.getDate();
    

    var dataStr = yers + "-" + yue + "-" + tian;
    this.setData({
      startTime: dataStr
    })

   
  },
  // 围观人数
  getSeen:function(){
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        common.ajaxPost(
          '/api/house/look',
          {
            spu_no:that.data.shopId,
            member_no: res.data.member_no
          },
          function (data) {
            if (data.code == 200) {
              
            }
          }
        )
      },
    })
  },
  // 围观人数
  getSeens: function () {
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        common.ajaxGet(
          '/api/house/listLook',
          {
            spu_no: that.data.shopId,
            pageIndex:1,
            pageSize:10000
          },
          function (data) {
            if (data.code == 200) {
              var arr=[];
              if (data.data.list.length<10){
                for (let i = 0; i < data.data.list.length; i++) {
                  arr.push(data.data.list[i])
                }
              }else{
                for (let i = 0; i < 10; i++) {
                  arr.push(data.data.list[i])
                }
              }
              that.setData({
                totalPeople: data.data.total,//总围观数
                listLook:arr
              })
            }
          }
        )
      },
    })
  },
  // 限量秒杀
  huoseKill(e){
    let rest = e.currentTarget.dataset.rest;
    if(rest>0){
      wx.navigateTo({
        url: '/pages/huoseKill/huoseKill?shopId=' + e.currentTarget.id + '&flag=' + e.currentTarget.dataset.flag + '&currentIndex=' + e.currentTarget.dataset.index + '&shopNo=' + e.currentTarget.dataset.shopno + '&killId=' + e.currentTarget.dataset.id,
      })
    }else{
      wx.showToast({
        title: '已抢光',
        icon:'none'
      })
    }

  },
  // 轮播图改变
  swiperChange: function (e) {
    var current = e.detail.current;
    if (e.detail.source == "touch" || e.detail.source == "autoplay"){
      this.setData({
        current: current
      })
    }
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
                        wx.setStorage({
                          key: 'idNum',
                          data: numMsg,
                        });
                        that.setData({
                          getUserInfoFail: false,
                        })
                        that.loadInfo()//位置授权                         
                      }
                      // 小程序码
                      if (that.data.scene && that.data.scene != '' && that.data.scene != undefined) {
                        that.getScene()
                      } else {
                        that.getNowGoodMsg()//房产详情
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
      },
      fail: function (info) {
      }
    })
  },
  // 授权手机号码
  getPhoneNumber: function (e) {
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
                currentTab: 3
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
              that.setData({
                currentTab: 3
              })
            }
          }
        })
      },
    })
  },
  //存储手机号
  savePhone(mobile) {
    let that = this
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        var memberNo = res.data.member_no;
        wx.request({
          url: app.globalData.URL + '/api/myMobileAuth/saveMobile',
          data: {
            member_no: memberNo,
            mobile
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
  //查看图片
  clickImg: function (event) {
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
 
  //官方红人
  getRedList:function(){
    var that = this;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        common.ajaxGet(
          '/api/enjoy/officeList',
          {
            spu_no: that.data.shopId,
            pageIndex: 1,
            pageSize: 3,
            member_no: res.data.member_no
          },
          function (data) {
            if (data.code == 200) {
              that.setData({
                redList:data.data.list
              })
            }
          }
        )
      },
    })
  },
  // 更多官方红人
  moreRed:function(e){
    wx.navigateTo({
      url: '/pages/guanFred/guanFred?spu=' + this.data.shopId,
    })
  },
  regionchange(e) {
  },
  markertap(e) {
  },
  controltap(e) {
  },
  
  showPopup() {
    this.setData({ shows: true });
  },

  onCloses() {
    this.setData({ shows: false });
  },
  // 更多楼盘信息
  viewMore: common.throttle(function (event) {
    this.setData({
      moreHidden: true,
      viewMoreHidden: true,
      viewBottom: "20rpx"
    })
  }, 1000),
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
              if (that.data.houseDetail.flag == 1) {
                wx.showToast({
                  title: "取消成功",
                  })
                } else {
                  wx.showToast({
                  title: "收藏成功",
                })
              }
              that.getNowGoodMsg()//房产详情
            }
          }
        )
      },
    })
  },
  // 选择优惠券
  xuanze:function(e){
    this.setData({
      juanCurrent:e.currentTarget.id,
      coupon_id: e.currentTarget.dataset.id,//优惠券编号
    })
  },
  // 预约报名
  yuYue: function (e) {
    if (e.currentTarget.id==3){
      var start = e.currentTarget.dataset.start.split(' ');
      var end = e.currentTarget.dataset.end.split(' ');
      this.setData({
        display: 2,
        coupon_id: e.currentTarget.dataset.id,//优惠券编号
        coupon_name: e.currentTarget.dataset.coupon,//优惠券名
        end_time: end[0] ,//结束时间
        start_time: start[0] ,//开始时间
        boxType: e.currentTarget.id
      })
    }else{
      this.setData({
        display: 2,
        boxType: e.currentTarget.id
      })
    }
    
   
  },
  // 房产详情
  getNowGoodMsg: function () {
    let that = this;
    // wx.showLoading({
    //   title: '加载中...',
    // })
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.request({
          url: app.globalData.URL + '/api/enjoy/recommendGoodDeatil',
          data: {
            spu_no: that.data.shopId,
            member_no: that.data.member_no,
            member_no_me: res.data.member_no,
            comeFrom: that.data.comeFrom,
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
        
          success: function (res) {
          //  wx.hideLoading()
            if (res.data.code == 200) {

              var dataList = res.data.data.goodsCouponList ? res.data.data.goodsCouponList:0;
              // 开始时间
              var nowTime = new Date().getTime();//当前时间戳
              var downArr=[];
              // 开始时间
               for(let i=0; i< dataList.length; i++){
                 dataList[i].haveTime = 
                 (new Date((dataList[i].coupon_end_time).replace(/-/g, '/'))).getTime() - nowTime;
                 that.data.down = setInterval(() => {
                   dataList[i].haveTime -=1
                  dataList[i].hour = Math.floor(dataList[i].haveTime / 3600 / 1000);
                  dataList[i].minute = Math.floor((dataList[i].haveTime % 3600) / 60);
                  dataList[i].second = Math.floor((dataList[i].haveTime % 60) % 60);
 
                   that.setData({
                     goodsCouponList: dataList,
                   })
                 }, 1000);
                 var timeArr = dataList[i].coupon_start_time.split(' ');
                 var timeArr1 = dataList[i].coupon_end_time.split(' ');
                 dataList[i].coupon_start_time = timeArr[0] 
                 dataList[i].coupon_end_time = timeArr1[0] 
                 downArr.push(that.data.down)
               }
                // 秒杀时间转换
              var killArr = res.data.data.goodsSeckills ? res.data.data.goodsSeckills:[];
              for (let i = 0; i < killArr.length;i++){
                
                if (killArr[i].seckillStartTime < nowTime && nowTime< killArr[i].seckillEndTime){
                  killArr[i].start = '秒杀'//秒杀已开始(进行中)
                } else if (killArr[i].seckillEndTime < nowTime){
                  killArr[i].start = '已结束'//秒杀已结束
                } else if (killArr[i].seckillStartTime > nowTime){
                  killArr[i].start = '即将开始'//秒杀未开始
                }
              }
              //设置倒计时
              that.setData({
                downArr: downArr,
                coupon_id: res.data.data.goodsCouponList.length>0?res.data.data.goodsCouponList[0].id:'',
                // deliveryTime: deliveryTime,
                houseDetail: res.data.data,
                goodsSeckills: killArr,//限量秒杀
                redShop: res.data.data.redShop ? res.data.data.redShop : '',//红人店铺
                goodsSkuList: res.data.data.houseVo,//商品详情
                goodsShop: res.data.data.shop,//店铺
                goodsBurl: res.data.data.imageList,//轮播图
                beginTime: res.data.data.houseVo.publishing_start_time,//商品开始时间
                endTime: res.data.data.houseVo.publishing_end_time,//商品结束时间
                memberNoteArticleAllList: res.data.data.memberNoteArticleAllList,//笔记
                goods_tag: res.data.data.houseVo.project_introduction,//商品描述
                goods_stock: res.data.data.houseVo.stock,//总库存
                projectList: res.data.data.projectList,//项目动态
                goods_name: res.data.data.houseVo.entry_name,
                // goods_rest_stock: res.data.data.goods_rest_stock,//剩余库存

                markers: [{
                  iconPath: "/img/icon/diwei.png",
                  id: 0,
                  latitude: res.data.data.houseVo.address_latitude - 0.0065,
                  longitude: res.data.data.houseVo.address_longitude - 0.0065,
                  width: 28,
                  height: 32,
                  callout: { content: that.data.goods_name, color: "#000000", fontSize: 13, borderRadius: 1, padding: 8, display: 'BYCLICK' }
                }]
              })
             
              wx.setStorage({
                key: 'goodsSeckills',
                data: res.data.data.goodsSeckills,
              });
              wx.setStorage({
                key: 'projectList',
                data: res.data.data.projectList,
              });
               
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
                title: res.data.data.houseVo.entry_name
              });
          
            }
          }
        })
      },
    })
    
  },
// 围观人数
  // browseMore:function(){
  //   wx.navigateTo({
  //     url: '/pages/hSeen/hSeen?shopId='+this.data.shopId,
  //   })
  // },

// 报名备注
gettextValue: function (e) {
  this.setData({
    beizhu: e.detail.value
  })
},
// 关闭弹框
closeZz: function (e) {
  this.setData({
    display: 1,
    userDate: '',
    nameValue: ''
  })
},
  //姓名
  getnameValue: function (e) {
    this.setData({
      nameValue: e.detail.value
    })
  },
  //手机号
  getphoneValue: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //短信验证码
  getwordValue: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  // 看房时间
  bindDateChange: function (e) {
    this.setData({
      userDate: e.detail.value
    })
  },
  // 发送验证码
  getNum() {
    var that = this;
    var phone = that.data.phone;
    if (phone) {
      if (common.check_phone(phone)) {
        wx.getStorage({
          key: 'idNum',
          success: function (res) {
            wx.showLoading({
              title: '验证码发送中...',
            });
            common.ajaxGet('/api/sms/sendCode',
              {
                mobile: phone,
                tplCode: 'SMS_172975116',
              },
              function (data) {
                if (data.code == 200) {
                  wx.hideLoading();
                  // 60秒倒计时
                  let down = setInterval(() => {

                    that.setData({
                      smsFlag: true,
                      sendColor: '#cccccc',
                      sendTime: that.data.snsMsgWait + 's后重发',
                      snsMsgWait: that.data.snsMsgWait - 1
                    });
                    if (that.data.snsMsgWait < 0) {
                      clearInterval(down)
                      that.setData({
                        sendColor: '#ff9254',
                        sendTime: '发送验证码',
                        snsMsgWait: 60,
                        smsFlag: false
                      });
                    }
                  }, 1000);
                 
                  wx.showToast({
                    title: data.data,
                  })
                }
              })
          }
        })
      } else {
        wx.showToast({
          title: '手机号有误',
          icon: 'none'
        })
      }
    } else {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
    }
  },
// 提交信息
  submit:function(){
    
    var that = this;
    var name = that.data.nameValue;//预约人姓名
    var userDate = that.data.userDate;//看房时间

    if (!that.data.phone){
      wx.showToast({
        title: '请填写您的手机号',
        icon:'none'
      })
      return false;
    }
  
    if (that.data.boxType==2){//我要推荐
      var coupon_id = '';
      var recommend_member_no = that.data.member_nos;
      var member_no = '';
    }else{
      var coupon_id = that.data.coupon_id;
      var recommend_member_no = that.data.share_member_no;
      var member_no = that.data.member_nos;
    }
  
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        common.ajaxPost(
          '/api/house/sub',
          {
            member_no: member_no,//预约人
            mobile: that.data.phone,//预约人手机号码 

            name:'',//预约人姓名
            look_time: '',//看房时间

            item_member_no: that.data.redShop?that.data.redShop.member_no:'',//项目联系人
            recommend_member_no: recommend_member_no,//推荐人
            spu_no:that.data.shopId,//房产编号
            
            coupon_id: coupon_id,//优惠券编号
            merchant_no: that.data.goodsShop.merchant_no,
          },
          function (data) {
            if (data.code == 200) {
              wx.requestSubscribeMessage({//授权订阅消息
                tmplIds: ['9IOPmOv98qXmtG2nk4_9noK-85kg5kH2-QYVpZSn52k'],
                success(res) {
                  common.ajaxPost(
                    '/api/wxMessgae/pushSub',
                    {
                      telphone: that.data.phone,
                      houseName: that.data.goodsSkuList.entry_name,
                      spu_member_no: that.data.redShop ? that.data.redShop.member_no : '',//项目联系人
                    },
                    function (res) {
                      if (res.code == 200) {

                      }
                    }
                  )
                }
              })
              setTimeout(function(){
                wx.navigateTo({
                  url: '/pages/hDetail/hDetail?id='+data.data,
                })
              },1000)
              
              that.setData({
                display:1,
                userDate:'',
                nameValue:''
              })
            }else{
              wx.showToast({
                title: data.message,
                icon:'none'
              })
            }
          }
        )
      },
    })
    
  },
  // 关注
  guanZhu: function (e) {
    var that = this;
    var flag = e.currentTarget.id;
    var member = e.currentTarget.dataset.id;
    wx.getStorage({
      key: 'idNum',
      success: function (res) {
        wx.request({
          url: app.globalData.URL + 'api/redAndOfficeGroup/follow',
          data: {
            member_no_me: res.data.member_no,
            member_no_other: member,
          },
          method: 'GET',
          header: {
            "token": res.data.token,
            'content-type': 'application/json'
          },
          success: function (res) {
            if (res.data.code == 200 && flag == 0) {
              wx.showToast({
                title: '关注成功',
              })
            } else if (res.data.code == 200 && flag == 1) {
              wx.showToast({
                title: '取消关注',
                icon: 'none'
              })
            } else if (res.data.code == 500) {
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              })
            }
            that.getRedList()//红人列表

          }
        })
      },
    })
  },
  // 红人店铺
  redShop: function (e) {
    var member = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/redHome/redHome?member=' + member,
    })
  },
// 房产支付
  payMoney: function () {

    var that = this;
    if(that.data.start==1){
    var comeFrom = that.data.comeFrom;
    var now = parseInt(new Date().getTime()); //当前时间戳
    var nowTime = common.timeFormat(now)
    //打印发送信息
    var tempA = {};
    tempA.spu_no = that.data.houseDetail.goodsHouseDetails.spu_no;
    tempA.sku_no = '';

    tempA.num =1;
 
    // tempA.specification = '';
    tempA.member_no = that.data.member_nos;
    tempA.imageUrl = that.data.houseDetail.goodsHouseDetails.goodsHouseTypeList[0].imageUrl;
    tempA.address_id =0;
    tempA.shop_no = that.data.houseDetail.redShop.member_no;
    tempA.comeFrom = that.data.comeFrom;
    tempA.type = 1;//1 房产  2-普通商品
    tempA.merchant_no = that.data.houseDetail.shop.merchant_no;
    tempA.share_member_no = that.data.share_member_no;//来自分享人的编号
    tempA.share_create_time = nowTime;//当前时间
  
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
            "Content-Type": "application/json"
          },
          success: function (response) {
            console.log(response)
            wx.hideLoading();
            if (response.data.code==200){
              var time = response.data.data.time;
              var numbers = response.data.data.myOrderNoList;
              var payment = that.data.houseDetail.goodsHouseDetails.coupon_money;
              var spu = that.data.houseDetail.goodsHouseDetails.spu_no;

              wx.navigateTo({
                url: '/pages/submitOrder/submitOrder?time=' + time + '&numbers=' + numbers + '&payment=' + payment + '&types=' + 1+'&spu='+spu+'&status='+1,//status:1房产
              })
            }else{
              wx.showToast({
                title: response.data.message,
                icon:'none'
              })
            }
      
            return false;

          }
        })
      },
    })
    } else if (that.data.start == 2) {
      wx.showToast({
        title: '活动尚未开始',
        icon: 'none'
      })
    } else if (that.data.start == 3) {
      wx.showToast({
        title: '活动已结束',
        icon: 'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // this.data.downArr.map((k) => { clearInterval(k) })//清除多个定时器
  },
  // 优惠说明
  youHui:function(e){
    var text = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/youHui/youHui?explanation='+ text,
    })
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
//菜单切换
  change1: function () {
    this.setData({
      top1: 1,
      top2: 0
    })
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
  change2: function () {
    this.setData({
      top1: 0,
      top2: 1
    })
    this.getCommentList(0)//评论列表
    this.getGrade()//评分
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
  // 评论列表
  getCommentList: function (status) {
    var that = this;
    var status = status;
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
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
    this.data.downArr.map((k) => { clearInterval(k) })
  },
//详细说明
  shuoMing:function(e){
    var activite = e.currentTarget.id;//活动说明
    var share = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/shuoMing/shuoMing?activite=' + activite + '&share=' + share,
    })
  },
//免责申明
  shenMing:function(){
    wx.navigateTo({
      url: '/pages/shenMing/shenMing',
    })
  },
  // 拨打电话
  calling: function (e) {
    var id = e.currentTarget.id;
    wx.makePhoneCall({
      phoneNumber: id,//this.data.houseDetail.houseVo.project_phone,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  // 拨打电话
  callings: function (e) {
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
  // 客服聊天
  chat(e){
    if (e.currentTarget.id == this.data.member_nos){
      wx.showToast({
        title: '暂无权限',
        icon:'none'
      })
    }else{
      if (!this.data.redShop){
        wx.makePhoneCall({
          phoneNumber: this.data.goodsShop.mobile,
          success: function () {
            console.log("拨打电话成功！")
          },
          fail: function () {
            console.log("拨打电话失败！")
          }
        })
      }else{
        wx.navigateTo({
          url: '/pages/chat/chat?otherHead=' + e.currentTarget.dataset.head + '&otherId=' + e.currentTarget.id + '&isMe=' + 1 + '&otherName=' + e.currentTarget.dataset.name,//1我是咨询者
        })
      }
     
    }
  },
  // 更多项目
  more:function(e){
    
    var projectList = JSON.stringify(e.currentTarget.dataset.id)

    wx.navigateTo({
      url: '/pages/project/project?projectList=' + encodeURIComponent(projectList),
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
    var that = this;
    var spu_no = that.data.shopId;

    var member_no = that.data.member_nos;//分享人的userid
    return {
      title: that.data.goods_name,
      path: '/pages/huose/huose?shopId=' + spu_no + '&member_no=' + that.data.redShop.member_no + '&share_member_no=' + that.data.member_nos + '&comeFrom=' + that.data.comeFrom,
      imageUrl: '',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
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
          })
          that.getSeen()//围观人数
          that.getSeens()
          that.getRedList()//官方红人
          // wx.showLoading({
          //   title: '加载中...',
          // })
          wx.getStorage({
            key: 'idNum',
            success: function (res) {
              wx.request({
                url: app.globalData.URL + '/api/enjoy/recommendGoodDeatil',
                data: {
                  spu_no: arr[1],
                  member_no: arr[0],
                  member_no_me: res.data.member_no,
                  comeFrom: that.data.comeFrom,
                },
                method: 'GET',
                header: {
                  "token": res.data.token,
                  'content-type': 'application/json'
                },
                success: function (res) {
                  wx.hideLoading()
                  if (res.data.code == 200) {
                    var dataList = res.data.data.goodsCouponList ? res.data.data.goodsCouponList : 0;
                    // 开始时间
                    var nowTime = new Date().getTime();//当前时间戳
                    var downArr = [];
                    // 开始时间
                    for (let i = 0; i < dataList.length; i++) {
                      dataList[i].haveTime =
                        (new Date((dataList[i].coupon_end_time).replace(/-/g, '/'))).getTime() - nowTime;
                      that.data.down = setInterval(() => {
                        dataList[i].haveTime -= 1
                        dataList[i].hour = Math.floor(dataList[i].haveTime / 3600 / 1000);
                        dataList[i].minute = Math.floor((dataList[i].haveTime % 3600) / 60);
                        dataList[i].second = Math.floor((dataList[i].haveTime % 60) % 60);

                        that.setData({
                          goodsCouponList: dataList,
                        })
                      }, 1000);
                      var timeArr = dataList[i].coupon_start_time.split(' ');
                      var timeArr1 = dataList[i].coupon_end_time.split(' ');
                      dataList[i].coupon_start_time = timeArr[0] 
                      dataList[i].coupon_end_time = timeArr1[0]

                      downArr.push(that.data.down)
                    }
                    // 秒杀时间转换
                    var killArr = res.data.data.goodsSeckills ? res.data.data.goodsSeckills : [];
                    for (let i = 0; i < killArr.length; i++) {

                      if (killArr[i].seckillStartTime < nowTime && nowTime < killArr[i].seckillEndTime) {
                        killArr[i].start = '秒杀'//秒杀已开始(进行中)
                      } else if (killArr[i].seckillEndTime < nowTime) {
                        killArr[i].start = '已结束'//秒杀已结束
                      } else if (killArr[i].seckillStartTime > nowTime) {
                        killArr[i].start = '即将开始'//秒杀未开始
                      }
                    }
                    //设置倒计时
                    that.setData({
                      downArr: downArr,
                      coupon_id: res.data.data.goodsCouponList.length > 0 ? res.data.data.goodsCouponList[0].id : '',
                      // deliveryTime: deliveryTime,
                      goodsSeckills: killArr,//限量秒杀
                      houseDetail: res.data.data,
                      redShop: res.data.data.redShop ? res.data.data.redShop : '',//红人店铺
                      goodsSkuList: res.data.data.houseVo,//商品详情
                      goodsShop: res.data.data.shop,//店铺
                      goodsBurl: res.data.data.imageList,//轮播图
                      beginTime: res.data.data.houseVo.publishing_start_time,//商品开始时间
                      endTime: res.data.data.houseVo.publishing_end_time,//商品结束时间
                      memberNoteArticleAllList: res.data.data.memberNoteArticleAllList,//笔记
                      goods_tag: res.data.data.houseVo.project_introduction,//商品描述
                      goods_stock: res.data.data.houseVo.stock,//总库存
                      projectList: res.data.data.projectList,//项目动态
                      goods_name: res.data.data.houseVo.entry_name
                      // goods_rest_stock: res.data.data.goods_rest_stock,//剩余库存
                    })
                    wx.setStorage({
                      key: 'projectList',
                      data: res.data.data.projectList,
                    });
                    // 设置标题
                    wx.setNavigationBarTitle({
                      title: res.data.data.houseVo.entry_name
                    });
                    let haveTime = endTime - nowTime;
                    let down = setInterval(() => {
                      haveTime -= 1;
                      let hour = Math.floor(haveTime / 3600);
                      let restTime = haveTime % 3600;

                      let minute = Math.floor(restTime / 60);
                      if (minute < 10) { minute = '0' + minute; }
                      let second = restTime % 60;
                      if (second < 10) { second = '0' + second; }
                      that.setData({
                        hour: hour,
                        minute: minute,
                        second: second,
                      });
                      if (hour <= 0 || minute <= 0 || second <= 0) {
                        that.setData({
                          hour: 0,
                          minute: 0,
                          second: 0,
                        });
                      }
                    }, 1000);
                  }
                }
              })
            },
          })

        }
      }
    )

  },
  onImgOK(event) {
    this.setData({
      imagePath: event.detail.path
    })
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
    var that = this
    var firstPrice = String(that.data.houseDetail.goodsCouponList.length>0 ? that.data.houseDetail.goodsCouponList[0].coupon_title :'  核销券')
    var pageUrl = "pages/huose/huose"
    var house_place = that.data.goodsSkuList.address_province + (that.data.goodsSkuList.address_city === '市辖区' ?'': that.data.goodsSkuList.address_city) + that.data.goodsSkuList.address_area + that.data.goodsSkuList.address_supplement;
    return ({
      width: '610rpx',
      height: '1068rpx',
      views: [{
        type: 'image',
        url: '/img/icon/bg2.png',
        css: {
          width: '610rpx',
          height: '1068rpx',
        },
      },
        {
          type: 'image',
          url: that.data.goodsBurl[0].house_image,
          css: {
            width: '118px',
            height: '118px',
            top: `22px`,
            left: `24px`,
            borderRadius: "20rpx"
          },
        },
        {
          type: 'text',
          text: that.data.goods_name,
          css: {
            top: `72px`,
            left: `156px`,
            width: '260rpx',
            maxLines: 1,
            fontWeight: '400',
            fontSize: '13px',
            color: '#000000'
          }
        },
        {                                                                                           
          type: 'text',
          text: house_place ,
          css: {
            top: `106px`,
            left: `156px`,
            width: '280rpx',
            maxLines: 2,
            lineHeight: `18px`,
            fontWeight: '400',
            fontSize: '12px',
            color: '#F32A3A'
          }
        },
        {
          type: 'text',
          text: that.data.houseDetail.share ? that.data.houseDetail.share.goods_share : that.data.houseDetail.houseVo.distribution_description,
          css: {
            top: `150px`,
            left: `24px`,
            width: '264px',
            lineHeight:`18px`,
            maxLines: 3,
            fontWeight: '400',
            fontSize: '12px',
            color: '#7B7B7B'
          }
        },
      {
        type: 'image',
        url: that.data.headUrl,
        css: {
          width: '80rpx',
          height: '80rpx',
          top: `476rpx`,
          left: `22px`,
          borderRadius: "40rpx"
        },
      },
      {
        type: 'text',
        text: that.data.nickName,
        css: {
          top: `474rpx`,
          left: `71px`,
          width: '200rpx',
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
          top: `478rpx`,
          left: `175px`,
          width: '160rpx',
          maxLines: 1,
          fontWeight: '400',
          fontSize: '28rpx',
          color: '#000000'
        }
      },
      {
        type: 'text',
        text: '我在第一房发现了优质好房，分享给你。',
        css: {
          top: `530rpx`,
          left: `72px`,
          width: '444rpx',
          maxLines: 1,
          fontWeight: '400',
          fontSize: '10px',
          color: '#6D6D6D'
        }
      },
        {
          type: 'image',
          url: '/img/icon/bg2_1.png',
          css: {
            width: '336rpx',
            height: '198rpx',
            top: `580rpx`,
            left: `126rpx`,
          },
        },
     
      {
        type: 'text',
        text: firstPrice,
        css: [{
          top: firstPrice.length<8?`658rpx`:`646rpx`,
          left: firstPrice.length>8?`164rpx`:`240rpx`,
          width: '260rpx',
          // textAlign:'center',
          display:'block',
          maxLines: 2,
          lineHeight: `18px`,
          fontWeight: '400',
          fontSize: '14px',
          color: '#FFFFFF'
        }]
      },
      {
        type: 'image',
        url: "https://58hongren.com/api/create/produceCode?page=" + pageUrl + "&member_no=" + that.data.member_nos + "&shopId=" + that.data.shopId + "&shopNo=" + that.data.redShop.member_no,
        css: {
          width: '55px',
          height: '55px',
          top: `804rpx`,
          left: `125px`
        },
      },
      {
        type: 'text',
        text: '好房分享，扫码抢购',
        css: {
          bottom: `126rpx`,
          left: `86px`,
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